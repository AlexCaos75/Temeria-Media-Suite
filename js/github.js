/* =========================================================
   TEMERIA MEDIA FORGE V4 - GITHUB PUBLISH ENGINE
   Pubblica card + immagine principale in /assets/img/
========================================================= */

(function(){
  "use strict";

  const CONFIG = {
    user: "AlexCaos75",
    repo: "Temeria-Media-Suite",
    branch: "main",
    cardsFolder: "cards",
    imgFolder: "assets/img"
  };

  function saveGitHubToken(){
    const token = prompt("Inserisci GitHub Token");
    if(!token) return;
    localStorage.setItem("TEMERIA_GITHUB_TOKEN", token.trim());
    alert("Token GitHub salvato.");
  }

  function getGitHubToken(){
    return localStorage.getItem("TEMERIA_GITHUB_TOKEN") || "";
  }

  function safeBase64Unicode(str){
    return btoa(unescape(encodeURIComponent(str)));
  }

  function getPublishedCardURL(fileName){
    return `https://${CONFIG.user}.github.io/${CONFIG.repo}/${CONFIG.cardsFolder}/${fileName}`;
  }

  function getPublicAssetURL(path){
    return `https://${CONFIG.user}.github.io/${CONFIG.repo}/${path}`;
  }

  async function getExistingSHA(apiURL, token){
    try{
      const res = await fetch(apiURL, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` }
      });

      if(!res.ok) return null;

      const data = await res.json();
      return data.sha || null;

    }catch(e){
      console.warn("SHA check fallito", e);
      return null;
    }
  }

  function dataImageToBase64(dataUrl){
    if(!dataUrl || !dataUrl.startsWith("data:image/")) return null;
    const parts = dataUrl.split(",");
    return parts[1] || null;
  }

  function getImageExtension(dataUrl){
    if(dataUrl.startsWith("data:image/png")) return "png";
    if(dataUrl.startsWith("data:image/webp")) return "webp";
    return "jpg";
  }

  async function uploadFileToGitHub(path, base64Content, message, token){
    const apiURL =
      `https://api.github.com/repos/${CONFIG.user}/${CONFIG.repo}/contents/${path}`;

    const sha = await getExistingSHA(apiURL, token);

    const body = {
      message,
      content: base64Content,
      branch: CONFIG.branch
    };

    if(sha) body.sha = sha;

    const response = await fetch(apiURL, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();

    if(!response.ok || !data.content){
      console.error(data);
      throw new Error("Upload GitHub fallito: " + path);
    }

    return data;
  }

  async function uploadMainImageIfNeeded(state, slug, token){
    const img = state?.media?.mainImage || "";

    if(!img.startsWith("data:image/")){
      return state;
    }

    const ext = getImageExtension(img);
    const base64 = dataImageToBase64(img);

    if(!base64){
      return state;
    }

    const imageName = `${slug}.${ext}`;
    const imagePath = `${CONFIG.imgFolder}/${imageName}`;
    const publicImageUrl = getPublicAssetURL(imagePath);

    await uploadFileToGitHub(
      imagePath,
      base64,
      `Upload Temeria image ${imageName}`,
      token
    );

    state.media.mainImage = publicImageUrl;

    return state;
  }

  async function publishCardToGitHub(){
    try{
      const token = getGitHubToken();

      if(!token){
        alert("Salva prima il token GitHub.");
        return;
      }

      let state = window.TemeriaForge.collectState();

      const slug = window.TemeriaExport.slugify(state.content.title);
      const fileName = `${slug}.html`;
      const publicUrl = getPublishedCardURL(fileName);

      state = await uploadMainImageIfNeeded(state, slug, token);

      state.github.lastPublishedUrl = publicUrl;

      window.TemeriaForge.applyState(state);
      window.TemeriaForge.saveState();

      const html = window.TemeriaRenderer.buildStandaloneHTML(state, {
        publicUrl
      });

      const cardPath = `${CONFIG.cardsFolder}/${fileName}`;

      await uploadFileToGitHub(
        cardPath,
        safeBase64Unicode(html),
        `Publish Temeria card ${fileName}`,
        token
      );

      window.TemeriaForge.state.github.lastPublishedUrl = publicUrl;
      window.TemeriaForge.saveState();
      window.TemeriaForge.safeCopyText(publicUrl);

      if(typeof window.genera === "function"){
        window.genera();
      }

      alert("Card pubblicata, immagine caricata e link copiato:\n\n" + publicUrl);
      window.open(publicUrl, "_blank");

    }catch(err){
      console.error(err);
      alert("Publish fallito. Guarda la console per dettagli.");
    }
  }

  window.TemeriaGitHub = {
    CONFIG,
    saveGitHubToken,
    getGitHubToken,
    publishCardToGitHub,
    getPublishedCardURL,
    uploadMainImageIfNeeded
  };

  window.saveGitHubToken = saveGitHubToken;
  window.publishCardToGitHub = publishCardToGitHub;

})();
