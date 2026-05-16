/* =========================================================
   TEMERIA MEDIA FORGE V4 - GITHUB PUBLISH ENGINE
   Pubblica vere card standalone in /cards/
========================================================= */

(function(){
  "use strict";

  const CONFIG = {
    user: "AlexCaos75",
    repo: "Temeria-Media-Suite",
    branch: "main",
    cardsFolder: "cards"
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

  async function getExistingSHA(apiURL, token){
    try{
      const res = await fetch(apiURL, {
        method:"GET",
        headers:{ Authorization:`Bearer ${token}` }
      });
      if(!res.ok) return null;
      const data = await res.json();
      return data.sha || null;
    }catch(e){
      console.warn("SHA check fallito", e);
      return null;
    }
  }

  async function publishCardToGitHub(){
    try{
      const token = getGitHubToken();
      if(!token){
        alert("Salva prima il token GitHub.");
        return;
      }

      const state = window.TemeriaForge.collectState();
      const slug = window.TemeriaExport.slugify(state.content.title);
      const fileName = `${slug}.html`;
      const publicUrl = getPublishedCardURL(fileName) + `?v=${Date.now()}`;

      state.github.lastPublishedUrl = publicUrl;
      window.TemeriaForge.applyState(state);
      window.TemeriaForge.saveState();

      const html = window.TemeriaRenderer.buildStandaloneHTML(state, { publicUrl });
      const path = `${CONFIG.cardsFolder}/${fileName}`;
      const apiURL = `https://api.github.com/repos/${CONFIG.user}/${CONFIG.repo}/contents/${path}`;
      const sha = await getExistingSHA(apiURL, token);

      const body = {
        message: `Publish Temeria card ${fileName}`,
        content: safeBase64Unicode(html),
        branch: CONFIG.branch
      };

      if(sha) body.sha = sha;

      const response = await fetch(apiURL, {
        method:"PUT",
        headers:{
          Authorization:`Bearer ${token}`,
          "Content-Type":"application/json"
        },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if(!response.ok || !data.content){
        console.error(data);
        alert("Errore pubblicazione GitHub. Controlla token, repo e permessi.");
        return;
      }

      window.TemeriaForge.state.github.lastPublishedUrl = publicUrl;
      window.TemeriaForge.saveState();
      window.TemeriaForge.safeCopyText(publicUrl);

      if(typeof window.genera === "function") window.genera();

      alert("Card pubblicata e link copiato:\n\n" + publicUrl);
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
    getPublishedCardURL
  };

  window.saveGitHubToken = saveGitHubToken;
  window.publishCardToGitHub = publishCardToGitHub;
})();