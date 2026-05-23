/* =========================================================
   TEMERIA MEDIA FORGE V5
   GITHUB PUBLISH ENGINE + VIDEO PUBLIC URL
========================================================= */

(function(){
"use strict";

const CONFIG = {
  user: "AlexCaos75",
  repo: "Temeria-Media-Suite",
  branch: "main",

  cardsFolder: "cards",
  imgFolder: "assets/img",
  videoFolder: "assets/video",

  fallbackOGImage:
    "https://alexcaos75.github.io/Temeria-Media-Suite/assets/thumb/default.jpg",

  githubApi: "https://api.github.com",
  base: "https://alexcaos75.github.io/Temeria-Media-Suite",

  retryAttempts: 8,
  retryDelay: 1500,
  whatsappSafetyDelay: 2500,
  enableCacheBuster: true
};

let publishLock = false;

function delay(ms){
  return new Promise(resolve => setTimeout(resolve, ms));
}

function withCache(url, stamp){
  if(!CONFIG.enableCacheBuster) return url;
  const v = stamp || Date.now();
  return url + (url.includes("?") ? "&" : "?") + "v=" + v;
}

function safeBase64Unicode(str){
  const bytes = new TextEncoder().encode(str);
  let binary = "";
  bytes.forEach(b => binary += String.fromCharCode(b));
  return btoa(binary);
}

function extractBase64(dataUrl){
  return dataUrl?.split(",")[1] || null;
}

function getExt(dataUrl){
  if(!dataUrl) return "bin";
  if(dataUrl.includes("png")) return "png";
  if(dataUrl.includes("webp")) return "webp";
  if(dataUrl.includes("gif")) return "gif";
  if(dataUrl.includes("jpeg")) return "jpg";
  if(dataUrl.includes("jpg")) return "jpg";
  if(dataUrl.includes("mp4")) return "mp4";
  if(dataUrl.includes("webm")) return "webm";
  if(dataUrl.includes("mov")) return "mov";
  return "bin";
}

function escapeHTML(str){
  return String(str || "")
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;");
}

async function waitForPublicUrl(url, label = "file"){
  for(let i = 1; i <= CONFIG.retryAttempts; i++){
    const cleanUrl = withCache(url, Date.now() + i);

    try{
      const res = await fetch(cleanUrl, {
        method: "GET",
        cache: "no-store"
      });

      if(res.ok){
        console.log(`[TEMERIA PUBLISH] ${label} online:`, url);
        return true;
      }

      console.warn(`[TEMERIA PUBLISH] ${label} non ancora online`, i, res.status);
    }catch(err){
      console.warn(`[TEMERIA PUBLISH] ${label} non ancora online`, i, err);
    }

    await delay(CONFIG.retryDelay);
  }

  throw new Error(`${label} non raggiungibile online: ${url}`);
}

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
      message: "publish " + path,
      content: base64,
      branch: CONFIG.branch
    })
  });

  const data = await res.json();

  if(!res.ok){
    console.error("[TEMERIA PUBLISH] Upload fail:", data);
    throw new Error("Upload fail " + path);
  }

  return data;
}

async function uploadImage(state, imageSlug, token){
  const img =
    state?.media?.mainImageRaw ||
    state?.media?.mainImage ||
    "";

 if(!img || !img.startsWith("data:image/")){

  const existing =
    state.media.mainImagePublic ||
    state.media.mainImage ||
    state.github.ogImageUrl ||
    CONFIG.fallbackOGImage;

  state.github.ogImageUrl = existing;

  state.media.mainImagePublic =
    existing;

  return existing;
}

  const ext = getExt(img);
  const base64 = extractBase64(img);

  if(!base64){
    throw new Error("Immagine non valida");
  }

  const path = `${CONFIG.imgFolder}/${imageSlug}.${ext}`;
  const publicUrl = `${CONFIG.base}/${path}`;

  console.log("[TEMERIA PUBLISH] Upload immagine:", path);

  await uploadFile(path, base64, token);

  try{
    await waitForPublicUrl(publicUrl, "immagine");
  }catch(err){
    console.warn("[TEMERIA PUBLISH] immagine non ancora propagata", err);
  }

  state.github.ogImageUrl = publicUrl;
  state.media.mainImagePublic = publicUrl;

  return publicUrl;
}

