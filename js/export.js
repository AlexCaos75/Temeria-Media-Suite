/* =========================================================
   TEMERIA MEDIA FORGE V4 - EXPORT ENGINE
   Export standalone senza doppio player e senza doppio renderer
========================================================= */

(function(){
  "use strict";

  function slugify(text){
    return String(text || "temeria-card")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g,"-")
      .replace(/^-+|-+$/g,"") || "temeria-card";
  }

  function downloadTextFile(filename, content, type = "text/plain"){
    const blob = new Blob([content], { type });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
  }

  function exportPublicCard(){
    const state = window.TemeriaForge.collectState();
    const fileName = slugify(state.content.title) + ".html";
    const html = window.TemeriaRenderer.buildStandaloneHTML(state);
    downloadTextFile(fileName, html, "text/html");
    return html;
  }

  function copiaCodice(){
    const box = document.getElementById("codeBox");
    window.TemeriaForge.safeCopyText(box?.textContent || window.buildCardHTML());
    alert("Codice card copiato.");
  }

  function salvaCard(){
    exportPublicCard();
  }

  function salvaGenerator(){
    const html = document.documentElement.outerHTML;
    downloadTextFile("temeria-media-forge-generator.html", html, "text/html");
  }

  function resetCampi(){
    window.TemeriaForge.resetForge();
  }

  function shareCurrentCard(){
    const state = window.TemeriaForge.collectState();
    const url = state.github.lastPublishedUrl;
    if(!url){
      alert("Prima pubblica la card su GitHub: il link locale non è pubblico per WhatsApp/Facebook.");
      return "";
    }
    window.TemeriaForge.safeCopyText(url);
    alert("Link pubblico copiato!\n\n" + url);
    return url;
  }

  window.TemeriaExport = {
    exportPublicCard,
    downloadTextFile,
    slugify
  };

  window.exportPublicCard = exportPublicCard;
  window.salvaCard = salvaCard;
  window.salvaGenerator = salvaGenerator;
  window.resetCampi = resetCampi;
  window.copiaCodice = copiaCodice;
  window.shareCurrentCard = shareCurrentCard;
})();