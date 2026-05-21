/* =========================================================
   TEMERIA MEDIA FORGE V5
   ULTRA STABLE GITHUB PUBLISH ENGINE + OG FIX
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

  fallbackOGImage:
  "https://alexcaos75.github.io/Temeria-Media-Suite/assets/thumb/default.jpg",

  retryAttempts: 3,
  retryDelay: 1200,

  whatsappSafetyDelay: 2500,

  enableCacheBuster: true,

  githubApi: "https://api.github.com",
  base:
  "https://alexcaos75.github.io/Temeria-Media-Suite"
};

let publishLock = false;

/* =========================================================
   UTILS
========================================================= */

function delay(ms){
  return new Promise(r=>setTimeout(r, ms));
}

function withCache(url){
  if(!CONFIG.enableCacheBuster) return url;
  return url + (url.includes("?") ? "&" : "?") + "v=" + Date.now();
}

function safeBase64Unicode(str){
  const bytes = new TextEncoder().encode(str);
  let binary = "";
  bytes.forEach(b=>binary+=String.fromCharCode(b));
  return btoa(binary);
}

function extractBase64(dataUrl){
  return dataUrl?.split(",")[1] || null;
}

function getExt(dataUrl){
  if(dataUrl.includes("png")) return "png";
  if(dataUrl.includes("webp")) return "webp";
  if(dataUrl.includes("gif")) return "gif";
  if(dataUrl.includes("jpeg")) return "jpg";
  if(dataUrl.includes("jpg")) return "jpg";
  if(dataUrl.includes("mp3")) return "mp3";
  if(dataUrl.includes("wav")) return "wav";
  if(dataUrl.includes("mp4")) return "mp4";
  return "bin";
}

/* =========================================================
   GITHUB
========================================================= */

async function uploadFile(path, base64, token){

  const api =
    `${CONFIG.githubApi}/repos/${CONFIG.user}/${CONFIG.repo}/contents/${path}`;

  const res = await fetch(api,{
    method:"PUT",
    headers:{
      Authorization:`Bearer ${token}`,
      "Content-Type":"application/json"
    },
    body: JSON.stringify({
      message: "upload " + path,
      content: base64,
      branch: CONFIG.branch
    })
  });

  const data = await res.json();

  if(!res.ok) throw new Error("Upload fail " + path);

  return data;
}

/* =========================================================
   MEDIA
========================================================= */

async function uploadImage(state, slug, token){

  const img = state?.media?.mainImageRaw;

  if(!img || !img.startsWith("data:image/")){
    state.github.ogImageUrl = CONFIG.fallbackOGImage;
    return state;
  }

  const ext = getExt(img);
  const base64 = extractBase64(img);

  const path = `${CONFIG.imgFolder}/${slug}.${ext}`;

  await uploadFile(path, base64, token);

  const publicUrl = `${CONFIG.base}/${path}`;

state.github.ogImageUrl = publicUrl;
state.media.mainImagePublic = publicUrl;

  return state;
}

/* =========================================================
   OG FIX (QUI STA LA MAGIA)
========================================================= */

function injectOG(html, state){

  const title = state.content?.title || "Temeria";
  const desc =
    state.content?.phrase ||
    state.content?.text ||
    "Temeria Media Forge";

  const img =
    state.github?.ogImageUrl ||
    CONFIG.fallbackOGImage;

  const og = `
<meta property="og:type" content="website">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<meta property="og:image" content="${img}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="${img}">
`;

  html = html.replace(/<meta property="og:[^>]+>/g,"");
  html = html.replace(/<meta name="twitter:[^>]+>/g,"");

  return html.replace("</head>", og + "</head>");
}

/* =========================================================
   MAIN PUBLISH
========================================================= */

async function publishCardToGitHub(){

  if(publishLock) return;
  publishLock = true;

  try{

    const token = localStorage.getItem("TEMERIA_GITHUB_TOKEN");
    if(!token){
      alert("Token GitHub mancante");
      return;
    }

    let state = window.TemeriaForge.collectState();
    state.github = {};

    const slug =
      window.TemeriaExport.slugify(
        state.content.title
      );

    const id = Date.now();
    const fileName = `${slug}-${id}.html`;

    const publicUrl =
      `${CONFIG.base}/${CONFIG.cardsFolder}/${fileName}`;

    /* upload immagine */
    await uploadImage(state, slug + "-" + id, token);

 /* render */
let html =
  window.TemeriaRenderer.buildStandaloneHTML(
    state,
    { publicUrl }
  );

/* inject OG */
html = injectOG(html, state);

/* upload html */
await uploadFile(
  `${CONFIG.cardsFolder}/${fileName}`,
  safeBase64Unicode(html),
  token
);

    await delay(CONFIG.whatsappSafetyDelay);

    alert("Pubblicata:\n" + publicUrl);
    window.open(withCache(publicUrl));

  }catch(err){
    console.error(err);
    alert("Errore publish");
  }

  publishLock = false;
}

/* =========================================================
   API
========================================================= */

window.publishCardToGitHub = publishCardToGitHub;

})();