async function uploadVideo(state, videoSlug, token){
  const video =
    state?.media?.videoUrl || "";

console.log("[TEMERIA VIDEO CHECK]", video.slice(0,80));

if(video.startsWith("data:image/")){
  console.warn("[TEMERIA VIDEO] Errore: videoUrl contiene una immagine, non un video");
  return "";
}

 if(!video){
  return state?.media?.videoUrlPublic || state?.media?.videoPublic || "";
}

if(video.startsWith("http")){
  state.media.videoUrlPublic = video;
  state.media.videoPublic = video;
  return video;
}

if(!video.startsWith("data:video/")){
  console.warn("[TEMERIA VIDEO] Formato video non valido:", video.slice(0,80));
  return "";
}
  let ext = "mp4";

if(video.includes("webm")) ext = "webm";
if(video.includes("mov")) ext = "mov";
  const base64 = extractBase64(video);

  if(!base64){
    throw new Error("Video non valido");
  }

  const path = `${CONFIG.videoFolder}/${videoSlug}.${ext}`;
  const publicUrl = `${CONFIG.base}/${path}`;

  console.log("[TEMERIA PUBLISH] Upload video:", path);

  await uploadFile(path, base64, token);

  try{
    await waitForPublicUrl(publicUrl, "video");
  }catch(err){
    console.warn("[TEMERIA PUBLISH] video non ancora propagato", err);
  }

  state.media.videoUrlPublic = publicUrl;
  state.media.videoPublic = publicUrl;
state.media.videoUrl = publicUrl;

  return publicUrl;
}

function injectOG(html, state, publicUrl, ogImageUrl){
  const title =
    state.content?.title ||
    "Temeria Card";

  const desc =
    state.content?.phrase ||
    state.content?.text ||
    "Card creata con Temeria Media Forge";

  const finalImage =
    ogImageUrl ||
    CONFIG.fallbackOGImage;

  const og = `
<meta property="og:type" content="website">
<meta property="og:title" content="${escapeHTML(title)}">
<meta property="og:description" content="${escapeHTML(desc)}">
<meta property="og:url" content="${escapeHTML(publicUrl)}">

<meta property="og:image" content="${escapeHTML(finalImage)}">
<meta property="og:image:secure_url" content="${escapeHTML(finalImage)}">
<meta property="og:image:type" content="image/png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">

<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escapeHTML(title)}">
<meta name="twitter:description" content="${escapeHTML(desc)}">
<meta name="twitter:image" content="${escapeHTML(finalImage)}">
`;

  html = html.replace(/<meta property="og:[^>]*>/g, "");
  html = html.replace(/<meta name="twitter:[^>]*>/g, "");

  if(html.includes("</head>")){
    return html.replace("</head>", og + "\n</head>");
  }

  return og + html;
}

async function publishCardToGitHub(){
  if(publishLock) return;

  publishLock = true;

  try{
    const token = localStorage.getItem("TEMERIA_GITHUB_TOKEN");

    if(!token){
      alert("Token GitHub mancante");
      return;
    }

    let state =
      window.TemeriaForge.collectState();

    state.github = state.github || {};
    state.media = state.media || {};

    const rawTitle =
      state.content?.title ||
      "temeria-card";

    const slug =
      window.TemeriaExport?.slugify
        ? window.TemeriaExport.slugify(rawTitle)
        : rawTitle
            .toLowerCase()
            .replace(/[^a-z0-9]+/g,"-")
            .replace(/^-|-$/g,"");

    const stamp = Date.now();

    const safeSlug =
      slug || "temeria-card";

    const fileName =
      `${safeSlug}-${stamp}.html`;

    const cardPath =
      `${CONFIG.cardsFolder}/${fileName}`;

    const publicUrl =
      `${CONFIG.base}/${cardPath}`;

    console.log("[TEMERIA PUBLISH] Preparazione publish...");
    console.log("[TEMERIA PUBLISH] URL card:", publicUrl);

    const ogImageUrl =
      await uploadImage(
        state,
        `${safeSlug}-${stamp}`,
        token
      );

    await uploadVideo(
      state,
      `${safeSlug}-${stamp}`,
      token
    );

    let html =
      window.TemeriaRenderer.buildStandaloneHTML(
        state,
        { publicUrl }
      );

    html = injectOG(
      html,
      state,
      publicUrl,
      ogImageUrl
    );

    console.log("[TEMERIA PUBLISH] Upload card:", cardPath);

    await uploadFile(
      cardPath,
      safeBase64Unicode(html),
      token
    );

    try{
      await waitForPublicUrl(publicUrl, "card");
    }catch(err){
      console.warn("[TEMERIA PUBLISH] card non ancora propagata", err);
    }

    await delay(CONFIG.whatsappSafetyDelay);

    state.github.lastPublishedUrl = publicUrl;
    state.github.ogImageUrl = ogImageUrl;

    if(window.TemeriaForge.saveState){
      window.TemeriaForge.saveState();
    }

    alert("Card pubblicata:\n" + publicUrl);

    window.open(
      withCache(publicUrl, stamp),
      "_blank"
    );

    return publicUrl;

  }catch(err){
    console.error("[TEMERIA PUBLISH] Errore:", err);
    alert("Errore publish:\n" + err.message);
  }finally{
    publishLock = false;
  }
}

window.publishCardToGitHub = publishCardToGitHub;

})();
