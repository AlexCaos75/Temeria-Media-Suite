/* =========================
   STORAGE
========================= */

const APP_VERSION = "2.0.0";

const STATE_KEY_V2 =
  "TEMERIA_FORGE_STATE";

const HISTORY_KEY_V2 =
  "TEMERIA_FORGE_HISTORY";

let autosaveEnabled = true;

/* =========================
   JSON SAFE
========================= */

function safeJSONParse(
  raw,
  fallback
) {

  try {

    return JSON.parse(raw);

  } catch (e) {

    return fallback;

  }

}

/* =========================
   FIELD LIST
========================= */

const STORAGE_FIELDS = [

  "titolo",
  "frase",
  "frase2",
  "emoticons",
  "textStyle",
  "cardStyle",
  "socialExport",
  "outputMode",
  "cardSize",
  "firma",

  "gifurl",
  "imglink",
  "minigif",
  "minilink",

  "ytid_auto",
  "ytid_btn",
  "mp3url",
  "audioMode",
  "mediaEngineMode",
  "videourl",

  "themePreset",
  "c_bg",
  "c_txt",
  "c_accent",
  "c_accent2",
  "c_accent3",
  "c_accent4",
  "glowPower",

  "ytPaste",
  "ytPreset",
  "updateManifestUrl"

];

/* =========================
   STATE COLLECT
========================= */

function collectState() {

  const data = {};

  STORAGE_FIELDS.forEach(id => {

    const el =
      document.getElementById(id);

    if (!el)
      return;

    data[id] =
      el.value ?? "";

  });

  return {

    app:
      "Temeria Media Forge",

    version:
      APP_VERSION,

    savedAt:
      new Date().toISOString(),

    data

  };

}

/* =========================
   APPLY STATE
========================= */

function applyState(state) {

  if (
    !state ||
    !state.data
  ) {

    return false;

  }

  Object.entries(
    state.data
  ).forEach(([id, value]) => {

    const el =
      document.getElementById(id);

    if (!el)
      return;

    el.value =
      value ?? "";

  });

  if (
    typeof updateYoutubeThumb ===
    "function"
  ) {

    updateYoutubeThumb();

  }

  if (
    typeof renderThemeSwatches ===
    "function"
  ) {

    renderThemeSwatches();

  }

  return true;

}

/* =========================
   SAVE / LOAD
========================= */

function saveStateV2(state) {

  localStorage.setItem(
    STATE_KEY_V2,
    JSON.stringify(state)
  );

}

function loadStateV2() {

  const raw =
    localStorage.getItem(
      STATE_KEY_V2
    );

  if (!raw)
    return null;

  return safeJSONParse(
    raw,
    null
  );

}

function saveCurrentState() {

  const state =
    collectState();

  saveStateV2(state);

  updateStorageKPI();

  return state;

}

function restoreState() {

  const state =
    loadStateV2();

  if (!state)
    return false;

  return applyState(state);

}

/* =========================
   AUTOSAVE
========================= */

function autosaveNow() {

  if (!autosaveEnabled)
    return;

  saveCurrentState();

}

const autosaveDebounced =

  typeof debounce ===
  "function"

    ? debounce(
        autosaveNow,
        400
      )

    : autosaveNow;

function bindAutosave() {

  STORAGE_FIELDS.forEach(id => {

    const el =
      document.getElementById(id);

    if (!el)
      return;

    el.addEventListener(
      "input",
      autosaveDebounced
    );

    el.addEventListener(
      "change",
      autosaveDebounced
    );

  });

}

function toggleAutosave() {

  autosaveEnabled =
    !autosaveEnabled;

  updateStorageKPI();

}

/* =========================
   HISTORY
========================= */

function getHistory() {

  const raw =
    localStorage.getItem(
      HISTORY_KEY_V2
    );

  if (!raw)
    return [];

  const parsed =
    safeJSONParse(raw, []);

  return Array.isArray(parsed)
    ? parsed
    : [];

}

