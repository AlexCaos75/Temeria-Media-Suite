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

function applyThemeToUI() {
  const presetId = document.getElementById("themePreset")?.value || "fantasy";
  const theme = THEME_PRESETS[presetId];

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