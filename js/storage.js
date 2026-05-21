/* =========================
   TEMERIA STORAGE ENGINE V4
========================= */

const STORAGE_VERSION = "4.0.0";

const STATE_KEY =
  "TEMERIA_FORGE_STATE_V4";

let autosaveEnabled = true;

/* =========================
   SAFE JSON
========================= */

function safeJSON(raw, fallback = null){

  try{
    return JSON.parse(raw);
  }catch(e){
    console.warn(
      "[TEMERIA STORAGE] JSON ERROR",
      e
    );
    return fallback;
  }

}

/* =========================
   GET FORGE STATE
========================= */

function getForgeState(){

  if(
    !window.TemeriaForge ||
    !TemeriaForge.state
  ){
    return null;
  }

  return structuredClone(
    TemeriaForge.state
  );

}

/* =========================
   APPLY FORGE STATE
========================= */

function applyForgeState(newState){

  if(
    !window.TemeriaForge
  ) return false;

  if(
    !newState ||
    typeof newState !== "object"
  ){
    return false;
  }

  TemeriaForge.state = {

    ...TemeriaForge.state,
    ...newState

  };

  /* refresh renderer */
  if(typeof genera === "function"){
    genera();
  }

  return true;

}

/* =========================
   SAVE CURRENT
========================= */

function saveCurrentState(){

  if(!autosaveEnabled)
    return;

  const state =
    getForgeState();

  if(!state)
    return;

  const payload = {

    version:
      STORAGE_VERSION,

    updatedAt:
      new Date().toISOString(),

    state

  };

  localStorage.setItem(
    STATE_KEY,
    JSON.stringify(payload)
  );

  console.log(
    "[TEMERIA STORAGE] saved"
  );

}

/* =========================
   RESTORE
========================= */

function restoreState(){

  const raw =
    localStorage.getItem(
      STATE_KEY
    );

  if(!raw)
    return false;

  const payload =
    safeJSON(raw);

  if(
    !payload ||
    !payload.state
  ){
    return false;
  }

  console.log(
    "[TEMERIA STORAGE] restore"
  );

  return applyForgeState(
    payload.state
  );

}

/* =========================
   AUTOSAVE
========================= */

let autosaveTimer = null;

function autosaveNow(){

  clearTimeout(
    autosaveTimer
  );

  autosaveTimer =
    setTimeout(()=>{

      saveCurrentState();

    }, 500);

}

/* =========================
   HARD RESET
========================= */

function hardResetForge(){

  localStorage.removeItem(
    STATE_KEY
  );

  console.warn(
    "[TEMERIA STORAGE] reset"
  );

}

/* =========================
   INIT
========================= */

window.addEventListener(
  "load",
  ()=>{

    restoreState();

    if(window.TemeriaForge){

      document.addEventListener(
        "input",
        autosaveNow
      );

      document.addEventListener(
        "change",
        autosaveNow
      );

    }

    if(typeof genera === "function"){
      genera();
    }

    console.log(
      "[TEMERIA STORAGE] V4 READY"
    );

  }
);
