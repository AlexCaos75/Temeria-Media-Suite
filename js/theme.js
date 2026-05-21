/* =========================
   THEME ENGINE
========================= */

const THEME_PRESETS = {
  fantasy: {
    bg: "#1a102b",
    txt: "#ffffff",
    accent: "#c084fc",
    accent2: "#8b5cf6",
    accent3: "#ec4899",
    accent4: "#7dd3fc",
    glowPower: 65
  },

  dark: {
    bg: "#050505",
    txt: "#f5f5f5",
    accent: "#3b82f6",
    accent2: "#111827",
    accent3: "#6366f1",
    accent4: "#0ea5e9",
    glowPower: 45
  },

  modern: {
    bg: "#0f172a",
    txt: "#f8fafc",
    accent: "#06b6d4",
    accent2: "#14b8a6",
    accent3: "#38bdf8",
    accent4: "#22c55e",
    glowPower: 50
  },

  neon: {
    bg: "#050816",
    txt: "#ffffff",
    accent: "#00f6ff",
    accent2: "#ff00aa",
    accent3: "#b06cff",
    accent4: "#39ff14",
    glowPower: 85
  },

  temeria: {
    bg: "#050816",
    txt: "#eafcff",
    accent: "#b06cff",
    accent2: "#111827",
    accent3: "#00f6ff",
    accent4: "#f9a8d4",
    glowPower: 75
  },
fata_piume: {
  bg: "#06111f",
  txt: "#f8fbff",
  accent: "#d8b4fe",
  accent2: "#0f172a",
  accent3: "#7dd3fc",
  accent4: "#fef3c7",
  glowPower: 82
},
  regina: {
    bg: "#12020a",
    txt: "#fff1f5",
    accent: "#ff2f7d",
    accent2: "#3b0715",
    accent3: "#b91c1c",
    accent4: "#facc15",
    glowPower: 85
  },

  tiktok: {
    bg: "#000000",
    txt: "#ffffff",
    accent: "#00f6ff",
    accent2: "#111827",
    accent3: "#ff0050",
    accent4: "#00f2ea",
    glowPower: 90
  },

  angelic: {
    bg: "#f8fafc",
    txt: "#111827",
    accent: "#c084fc",
    accent2: "#e2e8f0",
    accent3: "#f9a8d4",
    accent4: "#ffffff",
    glowPower: 40
  },

  velvet: {
    bg: "#140014",
    txt: "#f5eaff",
    accent: "#d946ef",
    accent2: "#2a0a2a",
    accent3: "#7e22ce",
    accent4: "#f472b6",
    glowPower: 80
  },

  parchment: {
    bg: "#2b1a0e",
    txt: "#fff7ed",
    accent: "#facc15",
    accent2: "#5a3418",
    accent3: "#d97706",
    accent4: "#fde68a",
    glowPower: 35
  }
};

function getThemeFromUI() {
  return {
    bg: document.getElementById("c_bg")?.value || "#070a12",
    txt: document.getElementById("c_txt")?.value || "#ffffff",
    accent: document.getElementById("c_accent")?.value || "#00f6ff",
    accent2: document.getElementById("c_accent2")?.value || "#7fffd9",
    accent3: document.getElementById("c_accent3")?.value || "#b06cff",
    accent4: document.getElementById("c_accent4")?.value || "#6cff9f",
    glowPower: parseInt(document.getElementById("glowPower")?.value || 55, 10)
  };
}

function setThemeToUI(theme) {
  if (!theme) return;

  const map = {
    c_bg: theme.bg,
    c_txt: theme.txt,
    c_accent: theme.accent,
    c_accent2: theme.accent2,
    c_accent3: theme.accent3,
    c_accent4: theme.accent4,
    glowPower: theme.glowPower
  };

  Object.entries(map).forEach(([id, value]) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.value = value;
  });

  renderThemeSwatches();

  if (typeof genera === "function") genera();
}

