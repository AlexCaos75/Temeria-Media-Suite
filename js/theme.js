/* =========================
   THEME ENGINE
========================= */

const THEME_PRESETS = {

  fantasy: {

    bg:"#1a102b",

    txt:"#ffffff",

    accent:"#c084fc",

    accent2:"#8b5cf6",

    accent3:"#ec4899",

    accent4:"#7dd3fc",

    glowPower:65
  },

  dark: {

    bg:"#050505",

    txt:"#f5f5f5",

    accent:"#3b82f6",

    accent2:"#111827",

    accent3:"#6366f1",

    accent4:"#0ea5e9",

    glowPower:45
  },

  modern: {

    bg:"#0f172a",

    txt:"#f8fafc",

    accent:"#06b6d4",

    accent2:"#14b8a6",

    accent3:"#38bdf8",

    accent4:"#22c55e",

    glowPower:50
  },

  neon: {

    bg:"#050816",

    txt:"#ffffff",

    accent:"#00f6ff",

    accent2:"#ff00aa",

    accent3:"#b06cff",

    accent4:"#39ff14",

    glowPower:85
  }

};

function getThemeFromUI(){

  return {

    bg:
      document.getElementById("c_bg")?.value
      || "#070a12",

    txt:
      document.getElementById("c_txt")?.value
      || "#ffffff",

    accent:
      document.getElementById("c_accent")?.value
      || "#00f6ff",

    accent2:
      document.getElementById("c_accent2")?.value
      || "#7fffd9",

    accent3:
      document.getElementById("c_accent3")?.value
      || "#b06cff",

    accent4:
      document.getElementById("c_accent4")?.value
      || "#6cff9f",

    glowPower:
      parseInt(
        document.getElementById("glowPower")?.value || 55
      )

  };
}
