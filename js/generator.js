/* =========================
   GENERATOR
========================= */

let gifDataURL = "";
let miniDataURL = "";

/* =========================
   GIF FILE UPLOAD
========================= */

const gifFileInput =
  document.getElementById("giffile");

if (gifFileInput) {

  gifFileInput.addEventListener(
    "change",
    function(e){

      const file =
        e.target.files?.[0];

      if (!file) return;

      const reader =
        new FileReader();

      reader.onload = function(ev){

        gifDataURL =
          ev.target.result;

        const gifUrlInput =
          document.getElementById("gifurl");

        if (gifUrlInput) {
          gifUrlInput.value = "";
        }

        console.log(
          "GIF DATAURL LOADED"
        );

        genera();

        e.target.value = "";

      };

      reader.readAsDataURL(file);

    }
  );

}
/* =========================
   MINI FILE UPLOAD
========================= */

const miniFileInput =
  document.getElementById("minifile");

if (miniFileInput) {

  miniFileInput.addEventListener(
    "change",
    function(e){

      const file =
        e.target.files?.[0];

      if (!file) return;

      const reader =
        new FileReader();

      reader.onload = function(ev){

        miniDataURL =
          ev.target.result;

        const miniGifInput =
          document.getElementById("minigif");

        if (miniGifInput) {
          miniGifInput.value = "";
        }

        console.log(
          "MINI DATAURL LOADED"
        );

        genera();

        e.target.value = "";

      };

      reader.readAsDataURL(file);

    }
  );

}

/* =========================
   SAFE HELPERS
========================= */

function getVal(id, fallback = "") {

  const el =
    document.getElementById(id);

  if (!el)
    return fallback;

  return el.value ?? fallback;

}

