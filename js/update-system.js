/* =========================
   UPDATE SYSTEM
========================= */

let _lastManifest = null;

/* =========================
   HELPERS
========================= */

function setUpdateStatus(text) {
  const el = document.getElementById("updateStatus");
  if (el) el.textContent = text;
}

function setUpdateInfo(html) {
  const el = document.getElementById("updateInfo");
  if (el) el.innerHTML = html;
}

/* =========================
   VERSION COMPARE
========================= */

function compareVersions(a, b) {
  const pa = String(a).split(".").map(Number);
  const pb = String(b).split(".").map(Number);

  for (let i = 0; i < 3; i++) {
    const na = pa[i] || 0;
    const nb = pb[i] || 0;

    if (na > nb) return 1;
    if (na < nb) return -1;
  }

  return 0;
}

/* =========================
   CHECK UPDATES
========================= */

async function checkForUpdates() {
  const url =
    document.getElementById("updateManifestUrl")?.value
      ?.trim();

  if (!url) {
    setUpdateStatus("Inserisci URL manifest.");
    return;
  }

  setUpdateStatus("Controllo aggiornamenti...");
  setUpdateInfo("");

  try {
    const res = await fetch(url + "?t=" + Date.now());

    if (!res.ok) {
      throw new Error("Manifest non raggiungibile");
    }

    const manifest = await res.json();

    _lastManifest = manifest;

    const latest =
      manifest.version || "0.0.0";

   const current =
  window.TemeriaForge?.VERSION ||
  "0.0.0";

    const cmp =
      compareVersions(latest, current);

    const btn =
      document.getElementById("btnOpenLatest");

    if (btn) {
      btn.disabled = !manifest.url;
    }

    if (cmp > 0) {
      setUpdateStatus(
        `Nuova versione disponibile: ${latest}`
      );

      setUpdateInfo(`
<div style="margin-top:8px;">
  <div><b>Versione attuale:</b> ${current}</div>
  <div><b>Nuova versione:</b> ${latest}</div>

  ${
    manifest.notes
      ? `<div style="margin-top:8px;"><b>Note:</b><br>${escapeHTML(manifest.notes)}</div>`
      : ""
  }
</div>
`);
    } else {
      setUpdateStatus(
        `Forge aggiornato (${current})`
      );

      setUpdateInfo(`
<div style="margin-top:8px;">
Nessun aggiornamento disponibile.
</div>
`);
    }

  } catch (err) {

    console.error(err);

    setUpdateStatus(
      "Errore controllo aggiornamenti."
    );

    setUpdateInfo(`
<div style="color:#ff8080;margin-top:8px;">
${escapeHTML(err.message)}
</div>
`);
  }
}

/* =========================
   OPEN LATEST
========================= */

function openLatestVersion() {
  if (!_lastManifest) return;

  if (!_lastManifest.url) {
    alert("Nessun URL disponibile.");
    return;
  }

  window.open(
    _lastManifest.url,
    "_blank"
  );
}
