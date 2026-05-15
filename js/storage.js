/* =========================
   TEMERIA STORAGE ENGINE V3
========================= */

const APP_VERSION = "3.0.0";

const STATE_KEY = "TEMERIA_STATE_V3";
const HISTORY_KEY = "TEMERIA_HISTORY_V3";
const SHARED_KEY = "TEMERIA_SHARED_V3";

let autosaveEnabled = true;

/* =========================
   STORAGE FIELDS
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
  "glowPower"

];

/* =========================
   SAFE JSON
========================= */

function safeJSON(raw, fallback = null){

  try{
    return JSON.parse(raw);
  }catch(e){
    return fallback;
  }

}

/* =========================
   BUILD STATE
========================= */

function collectState(){

  const data = {};

  STORAGE_FIELDS.forEach(id=>{

    const el = document.getElementById(id);

    if(!el) return;

    data[id] = el.value ?? "";

  });

  return {

    version: APP_VERSION,

    createdAt:
      new Date().toISOString(),

    id:
      "card_" +
      Date.now(),

    data

  };

}

/* =========================
   APPLY STATE
========================= */

function applyState(state){

  if(!state || !state.data)
    return false;

  STORAGE_FIELDS.forEach(id=>{

    const el =
      document.getElementById(id);

    if(!el) return;

    el.value =
      state.data[id] ?? "";

  });

  if(typeof genera === "function"){
    genera();
  }

  return true;

}

/* =========================
   SAVE / LOAD CURRENT
========================= */

function saveCurrentState(){

  const state =
    collectState();

  localStorage.setItem(
    STATE_KEY,
    JSON.stringify(state)
  );

  updateStorageKPI();

  return state;

}

function restoreState(){

  const raw =
    localStorage.getItem(
      STATE_KEY
    );

  if(!raw)
    return false;

  const state =
    safeJSON(raw);

  if(!state)
    return false;

  return applyState(state);

}

/* =========================
   AUTOSAVE
========================= */

function autosaveNow(){

  if(!autosaveEnabled)
    return;

  saveCurrentState();

}

function bindAutosave(){

  STORAGE_FIELDS.forEach(id=>{

    const el =
      document.getElementById(id);

    if(!el) return;

    el.addEventListener(
      "input",
      autosaveNow
    );

    el.addEventListener(
      "change",
      autosaveNow
    );

  });

}

function toggleAutosave(){

  autosaveEnabled =
    !autosaveEnabled;

  updateStorageKPI();

}

/* =========================
   HISTORY
========================= */

function getHistory(){

  const raw =
    localStorage.getItem(
      HISTORY_KEY
    );

  if(!raw)
    return [];

  return safeJSON(raw, []);

}

function setHistory(history){

  localStorage.setItem(
    HISTORY_KEY,
    JSON.stringify(history)
  );

  renderHistory();

  updateStorageKPI();

}

function saveToHistory(){

  const state =
    collectState();

  const history =
    getHistory();

  history.unshift(state);

  setHistory(
    history.slice(0, 30)
  );

}

function restoreHistory(id){

  const history =
    getHistory();

  const item =
    history.find(
      x => x.id === id
    );

  if(!item) return;

  applyState(item);

  saveCurrentState();

}

function deleteHistoryItem(id){

  const history =
    getHistory().filter(
      x => x.id !== id
    );

  setHistory(history);

}

function clearHistory(){

  if(
    !confirm(
      "Svuotare tutta la history?"
    )
  ) return;

  localStorage.removeItem(
    HISTORY_KEY
  );

  renderHistory();

}

/* =========================
   RENDER HISTORY
========================= */

function renderHistory(){

  const box =
    document.getElementById(
      "historyList"
    );

  if(!box) return;

  const history =
    getHistory();

  if(history.length === 0){

    box.innerHTML =
      "Nessuna card salvata.";

    return;

  }

  box.innerHTML = history.map(item=>`

<div style="
padding:12px;
margin-bottom:10px;
border-radius:14px;
background:rgba(255,255,255,.05);
border:1px solid rgba(255,255,255,.1);
">

<div style="
font-weight:bold;
margin-bottom:6px;
">
${escapeHTML(
  item.data.titolo ||
  "Card senza titolo"
)}
</div>

<div style="
font-size:12px;
opacity:.7;
margin-bottom:10px;
">
${new Date(
  item.createdAt
).toLocaleString("it-IT")}
</div>

<div style="
display:flex;
gap:8px;
flex-wrap:wrap;
">

<button
onclick="restoreHistory('${item.id}')"
>
Ripristina
</button>

<button
class="danger"
onclick="deleteHistoryItem('${item.id}')"
>
Elimina
</button>

<button
onclick="shareHistoryCard('${item.id}')"
>
Condividi
</button>

</div>

</div>

`).join("");

}

/* =========================
   SHARE SYSTEM
========================= */

function saveSharedCard(state){

  let cards =
    safeJSON(
      localStorage.getItem(
        SHARED_KEY
      ),
      {}
    );

  if(
    !cards ||
    typeof cards !== "object"
  ){
    cards = {};
  }

  cards[state.id] = state;

  localStorage.setItem(
    SHARED_KEY,
    JSON.stringify(cards)
  );

}

function shareCurrentCard(){

  const state =
    collectState();

  saveSharedCard(state);

  const url =
    window.location.origin +
    window.location.pathname +
    "?share=" +
    encodeURIComponent(state.id) +
    "&v=" +
    Date.now();

  navigator.clipboard.writeText(url);

  alert(
    "Link card copiato!"
  );

}

function shareHistoryCard(id){

  const history =
    getHistory();

  const item =
    history.find(
      x => x.id === id
    );

  if(!item) return;

  saveSharedCard(item);

  const url =
    window.location.origin +
    window.location.pathname +
    "?share=" +
    encodeURIComponent(id) +
    "&v=" +
    Date.now();

  navigator.clipboard.writeText(url);

  alert(
    "Link card copiato!"
  );

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
    return;

  const cards =
    safeJSON(
      localStorage.getItem(
        SHARED_KEY
      ),
      {}
    );

  const state =
    cards[shareId];

  if(!state)
    return;

  applyState(state);

}

/* =========================
   RESET
========================= */

function hardResetForge(){

  localStorage.removeItem(
    STATE_KEY
  );

  STORAGE_FIELDS.forEach(id=>{

    const el =
      document.getElementById(id);

    if(!el) return;

    el.value = "";

  });

  if(typeof genera === "function"){
    genera();
  }

}

/* =========================
   KPI
========================= */

function updateStorageKPI(){

  const kpiSave =
    document.getElementById(
      "kpiSave"
    );

  const kpiHist =
    document.getElementById(
      "kpiHist"
    );

  if(kpiSave){

    kpiSave.textContent =
      autosaveEnabled
      ? "Autosave: ON"
      : "Autosave: OFF";

  }

  if(kpiHist){

    kpiHist.textContent =
      "History: " +
      getHistory().length;

  }

}

/* =========================
   INIT
========================= */

window.addEventListener(
  "load",
  ()=>{

    bindAutosave();

    loadSharedCard();

    restoreState();

    renderHistory();

    updateStorageKPI();

    if(typeof genera === "function"){
      genera();
    }

  }
);