function setHistory(list) {

  const safeList =
    Array.isArray(list)
      ? list
      : [];

  localStorage.setItem(
    HISTORY_KEY_V2,
    JSON.stringify(safeList)
  );

  renderHistory();

  updateStorageKPI();

}

function saveToHistory() {

  const state =
    collectState();

  const title =

    state.data.titolo?.trim()

    || "Card senza titolo";

  const item = {

    id:
      "hist_" + Date.now(),

    title,

    savedAt:
      new Date().toISOString(),

    state

  };

  const history =
    getHistory();

  history.unshift(item);

  setHistory(
    history.slice(0, 20)
  );

}

function restoreHistory(id) {

  const history =
    getHistory();

  const item =
    history.find(
      x => x.id === id
    );

  if (!item)
    return;

  applyState(item.state);

  saveStateV2(item.state);

  if (
    typeof genera ===
    "function"
  ) {

    genera();

  }

}

function deleteHistoryItem(id) {

  const history =
    getHistory().filter(
      x => x.id !== id
    );

  setHistory(history);

}

function clearHistory() {

  if (
    !confirm(
      "Vuoi svuotare tutta la History?"
    )
  ) {

    return;

  }

  localStorage.removeItem(
    HISTORY_KEY_V2
  );

  renderHistory();

  updateStorageKPI();

}

function renderHistory() {

  const box =
    document.getElementById(
      "historyList"
    );

  if (!box)
    return;

  const history =
    getHistory();

  if (
    !Array.isArray(history)
  ) {

    box.innerHTML =
      "History corrotta.";

    return;

  }

  if (
    history.length === 0
  ) {

    box.innerHTML =
      "Nessuna card salvata.";

    return;

  }

  box.innerHTML =

    history.map(item => {

      const date =
        new Date(
          item.savedAt
        ).toLocaleString(
          "it-IT"
        );

      return `
<div style="
padding:12px;
margin-bottom:10px;
border:1px solid rgba(255,255,255,.12);
border-radius:14px;
background:rgba(255,255,255,.05);
">

<div style="
font-weight:bold;
color:#fff;
">
${escapeHTML(item.title)}
</div>

<div style="
opacity:.75;
font-size:12px;
margin-top:4px;
">
${escapeHTML(date)}
</div>

<div style="
margin-top:10px;
display:flex;
gap:8px;
flex-wrap:wrap;
">

<button
type="button"
onclick="restoreHistory('${item.id}')"
>
Ripristina
</button>

<button
type="button"
class="danger"
onclick="deleteHistoryItem('${item.id}')"
>
Elimina
</button>

</div>
</div>
`;

    }).join("");

}

/* =========================
   BACKUP EXPORT
========================= */

function exportBackup() {

  const backup = {

    app:
      "Temeria Media Forge",

    version:
      APP_VERSION,

    exportedAt:
      new Date().toISOString(),

    state:
      collectState(),

    history:
      getHistory()

  };

  const json =
    JSON.stringify(
      backup,
      null,
      2
    );

  const filename =

    "temeria-forge-backup-"

    + new Date()
      .toISOString()
      .slice(0, 10)

    + ".json";

  if (
    typeof downloadTextFile ===
    "function"
  ) {

    downloadTextFile(
      filename,
      json,
      "application/json"
    );

    return;

  }

  const blob =
    new Blob(
      [json],
      {
        type:
          "application/json"
      }
    );

  const a =
    document.createElement("a");

  a.href =
    URL.createObjectURL(blob);

  a.download =
    filename;

  document.body.appendChild(a);

  a.click();

  document.body.removeChild(a);

  URL.revokeObjectURL(a.href);

}

/* =========================
   BACKUP IMPORT
========================= */

