/* =========================================================
   TEMERIA MEDIA FORGE V4 - EXPORT ENGINE
   Export standalone + OG META WhatsApp safe
========================================================= */

(function(){
  "use strict";

const PUBLIC_BASE_URL = "https://alexcaos75.github.io/Temeria-Media-Suite/";
const THUMB_FOLDER = "assets/thumb/";
const DEFAULT_OG_IMAGE = PUBLIC_BASE_URL + THUMB_FOLDER + "default.jpg";

  function slugify(text){
    return String(text || "temeria-card")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g,"-")
      .replace(/^-+|-+$/g,"") || "temeria-card";
  }

  function escapeHtml(str){
    return String(str || "")
      .replace(/&/g,"&amp;")
      .replace(/</g,"&lt;")
      .replace(/>/g,"&gt;")
      .replace(/"/g,"&quot;")
      .replace(/'/g,"&#039;");
  }

  function normalizePublicImage(url){
    url = String(url || "").trim();

    if(
      !url ||
      url.startsWith("data:") ||
      url.startsWith("blob:") ||
      url.startsWith("localStorage")
    ){
      return DEFAULT_OG_IMAGE;
    }

    if(url.startsWith("http://") || url.startsWith("https://")){
      return url;
    }

    return PUBLIC_BASE_URL + url.replace(/^\/+/, "");
  }

  function getCardSlug(state){
    const content = state?.content || {};
    return slugify(
      content.slug ||
      content.title ||
      "temeria-card"
    );
  }

  function getDynamicOGImage(state){
    const content = state?.content || {};
    const github = state?.github || {};
    const slug = getCardSlug(state);

    const preferredImage =
      github.ogImageUrl ||
      content.ogImage ||
      content.publicImage ||
      THUMB_FOLDER + slug + ".jpg";

    return normalizePublicImage(preferredImage);
  }

  function buildOGMeta(state){
    const content = state?.content || {};

    const title = content.title || "Temeria Media Forge";

    const description =
  content.phrase ||
  content.phrase2 ||
  content.subtitle ||
  content.description ||
  content.text ||
  "Card creata con Temeria Media Forge";

    const ogImage = getDynamicOGImage(state);

    return `
<meta property="og:type" content="website">
<meta property="og:site_name" content="Temeria Media Forge">
<meta property="og:title" content="${escapeHtml(title)}">
<meta property="og:description" content="${escapeHtml(description)}">
<meta property="og:image" content="${ogImage}">
<meta property="og:image:secure_url" content="${ogImage}">
<meta property="og:image:type" content="image/jpeg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">

<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escapeHtml(title)}">
<meta name="twitter:description" content="${escapeHtml(description)}">
<meta name="twitter:image" content="${ogImage}">
`.trim();
  }

  function injectOGMeta(html, state){
    const ogMeta = buildOGMeta(state);

    html = String(html || "");

    html = html.replace(/<meta\s+property=["']og:[^>]*>/gi, "");
    html = html.replace(/<meta\s+name=["']twitter:[^>]*>/gi, "");

    if(html.includes("</head>")){
      return html.replace("</head>", "\n" + ogMeta + "\n</head>");
    }

    return ogMeta + "\n" + html;
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
    const slug = getCardSlug(state);
    const fileName = slug + ".html";

    let html = window.TemeriaRenderer.buildStandaloneHTML(state);
    html = injectOGMeta(html, state);

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
    slugify,
    buildOGMeta,
    injectOGMeta,
    normalizePublicImage,
    getDynamicOGImage,
    getCardSlug
  };

  window.exportPublicCard = exportPublicCard;
  window.salvaCard = salvaCard;
  window.salvaGenerator = salvaGenerator;
  window.resetCampi = resetCampi;
  window.copiaCodice = copiaCodice;
  window.shareCurrentCard = shareCurrentCard;
})();
