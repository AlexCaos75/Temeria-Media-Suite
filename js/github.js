/* =========================================================
   TEMERIA MEDIA FORGE V5
   ULTRA STABLE GITHUB PUBLISH ENGINE
   Stable Publish + OG + Retry + Cache + Verify
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
  "https://alexcaos75.github.io/Temeria-Media-Suite/assets/default-og.jpg",

  retryAttempts: 3,
  retryDelay: 1200,

  verifyAttempts: 10,
  verifyDelay: 3000,

  whatsappSafetyDelay: 2500,

  enableCacheBuster: true,

  githubApi: "https://api.github.com",
  vercelBase:
  "https://alexcaos75.github.io/Temeria-Media-Suite"
};

let publishLock = false;

/* =========================================================
   TOKEN
========================================================= */

function saveGitHubToken(){

  const token =
    prompt("Inserisci GitHub Token");

  if(!token) return;

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
   UTILS
========================================================= */

function delay(ms){

  return new Promise(resolve=>{
    setTimeout(resolve, ms);
  });
}

function log(...args){

  console.log(
    "%c[TEMERIA PUBLISH]",
    "color:#b06cff;font-weight:bold",
    ...args
  );
}

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

function safeBase64Unicode(str){

  const bytes =
    new TextEncoder().encode(str);

  let binary = "";

  bytes.forEach(byte=>{
    binary +=
      String.fromCharCode(byte);
  });

  return btoa(binary);
}

function generateUniqueId(){

  const now = new Date();

  return (
    now.getFullYear() +
    String(now.getMonth()+1)
      .padStart(2,"0") +
    String(now.getDate())
      .padStart(2,"0") +
    "-" +
    String(now.getHours())
      .padStart(2,"0") +
    String(now.getMinutes())
      .padStart(2,"0") +
    String(now.getSeconds())
      .padStart(2,"0") +
    "-" +
    Math.random()
      .toString(36)
      .slice(2,7)
  );
}

function withCache(url){

  if(!CONFIG.enableCacheBuster){
    return url;
  }

  const separator =
    url.includes("?")
      ? "&"
      : "?";

  return (
    url +
    separator +
    "v=" +
    Date.now()
  );
}

function getPublishedCardURL(fileName){

  return (
    `${CONFIG.vercelBase}/` +
    `${CONFIG.cardsFolder}/${fileName}`
  );
}

function getPublicAssetURL(path){

  return (
    `${CONFIG.vercelBase}/${path}`
  );
}

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

  if(!dataUrl){
    return "bin";
  }

  if(
    dataUrl.startsWith(
      "data:image/png"
    )
  ){
    return "png";
  }

  if(
    dataUrl.startsWith(
      "data:image/webp"
    )
  ){
    return "webp";
  }

  if(
    dataUrl.startsWith(
      "data:image/gif"
    )
  ){
    return "gif";
  }

  if(
    dataUrl.startsWith(
      "data:image/jpeg"
    )
  ){
    return "jpg";
  }

  if(
    dataUrl.startsWith(
      "data:image/jpg"
    )
  ){
    return "jpg";
  }

  if(
    dataUrl.startsWith(
      "data:audio/mp3"
    )
  ){
    return "mp3";
  }

  if(
    dataUrl.startsWith(
      "data:audio/mpeg"
    )
  ){
    return "mp3";
  }

  if(
    dataUrl.startsWith(
      "data:audio/wav"
    )
  ){
    return "wav";
  }

  if(
    dataUrl.startsWith(
      "data:video/mp4"
    )
  ){
    return "mp4";
  }

  return "bin";
}

/* =========================================================
   VERIFY PUBLIC DEPLOY
========================================================= */

async function verifyPublishedResource(
  url,
  label = "resource"
){

  for(
    let i = 0;
    i < CONFIG.verifyAttempts;
    i++
  ){

    try{

      setPublishStatus(
        `Verifica ${label}... (${i+1}/${CONFIG.verifyAttempts})`
      );

      const response =
        await fetch(
          withCache(url),
          {
            method: "HEAD",
            cache: "no-store"
          }
        );

      if(response.ok){

        log(
          `${label} verificata`,
          url
        );

        return true;
      }

    }catch(err){

      console.warn(
        `Verify ${label} failed`,
        err
      );
    }

    await delay(
      CONFIG.verifyDelay
    );
  }

  return false;
}

/* =========================================================
   SHA
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

    if(!res.ok){
      return null;
    }

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
   RETRY
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
   UPLOAD
========================================================= */

async function uploadFileToGitHub(
  path,
  base64Content,
  message,
  token
){

  return retry(async()=>{

    const apiURL =
      `${CONFIG.githubApi}/repos/` +
      `${CONFIG.user}/` +
      `${CONFIG.repo}/contents/${path}`;

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

    if(sha){
      body.sha = sha;
    }

    const response =
      await fetch(apiURL,{
        method:"PUT",
        headers:{
          Authorization:
            `Bearer ${token}`,
          "Content-Type":
            "application/json"
        },
        body: JSON.stringify(body)
      });

    const data =
      await response.json();

    if(
      !response.ok ||
      !data.content
    ){

      console.error(data);

      throw new Error(
        "GitHub upload failed: " +
        path
      );
    }

    return data;
  });
}

/* =========================================================
   MEDIA
========================================================= */

