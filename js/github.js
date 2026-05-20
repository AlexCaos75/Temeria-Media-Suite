/* =========================================================
   TEMERIA MEDIA FORGE V5 - ULTIMATE GITHUB PUBLISH ENGINE
   Stable Publish + OG + Parallel Upload + Retry + Cache
========================================================= */

(function(){

"use strict";

/* =========================================================
   CONFIG
========================================================= */

const CONFIG = {

  user: "AlexCaos75",
  repo: "Temeria-Media-Suite",
  branch: "main",

  cardsFolder: "cards",
  imgFolder: "assets/img",
  audioFolder: "assets/audio",
  videoFolder: "assets/video",

  publishDelay: 1200,
  retryAttempts: 3,
  retryDelay: 1200,

  enableCacheBuster: true,
  enableParallelUpload: true,

  githubApi:
    "https://api.github.com",

  vercelBase:
    "https://temeria.vercel.app"
};

/* =========================================================
   INTERNAL STATE
========================================================= */

let publishLock = false;

/* =========================================================
   TOKEN
========================================================= */

function saveGitHubToken(){

  const token =
    prompt("Inserisci GitHub Token");

  if(!token)
    return;

  localStorage.setItem(
    "TEMERIA_GITHUB_TOKEN",
    token.trim()
  );

  alert("Token GitHub salvato.");
}

function getGitHubToken(){

  return (
    localStorage.getItem(
      "TEMERIA_GITHUB_TOKEN"
    ) || ""
  ).trim();
}

/* =========================================================
   HELPERS
========================================================= */

function delay(ms){

  return new Promise(resolve =>
    setTimeout(resolve, ms)
  );
}

function log(...args){

  console.log(
    "%c[TEMERIA PUBLISH]",
    "color:#b06cff;font-weight:bold",
    ...args
  );
}

function safeBase64Unicode(str){

  const bytes =
    new TextEncoder().encode(str);

  let binary = "";

  bytes.forEach(byte => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary);
}

function safeJSONParse(str, fallback = {}){

  try{
    return JSON.parse(str);
  }catch{
    return fallback;
  }
}

function generateUniqueId(){

  const now =
    new Date();

  return (
    now.getFullYear() +
    String(now.getMonth()+1).padStart(2,"0") +
    String(now.getDate()).padStart(2,"0") +
    "-" +
    String(now.getHours()).padStart(2,"0") +
    String(now.getMinutes()).padStart(2,"0") +
    String(now.getSeconds()).padStart(2,"0") +
    "-" +
    Math.random()
      .toString(36)
      .slice(2,7)
  );
}

function withCache(url){

  if(!CONFIG.enableCacheBuster)
    return url;

  const separator =
    url.includes("?") ? "&" : "?";

  return (
    url +
    separator +
    "v=" +
    Date.now()
  );
}

/* =========================================================
   PUBLIC URLS
========================================================= */

function getPublishedCardURL(fileName){

  return (
    `${CONFIG.vercelBase}/${CONFIG.cardsFolder}/${fileName}`
  );
}

function getPublicAssetURL(path){

  return (
    `${CONFIG.vercelBase}/${path}`
  );
}

/* =========================================================
   MIME + BASE64
========================================================= */

function extractBase64(dataUrl){

  if(
    !dataUrl ||
    !dataUrl.includes(",")
  ){
    return null;
  }

  return dataUrl.split(",")[1];
}

function getExtensionFromDataUrl(dataUrl){

  if(!dataUrl)
    return "bin";

  if(dataUrl.startsWith("data:image/png"))
    return "png";

  if(dataUrl.startsWith("data:image/webp"))
    return "webp";

  if(dataUrl.startsWith("data:image/gif"))
    return "gif";

  if(dataUrl.startsWith("data:image/jpeg"))
    return "jpg";

  if(dataUrl.startsWith("data:image/jpg"))
    return "jpg";

  if(dataUrl.startsWith("data:audio/mp3"))
    return "mp3";

  if(dataUrl.startsWith("data:audio/mpeg"))
    return "mp3";

  if(dataUrl.startsWith("data:audio/wav"))
    return "wav";

  if(dataUrl.startsWith("data:video/mp4"))
    return "mp4";

  return "bin";
}

/* =========================================================
   STATUS
========================================================= */

function setPublishStatus(text){

  log(text);

  const el =
    document.getElementById(
      "publishStatus"
    );

  if(el){
    el.textContent = text;
  }
}

/* =========================================================
   GITHUB SHA
========================================================= */

async function getExistingSHA(
  apiURL,
  token
){

  try{

    const res =
      await fetch(apiURL,{
        method:"GET",
        headers:{
          Authorization:
            `Bearer ${token}`
        }
      });

    if(!res.ok)
      return null;

    const data =
      await res.json();

    return data.sha || null;

  }catch(err){

    console.warn(
      "SHA check error",
      err
    );

    return null;
  }
}

/* =========================================================
   RETRY WRAPPER
========================================================= */

async function retry(fn){

  let lastError = null;

  for(
    let i = 0;
    i < CONFIG.retryAttempts;
    i++
  ){

    try{

      return await fn();

    }catch(err){

      lastError = err;

      console.warn(
        "Retry upload",
        i + 1
      );

      await delay(
        CONFIG.retryDelay
      );
    }
  }

  throw lastError;
}

/* =========================================================
   UPLOAD FILE
========================================================= */

async function uploadFileToGitHub(
  path,
  base64Content,
  message,
  token
){

  return retry(async()=>{

    const apiURL =
      `${CONFIG.githubApi}/repos/${CONFIG.user}/${CONFIG.repo}/contents/${path}`;

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

    const response =
      await fetch(apiURL,{

        method:"PUT",

        headers:{
          Authorization:
            `Bearer ${token}`,

          "Content-Type":
            "application/json"
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
        "GitHub upload failed: " + path
      );
    }

    return data;
  });
}

/* =========================================================
   MEDIA UPLOADS
========================================================= */

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

  setPublishStatus(
    "Upload immagine..."
  );

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
  withCache(
    getPublicAssetURL(imagePath)
  );
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

  setPublishStatus(
    "Upload audio..."
  );

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
    withCache(
      getPublicAssetURL(audioPath)
    );

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

  setPublishStatus(
    "Upload video..."
  );

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
    withCache(
      getPublicAssetURL(videoPath)
    );

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

/* =========================================================
   OG META FIX
========================================================= */

function ensureOGData(state, publicUrl){

  state.github =
    state.github || {};

  state.github.lastPublishedUrl =
    publicUrl;

  state.github.ogUrl =
    publicUrl;

  state.github.ogType =
    "website";

  state.github.ogTitle =
    state.content?.title || "Temeria";

  state.github.ogDescription =
    state.content?.phrase ||
"Temeria Media Forge";
}

/* =========================================================
   PUBLISH
========================================================= */

async function publishCardToGitHub(){

  if(publishLock){

    alert(
      "Publish già in corso..."
    );

    return;
  }

  publishLock = true;

  try{

    setPublishStatus(
      "Preparazione publish..."
    );

    const token =
      getGitHubToken();

    if(!token){

      alert(
        "Salva prima il token GitHub."
      );

      publishLock = false;

      return;
    }

    let state =
      window.TemeriaForge.collectState();

state.github.ogImageUrl = "";

    const slug =
      window.TemeriaExport.slugify(
        state.content.title
      );

    const uniqueId =
      generateUniqueId();

    const publishSlug =
      `${slug}-${uniqueId}`;

    const fileName =
      `${publishSlug}.html`;

    const publicUrl =
      getPublishedCardURL(
        fileName
      );

    ensureOGData(
      state,
      publicUrl
    );

    /* =========================================
       PARALLEL UPLOAD
    ========================================= */

    if(CONFIG.enableParallelUpload){

      await Promise.all([

        uploadMainImageIfNeeded(
          state,
          publishSlug,
          token
        ),

        uploadMP3IfNeeded(
          state,
          publishSlug,
          token
        ),

        uploadVideoIfNeeded(
          state,
          publishSlug,
          token
        )
      ]);

    }else{

      state =
        await uploadMainImageIfNeeded(
          state,
          publishSlug,
          token
        );

      state =
        await uploadMP3IfNeeded(
          state,
          publishSlug,
          token
        );

      state =
        await uploadVideoIfNeeded(
          state,
          publishSlug,
          token
        );
    }

    setPublishStatus(
      "Rendering HTML..."
    );

    window.TemeriaForge.applyState(
      state
    );

    window.TemeriaForge.saveState();

    const html =
      window.TemeriaRenderer
        .buildStandaloneHTML(
          state,
          { publicUrl }
        );

    setPublishStatus(
      "Upload card..."
    );

    const cardPath =
      `${CONFIG.cardsFolder}/${fileName}`;

    await uploadFileToGitHub(

      cardPath,

      safeBase64Unicode(html),

      `Publish card ${fileName}`,

      token
    );

    state.github.lastPublishedUrl =
      publicUrl;

    window.TemeriaForge.saveState();

    if(
      typeof window.genera ===
      "function"
    ){
      window.genera();
    }

    if(
      window.TemeriaForge
        ?.safeCopyText
    ){

      window.TemeriaForge
        .safeCopyText(
          publicUrl
        );
    }

    setPublishStatus(
      "Publish completato."
    );

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

    setPublishStatus(
      "Errore publish."
    );

    alert(
      "Publish fallito.\nControlla console."
    );

  }finally{

    publishLock = false;
  }
}

/* =========================================================
   PUBLIC API
========================================================= */

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
