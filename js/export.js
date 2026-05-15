/* =========================
   TEMERIA EXPORT ENGINE V3
========================= */

/* =========================
   OG META
========================= */

function buildOGMeta({
  title,
  description,
  image,
  url
}) {

  return `
<meta property="og:title" content="${escapeHTML(title)}">
<meta property="og:description" content="${escapeHTML(description)}">
<meta property="og:type" content="website">
<meta property="og:url" content="${escapeAttr(url)}">
<meta property="og:image" content="${escapeAttr(image)}">

<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escapeHTML(title)}">
<meta name="twitter:description" content="${escapeHTML(description)}">
<meta name="twitter:image" content="${escapeAttr(image)}">
`;

}

/* =========================
   PUBLIC URL HELPERS
========================= */

function getLiveShareURL(cardId){

  return (
    window.location.origin +
    window.location.pathname +
    "?share=" +
    encodeURIComponent(cardId) +
    "&v=" +
    Date.now()
  );

}

/* =========================
   SAVE SHARED CARD
========================= */

function saveSharedCardData(state){

  const raw =
    localStorage.getItem(
      "TEMERIA_SHARED_V3"
    );

  let db = {};

  try{

    db = raw
      ? JSON.parse(raw)
      : {};

  }catch(e){

    db = {};

  }

  db[state.id] = state;

  localStorage.setItem(
    "TEMERIA_SHARED_V3",
    JSON.stringify(db)
  );

}

/* =========================
   SHARE CURRENT CARD
========================= */

function shareCurrentCard(){

  const state =
    collectState();

  if(!state.id){

    state.id =
      "card_" + Date.now();

  }

  saveSharedCardData(state);

  const liveURL =
    getLiveShareURL(
      state.id
    );

  safeCopyText(liveURL);

  window.currentLiveCardURL =
    liveURL;

  alert(
    "✨ Link Card Live copiato!"
  );

  return liveURL;

}

/* =========================
   LOAD SHARED CARD
========================= */

function loadSharedCard(){

  const params =
    new URLSearchParams(
      window.location.search
    );

  const shareId =
    params.get("share");

  if(!shareId)
    return false;

  const raw =
    localStorage.getItem(
      "TEMERIA_SHARED_V3"
    );

  if(!raw)
    return false;

  let db = {};

  try{

    db = JSON.parse(raw);

  }catch(e){

    return false;

  }

  const state =
    db[shareId];

  if(!state)
    return false;

  applyState(state);

  console.log(
    "CARD LIVE LOADED:",
    shareId
  );

  return true;

}

/* =========================
   EXPORT PUBLIC CARD
========================= */

function exportPublicCard() {

  const cardHTML =
    buildCardHTML();

  const state =
    collectState();

  if(!state.id){

    state.id =
      "card_" + Date.now();

  }

  saveSharedCardData(state);

  const liveURL =
    getLiveShareURL(
      state.id
    );

  window.currentLiveCardURL =
    liveURL;

  const rawTitle =

    getVal("titolo").trim()

    || "temeria-card";

  const fileName = rawTitle
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    || "temeria-card";

  const currentImage =

    getVal("gifurl").trim()

    || `${getPublicBaseURL()}assets/og/temeria-og.jpg`;
const youtubeURL =
  getVal("youtubeurl").trim();
  const finalHTML = `

<!DOCTYPE html>
<html lang="it">

<head>

<meta charset="UTF-8">

<meta
name="viewport"
content="width=device-width, initial-scale=1.0"
>

<link rel="icon" href="data:,">

<title>
${escapeHTML(rawTitle)}
</title>

${buildOGMeta({
  title: rawTitle,
  description:
    getVal("frase").trim()
    || "Card creata con Temeria Media Forge",
  image: currentImage,
  url: liveURL
})}

<link
href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;800&display=swap"
rel="stylesheet"
>

<style>

body{
  margin:0;
  padding:30px;
  background:#070a12;
  font-family:Orbitron,sans-serif;
}

button,
a{
  font-family:Orbitron,sans-serif;
}

</style>

</head>

<body>

${cardHTML}

${
youtubeURL
? `
<div style="
margin-top:24px;
width:100%;
max-width:720px;
margin-left:auto;
margin-right:auto;
">

<iframe
width="100%"
height="120"
src="${youtubeURL}"
title="Temeria Music"
frameborder="0"
allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
allowfullscreen
style="
border:none;
border-radius:18px;
box-shadow:0 0 25px rgba(176,108,255,.35);
">
</iframe>

</div>
`
: ""
}

</body>
</html>
`;
downloadTextFile(
  `${fileName}.html`,
  finalHTML,
  "text/html"
);

}
/* =========================
   SHARE HELPERS
========================= */

function openWhatsAppShare(){

  const url =

    window.currentLiveCardURL

    || shareCurrentCard();

  window.open(
    `https://wa.me/?text=${encodeURIComponent(url)}`,
    "_blank"
  );

}

function openFacebookShare(){

  const url =

    window.currentLiveCardURL

    || shareCurrentCard();

  window.open(
    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    "_blank"
  );

}

function openTelegramShare(){

  const url =

    window.currentLiveCardURL

    || shareCurrentCard();

  window.open(
    `https://t.me/share/url?url=${encodeURIComponent(url)}`,
    "_blank"
  );

}

/* =========================
   COMPAT HTML ATTUALE
========================= */

function salvaCard() {

  exportPublicCard();

}

function salvaGenerator() {

  downloadGeneratorHTML();

}

function resetCampi() {

  resetForge();

}