const PRESET_DESCRIPTIONS = {
  

  fantasy:
    "🌌 Fantasy glow classico Temeria.",

  dark:
    "🖤 Atmosfera scura elegante.",

  modern:
    "✨ Pulito moderno cinematic.",

  neon:
    "💜 Glow cyber neon intenso.",

  temeria:
    "🪽 Preset ufficiale Temeria.",

  fata_piume:
    "🪶 Atmosfera angelica e poetica.",

  regina:
    "👑 Regina di Cuori passionale.",

  tiktok:
    "🎵 Neon social verticale TikTok.",

  angelic:
    "☁️ Atmosfera chiara spirituale.",

  velvet:
    "🌙 Eleganza dark vellutata.",

  parchment:
    "📜 Pergamena fantasy antica."
};
const PRESET_ICONS = {

  fantasy: "🌌",
  dark: "🖤",
  modern: "✨",
  neon: "💜",
  temeria: "🪽",
  fata_piume: "🪶",
  regina: "👑",
  tiktok: "🎵",
  angelic: "☁️",
  velvet: "🌙",
  parchment: "📜"
};
const PRESET_GLOWS = {

  fantasy:
    "0 0 25px rgba(192,132,252,.35)",

  dark:
    "0 0 18px rgba(59,130,246,.22)",

  modern:
    "0 0 20px rgba(34,211,238,.25)",

  neon:
    "0 0 40px rgba(176,108,255,.55)",

  temeria:
    "0 0 45px rgba(176,108,255,.42)",

  fata_piume:
    "0 0 50px rgba(253,224,71,.28)",

  regina:
    "0 0 45px rgba(255,47,125,.45)",

  tiktok:
    "0 0 55px rgba(0,246,255,.38)",

  angelic:
    "0 0 35px rgba(255,255,255,.35)",

  velvet:
    "0 0 40px rgba(217,70,239,.35)",

  parchment:
    "0 0 28px rgba(250,204,21,.22)"
};
function applyThemeToUI() {
  const presetId = document.getElementById("themePreset")?.value || "fantasy";

const presetIcon =
  document.getElementById("presetIcon");

  const presetDescriptionBox =
  document.getElementById("presetDescription");

const presetText =
  document.getElementById("presetText");

if(presetText){
  presetText.innerHTML =
    PRESET_DESCRIPTIONS[presetId]
    || "✨ Preset Temeria";
}

if(presetIcon){
  presetIcon.innerHTML =
    PRESET_ICONS[presetId]
    || "✨";
}

if(presetDescriptionBox){
  presetDescriptionBox.style.boxShadow =
    PRESET_GLOWS[presetId]
    || "0 0 20px rgba(255,255,255,.12)";
}

  const theme = THEME_PRESETS[presetId];
/* =========================
   AUTO PRESET ENGINE
========================= */

const fontPreset =
  document.getElementById("fontPreset");

const textMood =
  document.getElementById("textMood");

const cardStyle =
  document.getElementById("cardStyle");

const outputMode =
  document.getElementById("outputMode");
  const cardSize =
  document.getElementById("cardSize");

const socialExport =
  document.getElementById("socialExport");

if(presetId === "temeria"){
  if(fontPreset) fontPreset.value = "Cinzel";
  if(textMood) textMood.value = "dream";
  if(cardStyle) cardStyle.value = "nebula";
  if(outputMode) outputMode.value = "cinematic";

  if(cardSize) cardSize.value = "medium";
if(socialExport) socialExport.value = "normal";
}
if(presetId === "fata_piume"){
  if(fontPreset) fontPreset.value = "Cormorant Garamond";
  if(textMood) textMood.value = "angel";
  if(cardStyle) cardStyle.value = "nebula";
  if(outputMode) outputMode.value = "cinematic";

  if(cardSize) cardSize.value = "medium";
  if(socialExport) socialExport.value = "whatsapp";
}
if(presetId === "regina"){
  if(fontPreset) fontPreset.value = "Playfair Display";
  if(textMood) textMood.value = "neon";
  if(cardStyle) cardStyle.value = "glass";
  if(outputMode) outputMode.value = "music_focus";

  if(cardSize) cardSize.value = "large";
if(socialExport) socialExport.value = "youtube";
}

if(presetId === "tiktok"){
  if(fontPreset) fontPreset.value = "Montserrat";
  if(textMood) textMood.value = "neon";
  if(cardStyle) cardStyle.value = "holo";
  if(outputMode) outputMode.value = "cinematic";

  if(cardSize) cardSize.value = "story";
if(socialExport) socialExport.value = "tiktok";
}

if(presetId === "angelic"){
  if(fontPreset) fontPreset.value = "Cormorant Garamond";
  if(textMood) textMood.value = "angel";
  if(cardStyle) cardStyle.value = "glass";
  if(outputMode) outputMode.value = "social_clean";

  if(cardSize) cardSize.value = "medium";
if(socialExport) socialExport.value = "whatsapp";
}

if(presetId === "velvet"){
  if(fontPreset) fontPreset.value = "Cinzel";
  if(textMood) textMood.value = "dream";
  if(cardStyle) cardStyle.value = "classic";
  if(outputMode) outputMode.value = "cinematic";

  if(cardSize) cardSize.value = "large";
if(socialExport) socialExport.value = "facebook";
}

if(presetId === "parchment"){
  if(fontPreset) fontPreset.value = "Cormorant Garamond";
  if(textMood) textMood.value = "parchment";
  if(cardStyle) cardStyle.value = "classic";
  if(outputMode) outputMode.value = "social_clean";

  if(cardSize) cardSize.value = "square";
if(socialExport) socialExport.value = "normal";
}
  if (!theme) return;

  setThemeToUI(theme);
}

