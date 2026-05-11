/* =========================
   STORAGE
========================= */

const APP_VERSION = "2.0.0";

const STATE_KEY_V2 = "TEMERIA_FORGE_STATE";

function safeJSONParse(raw, fallback){

  try{
    return JSON.parse(raw);
  }catch(e){
    return fallback;
  }
}

function saveStateV2(state){

  localStorage.setItem(
    STATE_KEY_V2,
    JSON.stringify(state)
  );
}

function loadStateV2(){

  const raw =
    localStorage.getItem(STATE_KEY_V2);

  if(!raw) return null;

  return safeJSONParse(raw, null);
}