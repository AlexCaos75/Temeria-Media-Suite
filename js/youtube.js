/* =========================
   YOUTUBE HUB
========================= */

function extractYouTubeId(input) {
  const s = String(input || "").trim();
  if (!s) return "";

  const patterns = [
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    /[?&]v=([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/
  ];

  for (const p of patterns) {
    const m = s.match(p);
    if (m) return m[1];
  }

  const fallback = s.match(/([a-zA-Z0-9_-]{11})/);
  return fallback ? fallback[1] : "";
}

function getYTPasteId() {
  return extractYouTubeId(document.getElementById("ytPaste")?.value || "");
}

function pasteToAuto() {
  const id = getYTPasteId();

  if (!id) {
    alert("Link YouTube non valido.");
    return;
  }

  document.getElementById("ytid_auto").value = id;
  updateYoutubeThumb();
  genera();
}

function pasteToButtons() {
  const id = getYTPasteId();

  if (!id) {
    alert("Link YouTube non valido.");
    return;
  }

  document.getElementById("ytid_btn").value = id;
  updateYoutubeThumb();
  genera();
}

function applyYTPresetToAuto() {
  const preset = document.getElementById("ytPreset")?.value || "";
  if (!preset) return;

  document.getElementById("ytid_auto").value = preset;
  updateYoutubeThumb();
  genera();
}

function applyYTPresetToButtons() {
  const preset = document.getElementById("ytPreset")?.value || "";
  if (!preset) return;

  document.getElementById("ytid_btn").value = preset;
  updateYoutubeThumb();
  genera();
}

function copyCurrentIDs() {
  const autoID = document.getElementById("ytid_auto")?.value || "";
  const btnID = document.getElementById("ytid_btn")?.value || "";

  safeCopyText(`AUTO: ${autoID}
BUTTON: ${btnID}`);

  alert("ID copiati.");
}

function copyEmbedCode() {
  const ytid =
    document.getElementById("ytid_auto")?.value ||
    document.getElementById("ytid_btn")?.value ||
    "";

  if (!ytid) {
    alert("Nessun ID YouTube.");
    return;
  }

  const embed = `<iframe
width="560"
height="315"
src="https://www.youtube.com/embed/${ytid}"
frameborder="0"
allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
allowfullscreen>
</iframe>`;

  safeCopyText(embed);
  alert("Embed copiato.");
}

function openYouTube() {
  const id =
    document.getElementById("ytid_auto")?.value ||
    document.getElementById("ytid_btn")?.value ||
    "";

  if (!id) {
    alert("Nessun ID YouTube.");
    return;
  }

  window.open(`https://www.youtube.com/watch?v=${id}`, "_blank");
}

function updateYoutubeThumb() {
  const container = document.getElementById("ytThumbContainer");
  const note = document.getElementById("ytThumbNote");

  if (!container) return;

  const autoID = document.getElementById("ytid_auto")?.value || "";
  const btnID = document.getElementById("ytid_btn")?.value || "";
  const pasteID = getYTPasteId();

  const id = pasteID || autoID || btnID;

  if (!id) {
    container.innerHTML = "";
    if (note) note.textContent = "Nessun ID selezionato.";
    return;
  }

  const thumb = `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
  const url = `https://www.youtube.com/watch?v=${id}`;

  container.innerHTML = `
<a href="${url}" target="_blank" style="display:block;text-decoration:none;">
  <img
    src="${thumb}"
    alt="YouTube thumbnail"
    style="
      width:100%;
      max-width:420px;
      border-radius:18px;
      margin-top:10px;
      box-shadow:0 0 30px rgba(255,0,0,.22);
      display:block;
    "
  >
</a>
`;

  if (note) note.textContent = "ID attivo: " + id;
}

/* =========================
   INIT YOUTUBE HUB
========================= */

window.addEventListener("load", () => {
  ["ytPaste", "ytid_auto", "ytid_btn", "ytPreset"].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;

    el.addEventListener("input", updateYoutubeThumb);
    el.addEventListener("change", updateYoutubeThumb);
  });

  updateYoutubeThumb();
});