function escapeAttr(str) {

  return String(str || "")
    .replace(/"/g, "&quot;");

}

function getOutputMode() {

  return getVal(
    "outputMode",
    "social_clean"
  );

}
/* =========================
   EXTRA HELPERS
========================= */

function escapeHTML(str) {

  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}

function nl2brSafe(str) {

  return escapeHTML(str)
    .replace(/\n/g, "<br>");

}

function safeCopyText(text) {

  if (navigator.clipboard) {

    navigator.clipboard.writeText(text)
      .then(() => {

        console.log("COPIED");

      })
      .catch(() => {

        fallbackCopyText(text);

      });

  } else {

    fallbackCopyText(text);

  }

}

function fallbackCopyText(text) {

  const textarea =
    document.createElement("textarea");

  textarea.value = text;

  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";

  document.body.appendChild(textarea);

  textarea.focus();
  textarea.select();

  try {

    document.execCommand("copy");
    console.log("FALLBACK COPIED");

  } catch(err) {

    console.error("COPY FAILED", err);

  }

  document.body.removeChild(textarea);

}
/* =========================
   SYNC URL / LOCAL UPLOAD
========================= */

const gifUrlInput =
  document.getElementById("gifurl");

if (gifUrlInput) {

  gifUrlInput.addEventListener(
    "input",
    () => {
      gifDataURL = "";
    }
  );

}

const miniGifUrlInput =
  document.getElementById("minigif");

if (miniGifUrlInput) {

  miniGifUrlInput.addEventListener(
    "input",
    () => {
      miniDataURL = "";
    }
  );

}
/* =========================
   LEGACY YT CONTROLS
========================= */

function legacyYTPlay() {

  const iframe =
    document.getElementById(
      "legacyYTPlayerButtons"
    );

  if (!iframe?.contentWindow) return;

  iframe.contentWindow.postMessage(
    JSON.stringify({
      event: "command",
      func: "playVideo",
      args: []
    }),
    "*"
  );

}

function legacyYTPause() {

  const iframe =
    document.getElementById(
      "legacyYTPlayerButtons"
    );

  if (!iframe?.contentWindow) return;

  iframe.contentWindow.postMessage(
    JSON.stringify({
      event: "command",
      func: "pauseVideo",
      args: []
    }),
    "*"
  );

}
/* =========================
   CARD SIZE SETTINGS
========================= */

function getCardSizeSettings() {

  const size =
    getVal("cardSize", "medium");

  const presets = {

    small: {
      width: "520px",
      padding: "24px",
      radius: "22px",
      titleSize: "28px",
      textSize: "18px"
    },

    medium: {
      width: "760px",
      padding: "30px",
      radius: "26px",
      titleSize: "34px",
      textSize: "22px"
    },

    large: {
      width: "980px",
      padding: "36px",
      radius: "30px",
      titleSize: "42px",
      textSize: "25px"
    },

    ultra: {
      width: "1180px",
      padding: "42px",
      radius: "34px",
      titleSize: "46px",
      textSize: "26px"
    },

    square: {
      width: "700px",
      padding: "34px",
      radius: "30px",
      titleSize: "36px",
      textSize: "22px",
      minHeight: "700px"
    },

    story: {
      width: "430px",
      padding: "25px",
      radius: "28px",
      titleSize: "30px",
      textSize: "20px",
      minHeight: "760px"
    }

  };

  return presets[size]
    || presets.medium;

}
/* =========================
   PUBLIC URL HELPERS
========================= */

function getPublicBaseURL() {

  return "https://alexcaos75.github.io/Temeria-Media-Suite/";

}

function getPublicCardURL() {

  return "https://alexcaos75.github.io/Temeria-Media-Suite/cards/temeria-card.html";

}
/* =========================
   BUILD CARD
========================= */

function buildCardHTML() {
  const theme = typeof getThemeFromUI === "function"
    ? getThemeFromUI()
    : {
        bg: "#070a12",
        txt: "#ffffff",
        accent: "#00f6ff",
        accent2: "#111827",
        accent3: "#b06cff",
        accent4: "#6cff9f",
        glowPower: 55
      };

  const size = getCardSizeSettings();
  const outputMode = getOutputMode();

const titolo = escapeHTML(getVal("titolo"));
const frase = nl2brSafe(getVal("frase"));
const fraseFinale = nl2brSafe(getVal("frase2"));
const firma = escapeHTML(getVal("firma"));
const emoticons = escapeHTML(getVal("emoticons"));

const gifInput = getVal("gifurl").trim();
const gif = gifDataURL || gifInput;
const miniInput = getVal("minigif").trim();
const miniGif = miniDataURL || miniInput;
const video = getVal("videourl").trim();

const audioMode = getVal("audioMode", "yt_auto");
const mediaEngineMode =
  getVal("mediaEngineMode", "social_modern");
const ytidAuto = getVal("ytid_auto").trim();
const ytidBtn = getVal("ytid_btn").trim();
const mp3url = getVal("mp3url").trim();

const socialMode = getVal("socialExport", "normal");
const publicCardURL = getPublicCardURL();

const cardStyle = getVal("cardStyle", "holo");
const textStyle = getVal("textStyle", "normal");

let cardBackground = `linear-gradient(180deg,${theme.bg},${theme.accent2})`;
let cardTextColor = theme.txt;
let titleColor = theme.accent;
let mainTextColor = theme.txt;

let titleTextShadow = `
  0 0 20px ${theme.accent},
  0 0 ${theme.glowPower}px ${theme.accent3}
`;

let mainTextShadow = "none";
let mainFontStyle = "normal";
let mainLetterSpacing = "normal";

let mediaHTML = "";
let gifHTML = "";
let audioHTML = "";
let socialButtons = "";
let extraStyle = "";

let cardWidth = size.width;
let cardRadius = size.radius;
let cardPadding = size.padding;
let textAlign = "center";
let minHeight = size.minHeight || "auto";

const showImages = outputMode !== "minimal" && outputMode !== "music_focus";
const showVideo = outputMode !== "minimal" && outputMode !== "music_focus" && outputMode !== "social_clean";
const showAudio = outputMode !== "minimal" && outputMode !== "image_focus" && outputMode !== "video_focus";

/* =========================
   TEXT STYLE
========================= */

if (textStyle === "dream") {
  mainFontStyle = "italic";
  mainLetterSpacing = "1px";
  mainTextShadow = `0 0 18px ${theme.accent4}`;
}

if (textStyle === "neon") {
  titleTextShadow = `
    0 0 12px ${theme.accent},
    0 0 30px ${theme.accent3},
    0 0 60px ${theme.accent4}
  `;

  mainTextShadow = `
    0 0 12px ${theme.accent4},
    0 0 26px ${theme.accent3}
  `;

  mainLetterSpacing = "1.5px";
}
 /* =========================
   SOCIAL STYLE
========================= */

if (socialMode === "whatsapp") {
  cardWidth = "650px";
  extraStyle = `
    border:1px solid rgba(37,211,102,.22);
    box-shadow:
    0 0 40px rgba(37,211,102,.12),
    0 0 80px rgba(37,211,102,.08);
  `;
}

if (socialMode === "facebook") {
  cardWidth = "760px";
  extraStyle = `
    border:1px solid rgba(24,119,242,.20);
    box-shadow:
    0 0 45px rgba(24,119,242,.14),
    0 0 90px rgba(24,119,242,.08);
  `;
}

if (socialMode === "instagram") {
  cardWidth = "430px";
  cardPadding = "25px";
  minHeight = "760px";
  extraStyle = `
    background:linear-gradient(180deg,${theme.accent3},${theme.accent2});
    box-shadow:
    0 0 60px rgba(255,0,180,.18),
    0 0 120px rgba(180,0,255,.14);
  `;
}

if (socialMode === "youtube") {
  cardWidth = "980px";
  extraStyle = `
    border:1px solid rgba(255,0,0,.15);
    box-shadow:
    0 0 60px rgba(255,0,0,.18),
    0 0 140px rgba(255,0,0,.10);
  `;
}

if (socialMode === "tiktok") {
  cardWidth = "420px";
  minHeight = "760px";
  extraStyle = `
    background:linear-gradient(180deg,#000,${theme.accent2});
    border:1px solid rgba(0,255,255,.12);
    box-shadow:
    0 0 50px rgba(0,255,255,.12),
    0 0 90px rgba(255,0,120,.12);
  `;
}
/* =========================
   CARD STYLE
========================= */

if (cardStyle === "social_white") {
  cardBackground = "#ffffff";
  cardTextColor = "#111827";
  titleColor = "#111827";
  mainTextColor = "#1f2937";

  extraStyle += `
    border:1px solid rgba(0,0,0,.08);
    box-shadow:0 22px 70px rgba(0,0,0,.18);
  `;
}

if (cardStyle === "minimal") {
  cardBackground = "linear-gradient(180deg,#ffffff,#f8fafc)";
  cardTextColor = "#111827";
  titleColor = "#111827";
  mainTextColor = "#334155";

  extraStyle += `
    border:1px solid rgba(0,0,0,.08);
    box-shadow:0 18px 50px rgba(0,0,0,.12);
  `;
}

if (cardStyle === "glass") {
  cardBackground = "rgba(255,255,255,.08)";

  extraStyle += `
    backdrop-filter:blur(18px);
    border:1px solid rgba(255,255,255,.18);
  `;
}

if (cardStyle === "classic") {
  extraStyle += `
    border:1px solid ${theme.accent};
  `;
}

if (cardStyle === "nebula") {
  cardBackground = `
    radial-gradient(circle at top left,${theme.accent3},transparent 35%),
    radial-gradient(circle at bottom right,${theme.accent4},transparent 35%),
    linear-gradient(180deg,${theme.bg},${theme.accent2})
  `;
}

if (cardStyle === "holo") {
  cardBackground = `
    linear-gradient(
      135deg,
      ${theme.bg},
      ${theme.accent2},
      ${theme.accent3}
    )
  `;
}
/* =========================
   IMAGE / GIF
========================= */

if (gif && showImages) {
  const imgLink = getVal("imglink").trim();
  const imgTag = `
<img
src="${escapeAttr(gif)}"
loading="lazy"
decoding="async"
alt=""
style="
width:100%;
border-radius:22px;
margin-top:25px;
box-shadow:0 0 35px rgba(0,0,0,.35);
display:block;
object-fit:cover;
"
>
`;

  gifHTML = imgLink
    ? `<a href="${escapeAttr(imgLink)}" target="_blank">${imgTag}</a>`
    : imgTag;
}
  /* =========================
     VIDEO
  ========================= */

  if (video && showVideo) {
    mediaHTML += `
<video
src="${escapeAttr(video)}"
controls
playsinline
preload="metadata"
style="
width:100%;
margin-top:25px;
border-radius:22px;
box-shadow:0 0 30px rgba(0,0,0,.35);
display:block;
"
></video>
`;
  }
/* =========================
   AUDIO MODES
========================= */

/* =========================
   SOCIAL MODERN ENGINE
========================= */

if (mediaEngineMode === "social_modern") {

  /* YT AUTOPLAY */

  if (showAudio && audioMode === "yt_auto" && ytidAuto) {

    audioHTML += `
<div style="
position:fixed;
left:-9999px;
top:-9999px;
width:1px;
height:1px;
overflow:hidden;
opacity:0;
pointer-events:none;
">
<iframe
width="1"
height="1"
allow="autoplay; encrypted-media"
allowfullscreen
frameborder="0"
src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(ytidAuto)}?autoplay=1&mute=0&playsinline=1&loop=1&playlist=${encodeURIComponent(ytidAuto)}">
</iframe>
</div>
`;
  }

 /* YT BUTTONS MODERN */

if (
  showAudio &&
  audioMode === "yt_buttons" &&
  ytidBtn
) {

  audioHTML += `

<div style="
margin-top:25px;
width:100%;
max-width:720px;
margin-left:auto;
margin-right:auto;
">

<iframe
id="temeriaYTButtons"
width="100%"
height="120"
src="https://www.youtube.com/embed/${encodeURIComponent(ytidBtn)}?controls=1&playsinline=1&loop=1&playlist=${encodeURIComponent(ytidBtn)}"
title="Temeria Music"
frameborder="0"
allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
allowfullscreen
style="
display:block;
width:100%;
border:none;
border-radius:18px;
overflow:hidden;
background:#000;
box-shadow:0 0 25px rgba(176,108,255,.35);
">
</iframe>

</div>

`;
}
 /* MP3 */

if (
  showAudio &&
  audioMode === "mp3" &&
  mp3url
) {

  audioHTML += `

<div style="
margin-top:25px;
width:100%;
max-width:720px;
margin-left:auto;
margin-right:auto;
">

<audio
controls
loop
preload="metadata"
style="
display:block;
width:100%;
border-radius:18px;
overflow:hidden;
box-shadow:0 0 25px rgba(176,108,255,.25);
background:rgba(255,255,255,.06);
"
>

<source
src="${escapeAttr(mp3url)}"
type="audio/mpeg"
>

Il tuo browser non supporta audio HTML5.

</audio>

</div>

`;
}
/* MP4 */

if (
  showAudio &&
 audioMode === "mp4" &&
video
) {

  audioHTML += `

<div style="
margin-top:25px;
width:100%;
max-width:720px;
margin-left:auto;
margin-right:auto;
">

<video
controls
loop
playsinline
preload="metadata"
style="
display:block;
width:100%;
border-radius:22px;
overflow:hidden;
background:#000;
box-shadow:0 0 30px rgba(176,108,255,.28);
"
>

<source
src="${escapeAttr(video)}"
type="video/mp4"
>

Il tuo browser non supporta video HTML5.

</video>

</div>

`;
}

}
/* =========================
   TEMERIA LEGACY ENGINE
========================= */

if (mediaEngineMode === "temeria_legacy") {

  /* YT AUTOPLAY LEGACY */

  if (showAudio && audioMode === "yt_auto" && ytidAuto) {

    audioHTML += `
<div id="legacyYTContainer" style="
position:fixed;
left:-9999px;
top:-9999px;
width:1px;
height:1px;
overflow:hidden;
opacity:0;
pointer-events:none;
">

<iframe
id="legacyYTPlayer"
width="1"
height="1"
allow="autoplay; encrypted-media"
frameborder="0"
src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(ytidAuto)}?autoplay=1&mute=0&playsinline=1&loop=1&playlist=${encodeURIComponent(ytidAuto)}">
</iframe>
</div>
`;
  }


/* YT BUTTONS LEGACY */

if (
  showAudio &&
  audioMode === "yt_buttons" &&
  ytidBtn
) {

  audioHTML += `
<div id="legacyYTWrap" style="
position:fixed;
left:-9999px;
top:-9999px;
width:1px;
height:1px;
overflow:hidden;
opacity:0;
pointer-events:none;
">

<iframe
id="legacyYTPlayerButtons"
width="1"
height="1"
allow="autoplay; encrypted-media"
frameborder="0"
src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(ytidBtn)}?enablejsapi=1&playsinline=1&loop=1&playlist=${encodeURIComponent(ytidBtn)}">
</iframe>
</div>

<div style="
margin-top:25px;
display:flex;
gap:14px;
justify-content:center;
flex-wrap:wrap;
">

<button
onclick="legacyYTPlay()"
style="
padding:15px 26px;
border:none;
cursor:pointer;
border-radius:999px;
background:linear-gradient(90deg,#00f6ff,#6cff9f);
color:black;
font-weight:bold;
font-size:17px;
"
>
▶ PLAY
</button>

<button
onclick="legacyYTPause()"
style="
padding:15px 26px;
border:none;
cursor:pointer;
border-radius:999px;
background:linear-gradient(90deg,#ff0033,#ff6b6b);
color:white;
font-weight:bold;
font-size:17px;
"
>
⏹ STOP
</button>

</div>
`;

}

  /* MP3 LEGACY */

  if (showAudio && audioMode === "mp3" && mp3url) {

    audioHTML += `
<audio
id="legacyMP3"
src="${escapeAttr(mp3url)}"
loop
autoplay
style="
display:none;
"
></audio>

<div style="
margin-top:25px;
display:flex;
gap:14px;
justify-content:center;
flex-wrap:wrap;
">

<button
onclick="document.getElementById('legacyMP3').play()"
style="
padding:15px 26px;
border:none;
cursor:pointer;
border-radius:999px;
background:linear-gradient(90deg,#00f6ff,#6cff9f);
color:black;
font-weight:bold;
font-size:17px;
"
>
▶ PLAY
</button>

<button
onclick="document.getElementById('legacyMP3').pause()"
style="
padding:15px 26px;
border:none;
cursor:pointer;
border-radius:999px;
background:linear-gradient(90deg,#ff0033,#ff6b6b);
color:white;
font-weight:bold;
font-size:17px;
"
>
⏹ STOP
</button>

</div>
`;
  }

}

/* =========================
   SOCIAL BUTTONS
========================= */

if (socialMode === "facebook") {
  socialButtons = `
<div style="margin-top:25px;text-align:center;">
<button onclick="safeCopyText('${publicCardURL}')" style="
padding:16px 34px;
border:none;
cursor:pointer;
border-radius:999px;
background:linear-gradient(90deg,#1877f2,#4e9cff);
color:white;
font-size:18px;
font-weight:bold;
box-shadow:0 0 35px rgba(24,119,242,.28);
">
📘 COPIA LINK FACEBOOK
</button>
</div>
`;
}

if (socialMode === "whatsapp") {
  socialButtons = `
<div style="margin-top:25px;text-align:center;">
<a
href="https://wa.me/?text=${encodeURIComponent(publicCardURL)}"
target="_blank"
style="
display:inline-block;
padding:16px 34px;
border-radius:999px;
background:linear-gradient(90deg,#25d366,#4bf58a);
color:white;
text-decoration:none;
font-size:18px;
font-weight:bold;
box-shadow:0 0 35px rgba(37,211,102,.28);
"
>
💬 CONDIVIDI WHATSAPP
</a>
</div>
`;
}

if (socialMode === "instagram") {
  socialButtons = `
<div style="margin-top:25px;text-align:center;">
<button onclick="safeCopyText('${publicCardURL}')" style="
padding:16px 34px;
border:none;
cursor:pointer;
border-radius:999px;
background:linear-gradient(90deg,#ff00aa,#ff6a00);
color:white;
font-size:18px;
font-weight:bold;
box-shadow:0 0 35px rgba(255,0,170,.28);
">
📸 COPIA LINK INSTAGRAM
</button>
</div>
`;
}

if (socialMode === "youtube") {
  const yt = ytidBtn || ytidAuto;
  const ytURL = yt
    ? `https://youtube.com/watch?v=${encodeURIComponent(yt)}`
    : "https://youtube.com";

  socialButtons = `
<div style="margin-top:25px;text-align:center;">
<a
href="${ytURL}"
target="_blank"
rel="noopener noreferrer"
style="
display:inline-block;
padding:16px 34px;
border-radius:999px;
background:linear-gradient(90deg,#ff0000,#ff3b3b);
color:white;
text-decoration:none;
font-size:18px;
font-weight:bold;
box-shadow:0 0 35px rgba(255,0,0,.28);
">
▶ APRI YOUTUBE
</a>
</div>
`;
}

if (socialMode === "tiktok") {
  socialButtons = `
<div style="margin-top:25px;text-align:center;">
<button onclick="safeCopyText('${publicCardURL}')" style="
padding:16px 34px;
border:none;
cursor:pointer;
border-radius:999px;
background:linear-gradient(90deg,#00f2ea,#ff0050);
color:white;
font-size:18px;
font-weight:bold;
box-shadow:0 0 35px rgba(0,242,234,.28);
">
🎵 COPIA LINK TIKTOK
</button>
</div>
`;
}
  /* =========================
     EXTRA TEXT
  ========================= */

  const fraseFinaleHTML = fraseFinale
    ? `
<div style="
margin-top:24px;
font-size:20px;
line-height:1.6;
opacity:.9;
color:${theme.accent4};
text-shadow:0 0 18px ${theme.accent4};
">
${fraseFinale}
</div>
`
    : "";

  const emoticonsHTML = emoticons
    ? `
<div style="
margin-top:20px;
font-size:32px;
letter-spacing:8px;
">
${emoticons}
</div>
`
    : "";

  const firmaHTML = firma
    ? `
<div style="
margin-top:24px;
font-size:18px;
opacity:.85;
color:${theme.accent};
text-shadow:0 0 14px ${theme.accent};
">
— ${firma}
</div>
`
    : "";

  return `
<div style="
position:relative;
max-width:1200px;
margin:auto;
padding-top:30px;
">

<div style="
position:relative;
padding:${cardPadding};
border-radius:${cardRadius};
background:${cardBackground};
color:${cardTextColor};
max-width:${cardWidth};
min-height:${minHeight};
width:92%;
margin:auto;
box-sizing:border-box;
text-align:${textAlign};
overflow:visible;
box-shadow:
0 0 40px rgba(0,0,0,.35),
0 0 ${theme.glowPower}px ${theme.accent3};
${extraStyle}
">

<h1 style="
font-size:${size.titleSize};
margin-bottom:20px;
font-family:Orbitron,sans-serif;
letter-spacing:2px;
color:${titleColor};
text-shadow:${titleTextShadow};
">
${titolo}
</h1>

<div style="
font-size:${size.textSize};
line-height:1.7;
max-width:700px;
margin:auto;
color:${mainTextColor};
font-style:${mainFontStyle};
letter-spacing:${mainLetterSpacing};
text-shadow:${mainTextShadow};
">
${frase}
</div>

${fraseFinaleHTML}
${emoticonsHTML}
${firmaHTML}

${
miniGif
? `
<div style="
margin-top:20px;
display:flex;
justify-content:center;
">

<img
src="${escapeAttr(miniGif)}"
style="
width:90px;
height:90px;
object-fit:cover;
border-radius:50%;
border:2px solid ${theme.accent};
box-shadow:0 0 25px ${theme.accent};
"
/>

</div>
`
: ""
}

${gifHTML}
${mediaHTML}
${audioHTML}
${socialButtons}

</div>
</div>
`;
}

/* =========================
   GENERATE PREVIEW
========================= */

function genera() {
  const card = buildCardHTML();

  const previewHost = document.getElementById("previewHost");
  const codeBox = document.getElementById("codeBox");

  if (previewHost) previewHost.innerHTML = card;
  if (codeBox) codeBox.textContent = card;

}


/* =========================
   DOWNLOAD GENERATOR
========================= */

function downloadGeneratorHTML() {
  const html = document.documentElement.outerHTML;
  downloadTextFile("temeria-media-forge-generator.html", html, "text/html");
}

function downloadTextFile(filename, content, type = "text/plain") {
  const blob = new Blob([content], { type });
  const a = document.createElement("a");

  a.href = URL.createObjectURL(blob);
  a.download = filename;

  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  URL.revokeObjectURL(a.href);
}

/* =========================
   RESET
========================= */

function resetForge() {

  gifDataURL = "";
  miniDataURL = "";

  const gifInput =
    document.getElementById("giffile");

  if (gifInput)
    gifInput.value = "";

  const miniInput =
    document.getElementById("minifile");

  if (miniInput)
    miniInput.value = "";

  const ids = [
    "titolo",
    "frase",
    "frase2",
    "firma",
    "emoticons",
    "gifurl",
    "imglink",
    "minigif",
    "minilink",
    "ytid_auto",
    "ytid_btn",
    "mp3url",
    "videourl"
  ];

  ids.forEach(id => {

    const el =
      document.getElementById(id);

    if (el)
      el.value = "";

  });

  genera();

}


