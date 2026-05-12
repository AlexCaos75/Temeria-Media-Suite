/* =========================
   YOUTUBE
========================= */

function extractYouTubeId(input){

  const s = String(input || "").trim();

  if(!s) return "";

  const m =
    s.match(/([a-zA-Z0-9_-]{11})/);

  if(m) return m[1];

  return "";
}

function openYouTube(){

  const id =
    document.getElementById("ytid_auto").value;

  if(!id) return;

  window.open(
    `https://www.youtube.com/watch?v=${id}`,
    "_blank"
  );
}
function applyYTPresetToAuto(){

  const preset =
  document.getElementById(
    "ytPreset"
  ).value;

  if(!preset) return;

  document.getElementById(
    "ytid_auto"
  ).value = preset;

  genera();

}
function applyYTPresetToButtons(){

  const preset =
  document.getElementById(
    "ytPreset"
  ).value;

  if(!preset) return;

  document.getElementById(
    "ytid_btn"
  ).value = preset;

  genera();

}
function copyCurrentIDs(){

  const autoID =
  document.getElementById(
    "ytid_auto"
  ).value;

  const btnID =
  document.getElementById(
    "ytid_btn"
  ).value;

  navigator.clipboard.writeText(

    `AUTO: ${autoID}
BUTTON: ${btnID}`

  );

}