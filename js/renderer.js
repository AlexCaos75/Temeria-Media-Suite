/* =========================================================
   TEMERIA MEDIA FORGE V4 - SINGLE RENDERER
   Preview, export e publish usano lo stesso HTML
========================================================= */

(function(){
  "use strict";

  function E(){ return window.TemeriaForge; }
  function Media(){ return window.TemeriaMedia; }
  function esc(v){ return E().escapeAttr(v); }
  function html(v){ return E().escapeHTML(v); }
  function br(v){ return E().nl2brSafe(v); }

  function getCardSizeSettings(size){
    const presets = {
      small:{ width:"520px", padding:"24px", radius:"22px", titleSize:"28px", textSize:"18px" },
      medium:{ width:"760px", padding:"30px", radius:"26px", titleSize:"34px", textSize:"22px" },
      large:{ width:"980px", padding:"36px", radius:"30px", titleSize:"42px", textSize:"25px" },
      ultra:{ width:"1180px", padding:"42px", radius:"34px", titleSize:"46px", textSize:"26px" },
      square:{ width:"700px", padding:"34px", radius:"30px", titleSize:"36px", textSize:"22px", minHeight:"700px" },
      story:{ width:"430px", padding:"25px", radius:"28px", titleSize:"30px", textSize:"20px", minHeight:"760px" }
    };
    return presets[size] || presets.medium;
  }

  function computeLook(state){
    const theme = state.theme;
    const size = getCardSizeSettings(state.style.cardSize);

    let cardBackground = `linear-gradient(180deg,${theme.bg},${theme.accent2})`;
    let cardTextColor = theme.txt;
    let titleColor = theme.accent;
    let mainTextColor = theme.txt;
    let titleTextShadow = `0 0 20px ${theme.accent},0 0 ${theme.glowPower}px ${theme.accent3}`;
    let mainTextShadow = "none";
    let mainFontStyle = "normal";
    let mainLetterSpacing = "normal";
    let extraStyle = "";
    let fontFamily =
  state.style.fontPreset || "Orbitron";

let titleFontFamily =
  fontFamily;
    let cardWidth = size.width;
    let cardRadius = size.radius;
    let cardPadding = size.padding;
    let minHeight = size.minHeight || "auto";

    if(state.style.textStyle === "dream"){
      mainFontStyle = "italic";
      mainLetterSpacing = "1px";
      mainTextShadow = `0 0 18px ${theme.accent4}`;
    }

    if(state.style.textStyle === "neon"){
      titleTextShadow = `0 0 12px ${theme.accent},0 0 30px ${theme.accent3},0 0 60px ${theme.accent4}`;
      mainTextShadow = `0 0 12px ${theme.accent4},0 0 26px ${theme.accent3}`;
      mainLetterSpacing = "1.5px";
    }
/* =========================
   TEXT MOOD ENGINE
========================= */

if(state.style.textMood === "dream"){
  mainFontStyle = "italic";
  mainLetterSpacing = "1px";
  mainTextShadow =
    `0 0 18px ${theme.accent4}`;
}

if(state.style.textMood === "cinematic"){
  mainLetterSpacing = "2px";

  mainTextShadow =
    `0 0 25px ${theme.accent}`;

  extraStyle += `
    border:1px solid rgba(255,255,255,.08);
    backdrop-filter:blur(4px);
  `;
}

if(state.style.textMood === "angel"){
  mainTextShadow =
    `0 0 20px #ffffff`;

  titleTextShadow =
    `0 0 25px #ffffff,
     0 0 60px ${theme.accent4}`;

  mainLetterSpacing = "1px";
}

if(state.style.textMood === "neon"){
  titleTextShadow =
    `0 0 12px ${theme.accent},
     0 0 30px ${theme.accent3},
     0 0 60px ${theme.accent4}`;

  mainTextShadow =
    `0 0 12px ${theme.accent4},
     0 0 30px ${theme.accent3}`;

  mainLetterSpacing = "2px";
}

if(state.style.textMood === "parchment"){
  cardBackground =
    `linear-gradient(
      180deg,
      #2b1a0e,
      #5a3418
    )`;

  cardTextColor = "#fff7ed";

  titleColor = "#facc15";

  mainTextColor = "#fffbeb";

  extraStyle += `
    border:1px solid rgba(250,204,21,.22);
    box-shadow:
      0 0 35px rgba(250,204,21,.08),
      inset 0 0 40px rgba(0,0,0,.25);
  `;

  mainFontStyle = "italic";
}
    if(state.style.socialExport === "whatsapp"){
      cardWidth = "650px";
      extraStyle += `border:1px solid rgba(37,211,102,.22);box-shadow:0 0 40px rgba(37,211,102,.12),0 0 80px rgba(37,211,102,.08);`;
    }
    if(state.style.socialExport === "facebook"){
      cardWidth = "760px";
      extraStyle += `border:1px solid rgba(24,119,242,.20);box-shadow:0 0 45px rgba(24,119,242,.14),0 0 90px rgba(24,119,242,.08);`;
    }
    if(state.style.socialExport === "instagram"){
      cardWidth = "430px";
      cardPadding = "25px";
      minHeight = "760px";
      extraStyle += `background:linear-gradient(180deg,${theme.accent3},${theme.accent2});box-shadow:0 0 60px rgba(255,0,180,.18),0 0 120px rgba(180,0,255,.14);`;
    }
    if(state.style.socialExport === "youtube"){
      cardWidth = "980px";
      extraStyle += `border:1px solid rgba(255,0,0,.15);box-shadow:0 0 60px rgba(255,0,0,.18),0 0 140px rgba(255,0,0,.10);`;
    }
    if(state.style.socialExport === "tiktok"){
      cardWidth = "420px";
      minHeight = "760px";
      extraStyle += `background:linear-gradient(180deg,#000,${theme.accent2});border:1px solid rgba(0,255,255,.12);box-shadow:0 0 50px rgba(0,255,255,.12),0 0 90px rgba(255,0,120,.12);`;
    }

    if(state.style.cardStyle === "social_white"){
      cardBackground = "#ffffff";
      cardTextColor = "#111827";
      titleColor = "#111827";
      mainTextColor = "#1f2937";
      extraStyle += `border:1px solid rgba(0,0,0,.08);box-shadow:0 22px 70px rgba(0,0,0,.18);`;
    }
    if(state.style.cardStyle === "minimal"){
      cardBackground = "linear-gradient(180deg,#ffffff,#f8fafc)";
      cardTextColor = "#111827";
      titleColor = "#111827";
      mainTextColor = "#334155";
      extraStyle += `border:1px solid rgba(0,0,0,.08);box-shadow:0 18px 50px rgba(0,0,0,.12);`;
    }
    if(state.style.cardStyle === "glass"){
      cardBackground = "rgba(255,255,255,.08)";
      extraStyle += `backdrop-filter:blur(18px);border:1px solid rgba(255,255,255,.18);`;
    }
    if(state.style.cardStyle === "classic"){
      extraStyle += `border:1px solid ${theme.accent};`;
    }
    if(state.style.cardStyle === "nebula"){
      cardBackground = `radial-gradient(circle at top left,${theme.accent3},transparent 35%),radial-gradient(circle at bottom right,${theme.accent4},transparent 35%),linear-gradient(180deg,${theme.bg},${theme.accent2})`;
    }
    if(state.style.cardStyle === "holo"){
      cardBackground = `linear-gradient(135deg,${theme.bg},${theme.accent2},${theme.accent3})`;
    }

    if(state.style.outputMode === "cinematic"){
      extraStyle += `isolation:isolate;transform:translateZ(0);`;
    }
    if(state.style.outputMode === "music_focus"){
      cardWidth = "680px";
      minHeight = "420px";
    }

    return { size, cardBackground, cardTextColor, titleColor, mainTextColor, titleTextShadow, mainTextShadow,fontFamily,
titleFontFamily,  mainFontStyle, mainLetterSpacing, extraStyle, cardWidth, cardRadius, cardPadding, minHeight };
  }

  function socialButton(state, publicUrl){
    const url = publicUrl || state.github.lastPublishedUrl || "";
    if(!url) return "";
    const eurl = encodeURIComponent(url);

    if(state.style.socialExport === "whatsapp"){
      return `<div style="margin-top:25px;text-align:center;"><a href="https://wa.me/?text=${eurl}" target="_blank" style="display:inline-block;padding:16px 34px;border-radius:999px;background:linear-gradient(90deg,#25d366,#4bf58a);color:white;text-decoration:none;font-size:18px;font-weight:bold;box-shadow:0 0 35px rgba(37,211,102,.28);">💬 CONDIVIDI WHATSAPP</a></div>`;
    }
    if(state.style.socialExport === "facebook"){
      return `<div style="margin-top:25px;text-align:center;"><a href="https://www.facebook.com/sharer/sharer.php?u=${eurl}" target="_blank" style="display:inline-block;padding:16px 34px;border-radius:999px;background:linear-gradient(90deg,#1877f2,#4e9cff);color:white;text-decoration:none;font-size:18px;font-weight:bold;box-shadow:0 0 35px rgba(24,119,242,.28);">📘 CONDIVIDI FACEBOOK</a></div>`;
    }
    return `<div style="margin-top:25px;text-align:center;"><button type="button" onclick="TemeriaPublicPlayer.copy('${esc(url)}')" style="padding:16px 34px;border:none;cursor:pointer;border-radius:999px;background:linear-gradient(90deg,#00f6ff,#b06cff);color:white;font-size:18px;font-weight:bold;box-shadow:0 0 35px rgba(176,108,255,.28);">🔗 COPIA LINK</button></div>`;
  }

  function renderCard(state, options = {}){
    const look = computeLook(state);
    const theme = state.theme;

    const fraseFinaleHTML = state.content.phrase2 ? `
<div style="margin-top:24px;font-size:20px;line-height:1.6;opacity:.9;color:${esc(theme.accent4)};text-shadow:0 0 18px ${esc(theme.accent4)};">${br(state.content.phrase2)}</div>` : "";

    const emoticonsHTML = state.content.emoticons ? `
<div style="margin-top:20px;font-size:32px;letter-spacing:8px;">${html(state.content.emoticons)}</div>` : "";

    const firmaHTML = state.content.signature ? `
<div style="margin-top:24px;font-size:18px;opacity:.85;color:${esc(theme.accent)};text-shadow:0 0 14px ${esc(theme.accent)};">— ${html(state.content.signature)}</div>` : "";

    const cinematicOverlay = state.style.outputMode === "cinematic" ? `
<div style="position:absolute;inset:-1px;border-radius:inherit;pointer-events:none;background:radial-gradient(circle at 20% 0%,${esc(theme.accent)}22,transparent 35%),radial-gradient(circle at 80% 100%,${esc(theme.accent4)}22,transparent 35%);z-index:-1;"></div>` : "";

const youtubeOverlay =
state.style.socialExport === "youtube" ? `

<div style="
position:absolute;
inset:0;
pointer-events:none;
border-radius:inherit;
background:
linear-gradient(
180deg,
rgba(0,0,0,.08),
rgba(0,0,0,.35)
);
z-index:2;
"></div>

<div style="
position:absolute;
left:50%;
top:28%;
transform:translate(-50%,-50%);
z-index:3;
width:64px;
height:46px;
border-radius:22px;
background:
linear-gradient(
135deg,
#ff0033,
#ff5a5a
);
box-shadow:
0 0 35px rgba(255,0,0,.65),
0 0 90px rgba(255,0,0,.35);
display:flex;
align-items:center;
justify-content:center;
font-size:38px;
color:white;
text-shadow:
0 0 18px rgba(255,255,255,.9);
">
▶
</div>

<div style="
position:absolute;
right:22px;
bottom:22px;
z-index:3;
padding:8px 14px;
border-radius:999px;
background:rgba(0,0,0,.65);
color:white;
font-size:14px;
letter-spacing:1px;
box-shadow:
0 0 18px rgba(255,255,255,.18);
">
YOUTUBE PREVIEW
</div>

` : "";

    return `
<div class="temeria-public-root" style="position:relative;max-width:1200px;margin:auto;padding-top:30px;">
  <div class="temeria-card" style="
    position:relative;
    padding:${look.cardPadding};
    border-radius:${look.cardRadius};
    background:${look.cardBackground};
    color:${look.cardTextColor};
    max-width:${look.cardWidth};
    min-height:${look.minHeight};
    width:92%;
    margin:auto;
    box-sizing:border-box;
    text-align:center;
    overflow:visible;
    box-shadow:0 0 40px rgba(0,0,0,.35),0 0 ${Number(theme.glowPower) || 55}px ${esc(theme.accent3)};
    ${look.extraStyle}
  ">
    ${cinematicOverlay}
    ${youtubeOverlay}
    <h1 style="
font-size:${look.size.titleSize};
margin-bottom:20px;
font-family:${look.titleFontFamily},Arial,sans-serif;
letter-spacing:2px;
color:${look.titleColor};
text-shadow:${look.titleTextShadow};
">
${html(state.content.title)}
</h1>

<div style="
font-size:${look.size.textSize};
line-height:1.7;
max-width:700px;
margin:auto;
color:${look.mainTextColor};
font-style:${look.mainFontStyle};
letter-spacing:${look.mainLetterSpacing};
text-shadow:${look.mainTextShadow};
font-family:${look.fontFamily},Arial,sans-serif;
">
${br(state.content.phrase)}
</div>

    ${fraseFinaleHTML}
    ${emoticonsHTML}
    ${firmaHTML}
    ${Media().buildLogo(state)}
    ${Media().buildMainImage(state)}
    ${Media().buildVideo(state)}
    ${Media().buildAudio(state)}
    ${socialButton(state, options.publicUrl)}
  </div>
</div>`;
  }

  function renderPreview(){
    const state = E().collectState();
    const card = renderCard(state, { publicUrl: state.github.lastPublishedUrl });
    const host = document.getElementById("previewHost");
    const box = document.getElementById("codeBox");
    if(host) host.innerHTML = card;
    if(box) box.textContent = card;
    const isHeavyMedia =
  state.media.videoUrl?.startsWith("data:video/") ||
  state.media.mp3Url?.startsWith("data:audio/");

if(!isHeavyMedia){
  E().saveState();
}
    return card;
  }

function buildOGMeta(state, url){

  const title =
    state.content.title || "Temeria Card";

  const desc =
    state.content.phrase ||
    "Card creata con Temeria Media Forge";

  const image =
    state.media?.mainImagePublic ||
    state.github?.ogImageUrl ||
    "https://alexcaos75.github.io/Temeria-Media-Suite/assets/thumb/default.jpg";

  let img = image;

  if(
    image &&
    !image.startsWith("data:") &&
    !image.startsWith("blob:")
  ){

    img = image.startsWith("http")
      ? image
      : "https://alexcaos75.github.io/Temeria-Media-Suite/" +
        image.replace(/^\/+/, "");

  }

  return `
<meta property="og:title" content="${html(title)}">
<meta property="og:description" content="${html(desc)}">
<meta property="og:type" content="website">
<meta property="og:url" content="${esc(url || "")}">

<meta property="og:image" content="${esc(img)}">
<meta property="og:image:secure_url" content="${esc(img)}">
<meta property="og:image:type" content="image/png">

<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">

<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${html(title)}">
<meta name="twitter:description" content="${html(desc)}">
<meta name="twitter:image" content="${esc(img)}">
`;
}
  function buildStandaloneHTML(state, options = {}){
   const publicUrl = options.publicUrl || state.github?.lastPublishedUrl || "";
    const title = state.content.title || "Temeria Card";
    const card = renderCard(state, { publicUrl });

    return `<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${html(title)}</title>
<link rel="icon" href="data:,">
${buildOGMeta(state, publicUrl)}
<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;800&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box;}
body{
  margin:0;
  min-height:100vh;
  padding:30px;
  background:radial-gradient(circle at top,#182033,#070a12 60%,#020617);
  color:white;
  font-family:Orbitron,Arial,sans-serif;
}
button,a{font-family:Orbitron,Arial,sans-serif;}
@media(max-width:700px){
  body{padding:14px;}
  .temeria-card{width:96%!important;padding:22px!important;}
  .temeria-card h1{font-size:28px!important;}
}
</style>
</head>
<body>
${card}
${Media().publicPlayerScript()}
</body>
</html>`;
  }

  window.TemeriaRenderer = {
    renderCard,
    renderPreview,
    buildStandaloneHTML,
    buildOGMeta,
    getCardSizeSettings
  };

  window.buildCardHTML = function(){
    return renderCard(E().collectState());
  };

  window.genera = renderPreview;
})();
