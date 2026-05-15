/* =========================
   APP INIT
========================= */

let autoGenerateEnabled = true;

/* =========================
   DEBOUNCE
========================= */

function debounce(fn, delay = 300) {

  let timer;

  return function(...args) {

    clearTimeout(timer);

    timer = setTimeout(() => {

      fn.apply(this, args);

    }, delay);

  };

}

/* =========================
   AUTO GENERATE
========================= */

const autoG = debounce(() => {

  if (!autoGenerateEnabled)
    return;

  if (typeof genera === "function") {

    genera();

  }

}, 300);

/* =========================
   KPI STATUS
========================= */

function updateAutoKPI() {

  const kpi =
    document.getElementById("kpiAuto");

  if (!kpi)
    return;

  kpi.textContent =
    autoGenerateEnabled
      ? "Auto-genera: ON"
      : "Auto-genera: OFF";

}

/* =========================
   ENABLE / DISABLE
========================= */

function setAutoGenerate(enabled) {

  autoGenerateEnabled =
    !!enabled;

  updateAutoKPI();

  if (
    autoGenerateEnabled &&
    typeof genera === "function"
  ) {

    genera();

  }

}

/* =========================
   TOGGLE
========================= */

function toggleAutoGenerate() {

  setAutoGenerate(
    !autoGenerateEnabled
  );

}

/* =========================
   BIND INPUTS
========================= */

function bindAutoGenerate() {

  const fields =
    document.querySelectorAll(
      "input, textarea, select"
    );

  fields.forEach(el => {

    el.addEventListener(
      "input",
      autoG
    );

    el.addEventListener(
      "change",
      autoG
    );

  });

}

/* =========================
   INIT
========================= */

window.addEventListener(
  "load",
  () => {

    bindAutoGenerate();

    updateAutoKPI();

    if (
      typeof genera === "function"
    ) {

      genera();

    }

  }
);