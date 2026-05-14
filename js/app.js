/* =========================
   APP INIT
========================= */

let autoGenerateEnabled = true;

const autoG = debounce(() => {
  if (!autoGenerateEnabled) return;
  genera();
}, 300);

function updateAutoKPI() {
  const kpi = document.getElementById("kpiAuto");
  if (!kpi) return;

  kpi.textContent = autoGenerateEnabled
    ? "Auto-genera: ON"
    : "Auto-genera: OFF";
}

function setAutoGenerate(enabled) {
  autoGenerateEnabled = !!enabled;

  updateAutoKPI();

  if (autoGenerateEnabled) {
    genera();
  }
}

function toggleAutoGenerate() {
  setAutoGenerate(!autoGenerateEnabled);
}

function bindAutoGenerate() {
  document
    .querySelectorAll("input, textarea, select")
    .forEach(el => {
      el.addEventListener("input", autoG);
      el.addEventListener("change", autoG);
    });
}

window.addEventListener("load", () => {
  bindAutoGenerate();
  updateAutoKPI();

  if (typeof genera === "function") {
    genera();
  }
});
