/* =========================
   OG META BUILDER
========================= */

function buildOGMeta({
  title,
  description,
  image,
  url
}) {

  return `
<meta property="og:title" content="${escapeHTML(title)}">
<meta property="og:description" content="${escapeHTML(description)}">
<meta property="og:type" content="website">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${image}">
`;

}

/* =========================
   EXPORT PUBLIC CARD
========================= */

function exportPublicCard() {

  const cardHTML =
    buildCardHTML();

  const rawTitle =
    getVal("titolo").trim()
    || "temeria-card";

  const fileName =
    rawTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      || "temeria-card";

  const finalHTML = `
<!DOCTYPE html>
<html lang="it">

<head>

<meta charset="UTF-8">

<meta
name="viewport"
content="width=device-width, initial-scale=1.0"
>

<title>
${escapeHTML(rawTitle)}
</title>

${buildOGMeta({
  title: rawTitle,
  description: "Card creata con Temeria Media Forge",
  image: `${getPublicBaseURL()}assets/og/temeria-og.jpg`,
  url: getPublicCardURL()
})}

<link
href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;800&display=swap"
rel="stylesheet"
>

<style>

body{
  margin:0;
  padding:30px;
  background:#070a12;
  font-family:Orbitron,sans-serif;
}

button,
a{
  font-family:Orbitron,sans-serif;
}

</style>

</head>

<body>

${cardHTML}

</body>
</html>
`;

  downloadTextFile(
    `${fileName}.html`,
    finalHTML,
    "text/html"
  );

}

/* =========================
   DOWNLOAD GENERATOR
========================= */

function downloadGeneratorHTML() {

  const html =
    document.documentElement.outerHTML;

  downloadTextFile(
    "temeria-media-forge-generator.html",
    html,
    "text/html"
  );

}

/* =========================
   DOWNLOAD TEXT FILE
========================= */

function downloadTextFile(
  filename,
  content,
  type = "text/plain"
) {

  const blob =
    new Blob(
      [content],
      { type }
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
   COPY GENERATED CODE
========================= */

function copiaCodice() {

  const codeBox =
    document.getElementById("codeBox");

  if (!codeBox)
    return;

  safeCopyText(
    codeBox.textContent || ""
  );

}

/* =========================
   SAVE CARD
========================= */

function salvaCard() {

  exportPublicCard();

}

/* =========================
   SAVE GENERATOR
========================= */

function salvaGenerator() {

  downloadGeneratorHTML();

}