function importBackup() {

  const input =
    document.createElement("input");

  input.type = "file";

  input.accept =
    "application/json,.json";

  input.onchange =
    async () => {

      const file =
        input.files?.[0];

      if (!file)
        return;

      const text =
        await file.text();

      const backup =
        safeJSONParse(
          text,
          null
        );

      if (!backup) {

        alert(
          "Backup non valido."
        );

        return;

      }

      if (backup.state) {

        applyState(
          backup.state
        );

        saveStateV2(
          backup.state
        );

      }

      if (
        Array.isArray(
          backup.history
        )
      ) {

        localStorage.setItem(
          HISTORY_KEY_V2,
          JSON.stringify(
            backup.history
          )
        );

      }

      renderHistory();

      updateStorageKPI();

      if (
        typeof genera ===
        "function"
      ) {

        genera();

      }

      alert(
        "Backup importato."
      );

    };

  input.click();

}

/* =========================
   IMPORT HTML
========================= */

function importaDaHTML() {

  const box =
    document.getElementById(
      "importBox"
    );

  if (!box)
    return;

  const html =
    box.value.trim();

  if (!html)
    return;

  const titleMatch =
    html.match(
      /<h1[^>]*>([\s\S]*?)<\/h1>/i
    );

  const textMatch =
    html.match(
      /<div[^>]*line-height:[^>]*>([\s\S]*?)<\/div>/i
    );

  const imgMatch =
    html.match(
      /<img[^>]+src="([^"]+)"/i
    );

  const ytMatch =
    html.match(
      /youtube\.com\/embed\/([^?"]+)/i
    );

  const videoMatch =
    html.match(
      /<video[^>]+src="([^"]+)"/i
    );

  if (titleMatch) {

    const el =
      document.getElementById(
        "titolo"
      );

    if (el) {

      el.value =
        cleanImportedHTML(
          titleMatch[1]
        );

    }

  }

  if (textMatch) {

    const el =
      document.getElementById(
        "frase"
      );

    if (el) {

      el.value =
        cleanImportedHTML(
          textMatch[1]
        ).replace(
          /<br\s*\/?>/gi,
          "\n"
        );

    }

  }

  if (imgMatch) {

    const el =
      document.getElementById(
        "gifurl"
      );

    if (el)
      el.value = imgMatch[1];

  }

  if (ytMatch) {

    const el =
      document.getElementById(
        "ytid_auto"
      );

    if (el)
      el.value = ytMatch[1];

  }

  if (videoMatch) {

    const el =
      document.getElementById(
        "videourl"
      );

    if (el)
      el.value = videoMatch[1];

  }

  saveCurrentState();

  if (
    typeof genera ===
    "function"
  ) {

    genera();

  }

}

function cleanImportedHTML(str) {

  const tmp =
    document.createElement("div");

  tmp.innerHTML = str;

  return (
    tmp.textContent
    || tmp.innerText
    || ""
  );

}

/* =========================
   KPI
========================= */

function updateStorageKPI() {

  const kpiSave =
    document.getElementById(
      "kpiSave"
    );

  const kpiHist =
    document.getElementById(
      "kpiHist"
    );

  if (kpiSave) {

    kpiSave.textContent =

      autosaveEnabled

        ? "Autosave: ON"

        : "Autosave: OFF";

  }

  if (kpiHist) {

    const history =
      getHistory();

    kpiHist.textContent =

      "History: "

      + (

        Array.isArray(history)

          ? history.length

          : 0

      );

  }

}

/* =========================
   INIT STORAGE
========================= */

window.addEventListener(
  "load",
  () => {

    const rawHistory =
      localStorage.getItem(
        HISTORY_KEY_V2
      );

    if (
      rawHistory === "null"
    ) {

      localStorage.removeItem(
        HISTORY_KEY_V2
      );

    }

    bindAutosave();

    restoreState();

    renderHistory();

    updateStorageKPI();

    if (
      typeof genera ===
      "function"
    ) {

      genera();

    }

  }
);