function copiaCodice() {

  const codeBox =
    document.getElementById(
      "codeBox"
    );

  if (!codeBox)
    return;

  safeCopyText(
    codeBox.textContent || ""
  );

}

/* =========================
   INIT LIVE SYSTEM
========================= */

window.addEventListener(
  "load",
  ()=>{

    loadSharedCard();

  }
);
/* =========================
   TEMERIA GITHUB PUBLISH V4
========================= */

const TEMERIA_GITHUB = {

  user: "AlexCaos75",

  repo: "Temeria-Media-Suite",

  branch: "main",

  cardsFolder: "cards"

};

/* =========================
   TOKEN STORAGE
========================= */

function saveGitHubToken(){

  const token = prompt(
    "Inserisci GitHub Token"
  );

  if(!token) return;

  localStorage.setItem(
    "TEMERIA_GITHUB_TOKEN",
    token
  );

  alert(
    "💜 Token salvato"
  );

}

function getGitHubToken(){

  return localStorage.getItem(
    "TEMERIA_GITHUB_TOKEN"
  ) || "";

}

/* =========================
   SLUG
========================= */

function createCardSlug(title){

  return String(title || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g,"-")
    .replace(/^-+|-+$/g,"");

}

/* =========================
   BASE64 SAFE
========================= */

function safeBase64Unicode(str){

  return btoa(
    unescape(
      encodeURIComponent(str)
    )
  );

}

/* =========================
   REAL CARD URL
========================= */

function getPublishedCardURL(fileName){

  return `https://${TEMERIA_GITHUB.user}.github.io/${TEMERIA_GITHUB.repo}/${TEMERIA_GITHUB.cardsFolder}/${fileName}`;

}

/* =========================
   BUILD FINAL HTML
========================= */

function buildPublishedCardHTML(){

  const cardHTML =
    buildCardHTML();

  const rawTitle =

    getVal("titolo").trim()

    || "temeria-card";

  const currentImage =

    getVal("gifurl").trim()

    || `${getPublicBaseURL()}assets/og/temeria-og.jpg`;

  return `
<!DOCTYPE html>
<html lang="it">

<head>

<meta charset="UTF-8">

<meta
name="viewport"
content="width=device-width, initial-scale=1.0"
>

<title>
${escapeHTML(rawTitle)}
</title>

${buildOGMeta({

  title: rawTitle,

  description:
    getVal("frase").trim()
    || "Card creata con Temeria Media Forge",

  image: currentImage,

  url: ""

})}

<link
href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;800&display=swap"
rel="stylesheet"
>

<style>

body{
  margin:0;
  padding:30px;
  background:#070a12;
  font-family:Orbitron,sans-serif;
}

button,
a{
  font-family:Orbitron,sans-serif;
}

</style>

</head>

<body>

${cardHTML}

</body>
</html>
`;

}

/* =========================
   PUBBLICARE UNA VERA CARD
========================= */

async function publishCardToGitHub(){

  try{

    const token =
      getGitHubToken();

    if(!token){

      alert(
        "⚠️ Salva prima il token GitHub"
      );

      return;
    }

    const rawTitle =
      getVal("titolo").trim()
      || "temeria-card";

    const slug =
      createCardSlug(rawTitle);

    const fileName =
      `${slug}.html`;

    const html =
      buildPublishedCardHTML();

    const path =
      `${TEMERIA_GITHUB.cardsFolder}/${fileName}`;

    const apiURL =
      `https://api.github.com/repos/${TEMERIA_GITHUB.user}/${TEMERIA_GITHUB.repo}/contents/${path}`;

   /* =========================
   CHECK FILE ESISTENTE
========================= */

let existingSHA = null;

try{

  const checkResponse =
    await fetch(apiURL,{

      method:"GET",

      headers:{
        Authorization:
          `Bearer ${token}`
      }

    });

  if(checkResponse.ok){

    const existingData =
      await checkResponse.json();

    existingSHA =
      existingData.sha;

    console.log(
      "EXISTING SHA:",
      existingSHA
    );

  }else{

    console.log(
      "Nuovo file GitHub"
    );

  }

}catch(e){

  console.log(
    "Errore check SHA:",
    e
  );

}
    /* =========================
       BODY REQUEST
    ========================== */

    const bodyData = {

      message:
        `✨ Publish ${fileName}`,

      content:
        safeBase64Unicode(html),

      branch:
        TEMERIA_GITHUB.branch

    };

    /* =========================
       UPDATE FILE ESISTENTE
    ========================== */

  if(
  existingSHA &&
  typeof existingSHA === "string"
){

  bodyData.sha =
    existingSHA;

}

    /* =========================
       UPLOAD GITHUB
    ========================== */

    const response =
      await fetch(apiURL,{

        method:"PUT",

        headers:{

          Authorization:
            `Bearer ${token}`,

          "Content-Type":
            "application/json"

        },

        body:
          JSON.stringify(bodyData)

      });

    const data =
      await response.json();

    console.log(data);

    /* =========================
       SUCCESS
    ========================== */

    if(data.content){

      const liveURL =
        getPublishedCardURL(
          fileName
        );

      window.currentLiveCardURL =
        liveURL;

      safeCopyText(
        liveURL
      );

      alert(
        `🚀 Card pubblicata!\n\n${liveURL}`
      );

      window.open(
        liveURL,
        "_blank"
      );

    }else{

      console.error(data);

      alert(
        "❌ Errore pubblicazione GitHub"
      );

    }

  }catch(err){

    console.error(err);

    alert(
      "❌ Publish fallito"
    );

  }

}
