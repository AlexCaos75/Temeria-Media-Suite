/* =========================================================
   TEMERIA MEDIA FORGE V4 - GITHUB PUBLISH ENGINE
   Upload immagini + MP3 + MP4 + publish card
========================================================= */

(function(){
  "use strict";

  const CONFIG = {
    user: "AlexCaos75",
    repo: "Temeria-Media-Suite",
    branch: "main",

    cardsFolder: "cards",
    imgFolder: "assets/img",
    audioFolder: "assets/audio",
    videoFolder: "assets/video"
  };

  function saveGitHubToken(){
    const token = prompt("Inserisci GitHub Token");
    if(!token) return;

    localStorage.setItem(
      "TEMERIA_GITHUB_TOKEN",
      token.trim()
    );

    alert("Token GitHub salvato.");
  }

  function getGitHubToken(){
    return localStorage.getItem(
      "TEMERIA_GITHUB_TOKEN"
    ) || "";
  }

  function safeBase64Unicode(str){
    return btoa(
      unescape(
        encodeURIComponent(str)
      )
    );
  }

function getPublishedCardURL(fileName){
  return `https://temeria.vercel.app/${CONFIG.cardsFolder}/${fileName}`;
}

function getPublicAssetURL(path){
  return `https://temeria.vercel.app/${path}`;
}

  async function getExistingSHA(apiURL, token){

    try{

      const res = await fetch(apiURL,{
        method:"GET",
        headers:{
          Authorization:`Bearer ${token}`
        }
      });

      if(!res.ok)
        return null;

      const data = await res.json();

      return data.sha || null;

    }catch(e){

      console.warn(
        "SHA check fallito",
        e
      );

      return null;
    }
  }

  async function uploadFileToGitHub(
    path,
    base64Content,
    message,
    token
  ){

    const apiURL =
      `https://api.github.com/repos/${CONFIG.user}/${CONFIG.repo}/contents/${path}`;

    const sha =
      await getExistingSHA(
        apiURL,
        token
      );

    const body = {
      message,
      content: base64Content,
      branch: CONFIG.branch
    };

    if(sha)
      body.sha = sha;

    const response = await fetch(apiURL,{
      method:"PUT",

      headers:{
        Authorization:`Bearer ${token}`,
        "Content-Type":"application/json"
      },

      body:JSON.stringify(body)
    });

    const data =
      await response.json();

    if(
      !response.ok ||
      !data.content
    ){

      console.error(data);

      throw new Error(
        "Upload GitHub fallito: " + path
      );
    }

    return data;
  }

  function extractBase64(dataUrl){

    if(
      !dataUrl ||
      !dataUrl.includes(",")
    ){
      return null;
    }

    return dataUrl.split(",")[1] || null;
  }

  function getExtensionFromDataUrl(dataUrl){

    if(dataUrl.startsWith("data:image/png"))
      return "png";

    if(dataUrl.startsWith("data:image/webp"))
      return "webp";

    if(dataUrl.startsWith("data:image/gif"))
      return "gif";

    if(dataUrl.startsWith("data:audio/mp3"))
      return "mp3";

    if(dataUrl.startsWith("data:audio/mpeg"))
      return "mp3";

    if(dataUrl.startsWith("data:audio/wav"))
      return "wav";

    if(dataUrl.startsWith("data:video/mp4"))
      return "mp4";

    return "jpg";
  }

  async function uploadMainImageIfNeeded(
    state,
    slug,
    token
  ){

    const img =
      state?.media?.mainImage || "";

    if(
      !img.startsWith("data:image/")
    ){
      return state;
    }

    const ext =
      getExtensionFromDataUrl(img);

    const base64 =
      extractBase64(img);

    if(!base64)
      return state;

    const imageName =
      `${slug}.${ext}`;

    const imagePath =
      `${CONFIG.imgFolder}/${imageName}`;

    const publicImageUrl =
      getPublicAssetURL(imagePath);

    await uploadFileToGitHub(
      imagePath,
      base64,
      `Upload image ${imageName}`,
      token
    );

    state.media.mainImage =
      publicImageUrl;

    state.github.ogImageUrl =
      publicImageUrl;

    return state;
  }

  async function uploadMP3IfNeeded(
    state,
    slug,
    token
  ){

    const audio =
      state?.media?.mp3Url || "";

    if(
      !audio.startsWith("data:audio/")
    ){
      return state;
    }

    const ext =
      getExtensionFromDataUrl(audio);

    const base64 =
      extractBase64(audio);

    if(!base64)
      return state;

    const audioName =
      `${slug}.${ext}`;

    const audioPath =
      `${CONFIG.audioFolder}/${audioName}`;

    const publicAudioUrl =
      getPublicAssetURL(audioPath);

    await uploadFileToGitHub(
      audioPath,
      base64,
      `Upload audio ${audioName}`,
      token
    );

    state.media.mp3Url =
      publicAudioUrl;

    state.media.audioMode =
      "mp3";

    return state;
  }

  async function uploadVideoIfNeeded(
    state,
    slug,
    token
  ){

    const video =
      state?.media?.videoUrl || "";

    if(
      !video.startsWith("data:video/")
    ){
      return state;
    }

    const ext =
      getExtensionFromDataUrl(video);

    const base64 =
      extractBase64(video);

    if(!base64)
      return state;

    const videoName =
      `${slug}.${ext}`;

    const videoPath =
      `${CONFIG.videoFolder}/${videoName}`;

    const publicVideoUrl =
      getPublicAssetURL(videoPath);

    await uploadFileToGitHub(
      videoPath,
      base64,
      `Upload video ${videoName}`,
      token
    );

    state.media.videoUrl =
      publicVideoUrl;

    return state;
  }

  async function publishCardToGitHub(){

    try{

      const token =
        getGitHubToken();

      if(!token){

        alert(
          "Salva prima il token GitHub."
        );

        return;
      }

      let state =
        window.TemeriaForge.collectState();

      const slug =
        window.TemeriaExport.slugify(
          state.content.title
        );

      const fileName =
        `${slug}.html`;

      const publicUrl =
        getPublishedCardURL(fileName);

      state =
        await uploadMainImageIfNeeded(
          state,
          slug,
          token
        );

      state =
        await uploadMP3IfNeeded(
          state,
          slug,
          token
        );

      state =
        await uploadVideoIfNeeded(
          state,
          slug,
          token
        );

      state.github.lastPublishedUrl =
        publicUrl;

      window.TemeriaForge.applyState(
        state
      );

      window.TemeriaForge.saveState();

      const html =
        window.TemeriaRenderer.buildStandaloneHTML(
          state,
          { publicUrl }
        );

      const cardPath =
        `${CONFIG.cardsFolder}/${fileName}`;

      await uploadFileToGitHub(
        cardPath,
        safeBase64Unicode(html),
        `Publish card ${fileName}`,
        token
      );

      window.TemeriaForge.state.github.lastPublishedUrl =
        publicUrl;

      window.TemeriaForge.saveState();

      window.TemeriaForge.safeCopyText(
        publicUrl
      );

      if(
        typeof window.genera === "function"
      ){
        window.genera();
      }

      alert(
        "Card pubblicata con successo:\n\n" +
        publicUrl
      );

      window.open(
        publicUrl,
        "_blank"
      );

    }catch(err){

      console.error(err);

      alert(
        "Publish fallito. Guarda la console."
      );
    }
  }

  window.TemeriaGitHub = {

    CONFIG,

    saveGitHubToken,

    getGitHubToken,

    publishCardToGitHub,

    uploadMainImageIfNeeded,

    uploadMP3IfNeeded,

    uploadVideoIfNeeded,

    getPublishedCardURL
  };

  window.saveGitHubToken =
    saveGitHubToken;

  window.publishCardToGitHub =
    publishCardToGitHub;

})();
