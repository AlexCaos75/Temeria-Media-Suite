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

  const finalHTML = `
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
