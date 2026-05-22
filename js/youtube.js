/* =========================
   YOUTUBE HUB
========================= */

function extractYouTubeId(input) {

  const s =
    String(input || "")
      .trim();

  if (!s)
    return "";

  const patterns = [

    /youtu\.be\/([a-zA-Z0-9_-]{11})/,

    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,

    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,

    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,

    /[?&]v=([a-zA-Z0-9_-]{11})/,

    /^([a-zA-Z0-9_-]{11})$/

  ];

  for (const p of patterns) {

    const m =
      s.match(p);

    if (m)
      return m[1];

  }

  const fallback =
    s.match(
      /([a-zA-Z0-9_-]{11})/
    );

  return fallback
    ? fallback[1]
    : "";

}

/* =========================
   GET PASTE ID
========================= */

function getYTPasteId() {

  const paste =
    document.getElementById(
      "ytPaste"
    );

  return extractYouTubeId(
    paste?.value || ""
  );

}

/* =========================
   SAFE GENERATE
========================= */

function safeGenerate(){

  if(typeof genera === "function"){

    clearTimeout(
      window.__ytGenerateTimer
    );

    window.__ytGenerateTimer =
      setTimeout(()=>{

        requestAnimationFrame(()=>{

          genera();

        });

      }, 600);

  }

}

/* =========================
   PASTE TO AUTO
========================= */

function pasteToAuto() {

  const id =
    getYTPasteId();

  if (!id) {

    alert(
      "Link YouTube non valido."
    );

    return;

  }

  const auto =
    document.getElementById(
      "ytid_auto"
    );

  if (auto) {

    auto.value = id;

  }

  updateYoutubeThumb();

  safeGenerate();

}

/* =========================
   PASTE TO BUTTONS
========================= */

function pasteToButtons() {

  const id =
    getYTPasteId();

  if (!id) {

    alert(
      "Link YouTube non valido."
    );

    return;

  }

  const btn =
    document.getElementById(
      "ytid_btn"
    );

  if (btn) {

    btn.value = id;

  }

  updateYoutubeThumb();

  safeGenerate();

}

/* =========================
   PRESET TO AUTO
========================= */

function applyYTPresetToAuto() {

  const preset =
    document.getElementById(
      "ytPreset"
    )?.value || "";

  if (!preset)
    return;

  const auto =
    document.getElementById(
      "ytid_auto"
    );

  if (auto) {

    auto.value = preset;

  }

  updateYoutubeThumb();

  safeGenerate();

}

/* =========================
   PRESET TO BUTTONS
========================= */

function applyYTPresetToButtons() {

  const preset =
    document.getElementById(
      "ytPreset"
    )?.value || "";

  if (!preset)
    return;

  const btn =
    document.getElementById(
      "ytid_btn"
    );

  if (btn) {

    btn.value = preset;

  }

  updateYoutubeThumb();

  safeGenerate();

}

/* =========================
   COPY IDS
========================= */

function copyCurrentIDs() {

  const autoID =

    document.getElementById(
      "ytid_auto"
    )?.value || "";

  const btnID =

    document.getElementById(
      "ytid_btn"
    )?.value || "";

  const text =

`AUTO: ${autoID}
BUTTON: ${btnID}`;

  if (
    typeof safeCopyText ===
    "function"
  ) {

    safeCopyText(text);

  } else {

    navigator.clipboard.writeText(
      text
    );

  }

  alert(
    "ID copiati."
  );

}

/* =========================
   COPY EMBED CODE
========================= */

function copyEmbedCode() {

  const ytid =

    document.getElementById(
      "ytid_auto"
    )?.value

    ||

    document.getElementById(
      "ytid_btn"
    )?.value

    ||

    "";

  if (!ytid) {

    alert(
      "Nessun ID YouTube."
    );

    return;

  }

  const embed = `
<iframe
width="560"
height="315"
src="https://www.youtube.com/embed/${ytid}"
frameborder="0"
allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
allowfullscreen>
</iframe>
`;

  if (
    typeof safeCopyText ===
    "function"
  ) {

    safeCopyText(embed);

  } else {

    navigator.clipboard.writeText(
      embed
    );

  }

  alert(
    "Embed copiato."
  );

}

/* =========================
   OPEN YOUTUBE
========================= */

function openYouTube() {

  const id =
    document.getElementById("ytid_auto")?.value
    ||
    document.getElementById("ytid_btn")?.value
    ||
    "";

  if (!id) {
    alert("Nessun ID YouTube.");
    return;
  }

  window.open(
    `https://www.youtube.com/watch?v=${id}`,
    "_blank"
  );

}

/* =========================
   UPDATE THUMB
========================= */

function updateYoutubeThumb() {

  const container =

    document.getElementById(
      "ytThumbContainer"
    );

  const note =

    document.getElementById(
      "ytThumbNote"
    );

  if (!container)
    return;

  const autoID =

    document.getElementById(
      "ytid_auto"
    )?.value || "";

  const btnID =

    document.getElementById(
      "ytid_btn"
    )?.value || "";

  const pasteID =
    getYTPasteId();

  const id =

    pasteID
    || autoID
    || btnID;

  if (!id) {

    container.innerHTML = "";

    if (note) {

      note.textContent =
        "Nessun ID selezionato.";

    }

    return;

  }

  const thumb =

    `https://img.youtube.com/vi/${id}/hqdefault.jpg`;

  const url =

    `https://www.youtube.com/watch?v=${id}`;

  container.innerHTML = `
<a
href="${url}"
target="_blank"
style="
display:block;
text-decoration:none;
"
>

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
/>

</a>
`;

  if (note) {

    note.textContent =
      "ID attivo: " + id;

  }

}

/* =========================
   CLEAR YOUTUBE FIELDS
========================= */

function clearYoutubeFields() {

  const ids = [

    "ytPaste",
    "ytid_auto",
    "ytid_btn"

  ];

  ids.forEach(id => {

    const el =
      document.getElementById(id);

    if (el) {

      el.value = "";

    }

  });

  updateYoutubeThumb();

  safeGenerate();

}

/* =========================
   QUICK TEST
========================= */

function quickPreviewYouTube() {

  const id =

    document.getElementById(
      "ytid_auto"
    )?.value

    ||

    document.getElementById(
      "ytid_btn"
    )?.value

    ||

    "";

  if (!id) {

    alert(
      "Inserisci un ID YouTube."
    );

    return;

  }

  const url =
    `https://www.youtube.com/embed/${id}?autoplay=1`;

  window.open(
    url,
    "_blank"
  );

}

/* =========================
   INIT YOUTUBE HUB
========================= */

window.addEventListener(
  "load",
  () => {

    const fields = [

      "ytPaste",
      "ytid_auto",
      "ytid_btn",
      "ytPreset"

    ];

    fields.forEach(id => {

      const el =
        document.getElementById(id);

      if (!el)
        return;

      el.addEventListener(
        "input",
        updateYoutubeThumb
      );

      el.addEventListener(
        "change",
        updateYoutubeThumb
      );

    });

    updateYoutubeThumb();

  }
);