function randomTheme() {
  const theme = {
    bg: randomColorDark(),
    txt: "#ffffff",
    accent: randomColorBright(),
    accent2: randomColorBright(),
    accent3: randomColorBright(),
    accent4: randomColorBright(),
    glowPower: Math.floor(35 + Math.random() * 60)
  };

  setThemeToUI(theme);
}

function randomColorBright() {
  const h = Math.floor(Math.random() * 360);
  return hslToHex(h, 90, 65);
}

function randomColorDark() {
  const h = Math.floor(Math.random() * 360);
  return hslToHex(h, 70, 10);
}

function hslToHex(h, s, l) {
  s /= 100;
  l /= 100;

  const k = n => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);

  const f = n =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));

  return (
    "#" +
    [f(0), f(8), f(4)]
      .map(x =>
        Math.round(255 * x)
          .toString(16)
          .padStart(2, "0")
      )
      .join("")
  );
}

function copyThemeJSON() {
  const theme = getThemeFromUI();
  const json = JSON.stringify(theme, null, 2);

  if (typeof safeCopyText === "function") {
    safeCopyText(json);
  } else {
    navigator.clipboard.writeText(json);
  }

  alert("Palette copiata.");
}

function renderThemeSwatches() {
  const box = document.getElementById("themeSwatches");
  if (!box) return;

  const theme = getThemeFromUI();

  const colors = [
    theme.bg,
    theme.txt,
    theme.accent,
    theme.accent2,
    theme.accent3,
    theme.accent4
  ];

  box.innerHTML = colors.map(color => `
<div
title="${color}"
style="
width:34px;
height:34px;
border-radius:999px;
background:${color};
border:1px solid rgba(255,255,255,.35);
box-shadow:0 0 18px ${color};
"
></div>
`).join("");
}

const PRESET_TEXTS = {
  temeria: {
    title: "Temeria",
    phrase: "Tra luce, sogni e piccoli segreti,\nuna scintilla attraversa la notte.",
    phrase2: "Dove nasce un’emozione,\nTemeria lascia il suo riflesso.",
    emoticons: "🪽 🌙 💜 ✨"
  },

  fata_piume: {
    title: "Temeria — La Fata delle Piume",
    phrase: "Nel silenzio della notte,\nuna piuma luminosa attraversa il cielo\ne trasforma i sogni in musica.",
    phrase2: "Dove nasce una melodia,\nTemeria lascia il suo incanto.",
    emoticons: "🪶 🪽 🌙 ✨ 💜"
  },

  regina: {
    title: "Regina di Cuori",
    phrase: "Tra caos, destino e desideri,\nuna melodia accende la notte.",
    phrase2: "Anche un cuore spezzato\npuò imparare a brillare.",
    emoticons: "👑 ❤️ 🔥 🌹 🎵"
  },

  tiktok: {
    title: "Temeria Vibes",
    phrase: "Non è solo una card.\nÈ un piccolo mondo che si accende.",
    phrase2: "Guarda, ascolta, attraversa.",
    emoticons: "🎵 ⚡ 💜 ✨"
  },

  parchment: {
    title: "Lettera di Luce",
    phrase: "Su carta antica resta scritto\nciò che il cuore non dimentica.",
    phrase2: "Ogni parola è una piccola fiamma.",
    emoticons: "📜 🕯️ ✨"
  }
};

function applyPresetText(){
  const presetId =
    document.getElementById("themePreset")?.value || "temeria";

  const data =
    PRESET_TEXTS[presetId];

  if(!data){
    alert("Nessun testo rapido per questo preset.");
    return;
  }

  const set = (id, value) => {
    const el = document.getElementById(id);
    if(el) el.value = value;
  };

  set("titolo", data.title);
  set("frase", data.phrase);
  set("frase2", data.phrase2);
  set("emoticons", data.emoticons);

  if(typeof genera === "function"){
    genera();
  }
}

window.addEventListener("load", () => {
  const preset = document.getElementById("themePreset");

  if (preset) {
    preset.addEventListener("change", applyThemeToUI);
  }

  [
    "c_bg",
    "c_txt",
    "c_accent",
    "c_accent2",
    "c_accent3",
    "c_accent4",
    "glowPower"
  ].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;

    el.addEventListener("input", () => {
      renderThemeSwatches();
      if (typeof genera === "function") genera();
    });

    el.addEventListener("change", () => {
      renderThemeSwatches();
      if (typeof genera === "function") genera();
    });
  });

  renderThemeSwatches();
});