async function uploadMainImageIfNeeded(
  state,
  slug,
  token
){

const img =
  state?.media?.mainImageRaw ||
  state?.media?.mainImagePublic ||
  state?.media?.mainImage ||
  "";

if(
  !img ||
  (
    !img.startsWith("data:image/") &&
    !img.startsWith("http")
  )
){

    state.github.ogImageUrl =
      CONFIG.fallbackOGImage;

    return state;
  }

  setPublishStatus(
    "Upload immagine..."
  );

  const ext =
    getExtensionFromDataUrl(img);

  const base64 =
    extractBase64(img);

  if(!base64){

    state.github.ogImageUrl =
      CONFIG.fallbackOGImage;

    return state;
  }

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

/* =========================
   KEEP ORIGINAL DATA URL
========================= */

state.media.mainImageRaw =
  img;

/* =========================
   KEEP FORGE PREVIEW WORKING
========================= */

state.media.mainImage =
  img;

/* =========================
   PUBLIC IMAGE
========================= */

state.media.mainImagePublic =
  publicImageUrl;
/* =========================
   FORCE PUBLIC IMAGE
========================= */

state.media.mainImage =
  publicImageUrl;
/* =========================
   OG IMAGE
========================= */

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
    !audio.startsWith(
      "data:audio/"
    )
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

  if(!base64){
    return state;
  }

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
    !video.startsWith(
      "data:video/"
    )
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

  if(!base64){
    return state;
  }

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

/* =========================
   HEAVY VIDEO FLAG
========================= */

state.github =
  state.github || {};

state.github.hasHeavyVideo =
  true;

log(
  "Video pubblico aggiornato:",
  publicVideoUrl
);

return state;
}

/* =========================================================
   OG
========================================================= */

function ensureOGData(
  state,
  publicUrl
){

  state.github =
    state.github || {};

  state.github.lastPublishedUrl =
    publicUrl;

  state.github.ogUrl =
    publicUrl;

  state.github.ogType =
    "website";

  state.github.ogTitle =
    state.content?.title ||
    "Temeria";

  state.github.ogDescription =
    state.content?.phrase ||
    "Temeria Media Forge";

  if(
    !state.github.ogImageUrl
  ){
    state.github.ogImageUrl =
      CONFIG.fallbackOGImage;
  }
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

    state.github =
      state.github || {};

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
      getPublishedCardURL(fileName);

    ensureOGData(
      state,
      publicUrl
    );

    await uploadMainImageIfNeeded(
      state,
      publishSlug,
      token
    );

    await uploadMP3IfNeeded(
      state,
      publishSlug,
      token
    );

    await uploadVideoIfNeeded(
      state,
      publishSlug,
      token
    );

    setPublishStatus(
      "Rendering HTML..."
    );

    window.TemeriaForge
      .applyState(state);

    window.TemeriaForge
      .saveState();

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

    const uploadedCard =
      await uploadFileToGitHub(
        cardPath,
        safeBase64Unicode(html),
        `Publish card ${fileName}`,
        token
      );

    if(
      !uploadedCard?.content?.path ||
      uploadedCard.content.path !==
      cardPath
    ){

      throw new Error(
        "La card HTML non risulta creata su GitHub: " +
        cardPath
      );
    }

    /* =========================
   SKIP VERIFY CARD
========================= */

/*
  GitHub Pages può impiegare
  tempo a propagare nuove card.

  Evitiamo blocchi publish
  inutili.
*/

log(
  "Verify card saltata."
);
 /* =========================
   VERIFY OG IMAGE
========================= */

/*
  Se la card contiene un MP4 pesante,
  evitiamo verify aggressiva perché
  GitHub/Vercel possono impiegare
  molto tempo a propagare i video.
*/

/* =========================
   SKIP OG VERIFY
========================= */

log(
  "Verify OG saltata."
);

    /* =========================
       WHATSAPP SAFETY DELAY
    ========================= */

    setPublishStatus(
      "Sincronizzazione cache social..."
    );

    await delay(
      CONFIG.whatsappSafetyDelay
    );

   /* =========================
   FINALIZE
========================= */

state.github.lastPublishedUrl =
  publicUrl;

/* =========================
   SYNC PUBLIC IMAGE
========================= */

if(
  state.github?.ogImageUrl
){

  state.media =
    state.media || {};

 state.media.mainImagePublic =
  state.github.ogImageUrl;

/* =========================
   KEEP ORIGINAL LOCAL IMAGE
========================= */

if(
  !state.media.mainImage
){

  state.media.mainImage =
    state.github.ogImageUrl;
}

  log(
    "Renderer sincronizzato con immagine pubblica:",
    state.github.ogImageUrl
  );
}

/* =========================
   APPLY STATE
========================= */

window.TemeriaForge
  .applyState(state);

window.TemeriaForge
  .saveState();

/* =========================
   FORCE RENDER REFRESH
========================= */

await delay(400);

if(
  typeof window.genera ===
  "function"
){

  log(
    "Refresh renderer Forge..."
  );

  window.genera();
}

/* =========================
   COPY URL
========================= */

if(
  window.TemeriaForge
  ?.safeCopyText
){

  window.TemeriaForge
    .safeCopyText(publicUrl);
}

/* =========================
   COMPLETE
========================= */

setPublishStatus(
  "Publish completato."
);

alert(
  "Card pubblicata con successo:\n\n" +
  publicUrl
);

window.open(
  withCache(publicUrl),
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

  verifyPublishedResource,

  getPublishedCardURL
};

window.saveGitHubToken =
  saveGitHubToken;

window.publishCardToGitHub =
  publishCardToGitHub;

})();
