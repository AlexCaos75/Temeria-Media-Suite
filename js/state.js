/* =========================================================
   TEMERIA MEDIA FORGE V4 - STATE ENGINE
   Stato centrale, upload locali, localStorage stabile
========================================================= */

(function(){
  "use strict";

  const STORAGE_KEY = "TEMERIA_FORGE_V4_STATE";
  const HISTORY_KEY = "TEMERIA_FORGE_V4_HISTORY";
  const VERSION = "4.0.0";

  const DEFAULT_STATE = {
    version: VERSION,
    id: "",
    content: {
      title: "",
      phrase: "",
      phrase2: "",
      signature: "",
      emoticons: ""
    },
  style: {
  cardStyle: "holo",
  textStyle: "normal",
  outputMode: "social_clean",
  socialExport: "normal",
  cardSize: "medium",

  fontPreset: "Orbitron",
  textMood: "normal"
},
    theme: {
      bg: "#070a12",
      txt: "#eafcff",
      accent: "#00f6ff",
      accent2: "#111827",
      accent3: "#b06cff",
      accent4: "#6cff9f",
      glowPower: 55
    },
media: {
  mainImage: "",
  mainImageRaw: "",
  mainImagePublic: "",
  mainImageName: "",
  mainImageLink: "",
  logo: "",
  logoName: "",
  logoLink: "",
  videoUrl: "",
  videoName: "",
  videoMode: "visible_controls",
  audioMode: "yt_buttons",
  youtubeAutoId: "",
  youtubeButtonId: "",
  mp3Url: "",
  mp3Name: "",
  mediaEngineMode: "temeria_v4"
},
    github: {
      lastPublishedUrl: "",
      ogImageUrl: ""
    }
  };

  function clone(obj){
    return JSON.parse(JSON.stringify(obj));
  }

  function $(id){
    return document.getElementById(id);
  }

  function getVal(id, fallback = ""){
    const el = $(id);
    if(!el) return fallback;
    return el.value ?? fallback;
  }

  function setVal(id, value){
    const el = $(id);
    if(el) el.value = value ?? "";
  }

  function escapeHTML(str){
    return String(str || "")
      .replace(/&/g,"&amp;")
      .replace(/</g,"&lt;")
      .replace(/>/g,"&gt;")
      .replace(/"/g,"&quot;")
      .replace(/'/g,"&#039;");
  }

  function escapeAttr(str){
    return String(str || "")
      .replace(/&/g,"&amp;")
      .replace(/"/g,"&quot;")
      .replace(/</g,"&lt;")
      .replace(/>/g,"&gt;");
  }

  function nl2brSafe(str){
    return escapeHTML(str).replace(/\n/g,"<br>");
  }

  function safeCopyText(text){
    if(navigator.clipboard && window.isSecureContext){
      navigator.clipboard.writeText(text).catch(() => fallbackCopyText(text));
    }else{
      fallbackCopyText(text);
    }
  }

  function fallbackCopyText(text){
    const area = document.createElement("textarea");
    area.value = text;
    area.style.position = "fixed";
    area.style.left = "-9999px";
    document.body.appendChild(area);
    area.focus();
    area.select();
    try{ document.execCommand("copy"); }catch(e){ console.warn(e); }
    document.body.removeChild(area);
  }

  function readThemeFromUI(){
    if(typeof window.getThemeFromUI === "function"){
      try{
        return Object.assign(clone(DEFAULT_STATE.theme), window.getThemeFromUI());
      }catch(e){}
    }

    return {
      bg: getVal("c_bg", DEFAULT_STATE.theme.bg),
      txt: getVal("c_txt", DEFAULT_STATE.theme.txt),
      accent: getVal("c_accent", DEFAULT_STATE.theme.accent),
      accent2: getVal("c_accent2", DEFAULT_STATE.theme.accent2),
      accent3: getVal("c_accent3", DEFAULT_STATE.theme.accent3),
      accent4: getVal("c_accent4", DEFAULT_STATE.theme.accent4),
      glowPower: Number(getVal("glowPower", DEFAULT_STATE.theme.glowPower)) || 55
    };
  }

  function collectState(){
    const old = window.TemeriaForge?.state || clone(DEFAULT_STATE);

    const state = clone(DEFAULT_STATE);
    state.id = old.id || "card_" + Date.now();
    state.version = VERSION;

    state.content.title = getVal("titolo");
    state.content.phrase = getVal("frase");
    state.content.phrase2 = getVal("frase2");
    state.content.signature = getVal("firma");
    state.content.emoticons = getVal("emoticons");

    state.style.cardStyle = getVal("cardStyle", "holo");
    state.style.textStyle = getVal("textStyle", "normal");
    state.style.outputMode = getVal("outputMode", "social_clean");
    state.style.socialExport = getVal("socialExport", "normal");
    state.style.cardSize = getVal("cardSize", "medium");

    state.style.fontPreset =
  getVal("fontPreset", "Orbitron");

state.style.textMood =
  getVal("textMood", "normal");

    state.theme = readThemeFromUI();

  state.media.mainImageRaw =
  old.media?.mainImageRaw || "";

const uiImage =
  getVal("gifurl").trim();

state.media.mainImage =
  uiImage ||
  old.media?.mainImagePublic ||
  old.media?.mainImage ||
  "";

state.media.mainImagePublic =
  old.media?.mainImagePublic || "";

    state.media.mainImageName = old.media?.mainImageName || "";
    state.media.mainImageLink = getVal("imglink").trim();

    state.media.logo = old.media?.logo || getVal("minigif").trim();
    state.media.logoName = old.media?.logoName || "";
    state.media.logoLink = getVal("minilink").trim();

   const uiVideo =
  getVal("videourl").trim();

state.media.videoUrl =
  uiVideo ||
  old.media?.videoUrlPublic ||
  old.media?.videoPublic ||
  old.media?.videoUrl ||
  "";
    state.media.videoName = old.media?.videoName || "";
state.media.videoMode =
  getVal(
    "videoMode",
    "visible_controls"
  );
    state.media.audioMode = getVal("audioMode", "yt_buttons");
    state.media.youtubeAutoId = getVal("ytid_auto").trim();
    state.media.youtubeButtonId = getVal("ytid_btn").trim();

    state.media.mp3Url = old.media?.mp3Url?.startsWith("data:audio/")
      ? old.media.mp3Url
      : getVal("mp3url").trim();
    state.media.mp3Name = old.media?.mp3Name || "";

    state.media.mediaEngineMode = getVal("mediaEngineMode", "temeria_v4");

    state.github.lastPublishedUrl = old.github?.lastPublishedUrl || "";
    state.github.ogImageUrl =
  old.github?.ogImageUrl || "";

    window.TemeriaForge.state = state;
    return state;
  }

  function applyState(state){
    if(!state) return;

    const merged = Object.assign(clone(DEFAULT_STATE), state);
    merged.content = Object.assign(clone(DEFAULT_STATE.content), state.content || {});
    merged.style = Object.assign(clone(DEFAULT_STATE.style), state.style || {});
    merged.theme = Object.assign(clone(DEFAULT_STATE.theme), state.theme || {});
    merged.media = Object.assign(clone(DEFAULT_STATE.media), state.media || {});
    merged.github = Object.assign(clone(DEFAULT_STATE.github), state.github || {});

    window.TemeriaForge.state = merged;

    setVal("titolo", merged.content.title);
    setVal("frase", merged.content.phrase);
    setVal("frase2", merged.content.phrase2);
    setVal("firma", merged.content.signature);
    setVal("emoticons", merged.content.emoticons);

    setVal("cardStyle", merged.style.cardStyle);
    setVal("textStyle", merged.style.textStyle);
    setVal("outputMode", merged.style.outputMode);
    setVal("socialExport", merged.style.socialExport);
    setVal("cardSize", merged.style.cardSize);
    setVal(
  "fontPreset",
  merged.style.fontPreset || "Orbitron"
);

setVal(
  "textMood",
  merged.style.textMood || "normal"
);

    setVal("c_bg", merged.theme.bg);
    setVal("c_txt", merged.theme.txt);
    setVal("c_accent", merged.theme.accent);
    setVal("c_accent2", merged.theme.accent2);
    setVal("c_accent3", merged.theme.accent3);
    setVal("c_accent4", merged.theme.accent4);
    setVal("glowPower", merged.theme.glowPower);

    setVal("gifurl", merged.media.mainImage.startsWith("data:") ? "" : merged.media.mainImage);
    setVal("imglink", merged.media.mainImageLink);

    setVal("minigif", merged.media.logo.startsWith("data:") ? "" : merged.media.logo);
    setVal("minilink", merged.media.logoLink);

    setVal("videourl", merged.media.videoUrl.startsWith("data:") ? "" : merged.media.videoUrl);
setVal(
  "videoMode",
  merged.media.videoMode || "visible_controls"
);
    setVal("audioMode", merged.media.audioMode);
    setVal("ytid_auto", merged.media.youtubeAutoId);
    setVal("ytid_btn", merged.media.youtubeButtonId);
    setVal("mp3url", merged.media.mp3Url.startsWith("data:") ? "" : merged.media.mp3Url);

    setVal("mediaEngineMode", merged.media.mediaEngineMode);
  }

  function saveState(){
    const state = collectState();
    try{
      const safeState =
  JSON.parse(JSON.stringify(state));

/* =========================
   REMOVE HUGE RAW DATA
========================= */

if(safeState.media){

  safeState.media.mainImageRaw = "";

}

localStorage.setItem(
  STORAGE_KEY,
  JSON.stringify(safeState)
);
      updateSaveKPI("Autosave: OK");
    }catch(e){
      console.warn("Salvataggio troppo grande o fallito", e);
      updateSaveKPI("Autosave: errore");
    }
    return state;
  }

  function loadState(){
    try{
      const raw = localStorage.getItem(STORAGE_KEY);
      if(!raw) return null;
      const state = JSON.parse(raw);
      applyState(state);
      return state;
    }catch(e){
      console.warn("Load state fallito", e);
      return null;
    }
  }

  function updateSaveKPI(text){
    const kpi = $("kpiSave");
    if(kpi) kpi.textContent = text;
  }

  function saveToHistory(){
    const state = collectState();
    const raw = localStorage.getItem(HISTORY_KEY);
    let list = [];
    try{ list = raw ? JSON.parse(raw) : []; }catch(e){ list = []; }

    list.unshift({
      savedAt: new Date().toISOString(),
      title: state.content.title || "Card senza titolo",
      state
    });

    list = list.slice(0, 25);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(list));
    renderHistoryList();
  }

  function clearHistory(){
    localStorage.removeItem(HISTORY_KEY);
    renderHistoryList();
  }

  function renderHistoryList(){
    const host = $("historyList");
    if(!host) return;

    const raw = localStorage.getItem(HISTORY_KEY);
    let list = [];
    try{ list = raw ? JSON.parse(raw) : []; }catch(e){ list = []; }

    const kpi = $("kpiHist");
    if(kpi) kpi.textContent = "History: " + list.length;

    if(!list.length){
      host.innerHTML = "Nessuna card salvata.";
      return;
    }

    host.innerHTML = list.map((item, index) => `
      <div style="display:flex;gap:8px;align-items:center;justify-content:space-between;border:1px solid rgba(255,255,255,.1);padding:10px;border-radius:12px;margin:8px 0;">
        <span>${escapeHTML(item.title)}<br><small>${escapeHTML(new Date(item.savedAt).toLocaleString())}</small></span>
        <button type="button" onclick="TemeriaForge.restoreHistory(${index})">Ripristina</button>
      </div>
    `).join("");
  }

  function restoreHistory(index){
    const raw = localStorage.getItem(HISTORY_KEY);
    let list = [];
    try{ list = raw ? JSON.parse(raw) : []; }catch(e){ list = []; }
    if(!list[index]) return;

    applyState(list[index].state);
    if(typeof window.genera === "function") window.genera();
  }

  function resetForge(){
    localStorage.removeItem(STORAGE_KEY);
    window.TemeriaForge.state = clone(DEFAULT_STATE);
    window.TemeriaForge.state.github.ogImageUrl = "";
window.TemeriaForge.state.github.lastPublishedUrl = "";
    applyState(clone(DEFAULT_STATE));

    const gf = $("giffile"); if(gf) gf.value = "";
    const mf = $("minifile"); if(mf) mf.value = "";
    const af = $("mp3file"); if(af) af.value = "";
    const vf = $("videofile"); if(vf) vf.value = "";

    if(typeof window.genera === "function") window.genera();
  }

  function handleFileInput(inputId, targetKey, nameKey, urlInputId, expectedType){
    const input = $(inputId);
    if(!input) return;

    input.addEventListener("change", function(e){
      const file = e.target.files?.[0];
      if(!file) return;

      if(expectedType && !file.type.startsWith(expectedType)){
        alert("File non valido. Seleziona un file " + expectedType.replace("/", "") + ".");
        e.target.value = "";
        return;
      }

      const reader = new FileReader();

      reader.onload = function(ev){
        if(!window.TemeriaForge.state)
          window.TemeriaForge.state = clone(DEFAULT_STATE);

       window.TemeriaForge.state.media[targetKey] =
  ev.target.result;

if(targetKey === "mainImage"){

  window.TemeriaForge.state.media.mainImageRaw =
    ev.target.result;

}

window.TemeriaForge.state.media[nameKey] =
  file.name || "local-file";

        setVal(urlInputId, "");

        if(targetKey === "mp3Url"){
          setVal("audioMode", "mp3");
          window.TemeriaForge.state.media.audioMode = "mp3";
        }

        try{

  /*
    Non salvare media enormi nel localStorage.
    Manteniamo solo preview/editor corrente.
  */

  const isHeavy =
    targetKey === "videoUrl" ||
    targetKey === "mp3Url";

  if(!isHeavy){
    saveState();
  }

}catch(e){
  console.warn(e);
}

        if(typeof window.genera === "function")
          window.genera();

        e.target.value = "";
      };

      reader.readAsDataURL(file);
    });
  }

  window.TemeriaForge = window.TemeriaForge || {};
  window.TemeriaForge.VERSION = VERSION;
  window.TemeriaForge.DEFAULT_STATE = DEFAULT_STATE;
  window.TemeriaForge.state = clone(DEFAULT_STATE);

  window.TemeriaForge.collectState = collectState;
  window.TemeriaForge.applyState = applyState;
  window.TemeriaForge.saveState = saveState;
  window.TemeriaForge.loadState = loadState;
  window.TemeriaForge.saveToHistory = saveToHistory;
  window.TemeriaForge.clearHistory = clearHistory;
  window.TemeriaForge.renderHistoryList = renderHistoryList;
  window.TemeriaForge.restoreHistory = restoreHistory;
  window.TemeriaForge.resetForge = resetForge;
  window.TemeriaForge.escapeHTML = escapeHTML;
  window.TemeriaForge.escapeAttr = escapeAttr;
  window.TemeriaForge.nl2brSafe = nl2brSafe;
  window.TemeriaForge.safeCopyText = safeCopyText;
  window.TemeriaForge.getVal = getVal;
  window.TemeriaForge.setVal = setVal;

  window.collectState = collectState;
  window.applyState = applyState;
  window.saveToHistory = saveToHistory;
  window.clearHistory = clearHistory;
  window.resetForge = resetForge;
  window.safeCopyText = safeCopyText;
  window.escapeHTML = escapeHTML;
  window.escapeAttr = escapeAttr;
  window.nl2brSafe = nl2brSafe;
  window.getVal = getVal;

  window.addEventListener("DOMContentLoaded", function(){
    loadState();

    handleFileInput("giffile", "mainImage", "mainImageName", "gifurl", "image/");
    handleFileInput("minifile", "logo", "logoName", "minigif", "image/");

    handleFileInput("mp3file", "mp3Url", "mp3Name", "mp3url", "audio/");
    handleFileInput("videofile", "videoUrl", "videoName", "videourl", "video/");

    renderHistoryList();
  });
})();
