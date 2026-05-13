
/* =========================
   GENERATOR
========================= */

let gifDataURL = "";

function buildCardHTML(){

  const titolo =
    escapeHTML(
      document.getElementById("titolo").value
    );

  const frase =
    nl2brSafe(
      document.getElementById("frase").value
    );

  const gif =
    document.getElementById("gifurl").value;

  const ytid =
    document.getElementById("ytid_auto").value;

  const video =
    document.getElementById("videourl").value;

  const socialMode =
document.getElementById(
  "socialExport"
)?.value || "normal";

console.log(
  "SOCIAL MODE:",
  socialMode
);

let mediaHTML = "";
/* =========================
   SOCIAL BUTTONS
========================= */

let socialButtons = "";

const currentURL =
 'https://alexcaos75.github.io/Temeria-Media-Suite/';

/* =========================
   YOUTUBE
========================= */

if(socialMode === "youtube"){

  socialButtons = `

<div style="
margin-top:25px;

display:flex;
gap:15px;
justify-content:center;
flex-wrap:wrap;
">

<a
href="https://youtube.com/watch?v=${ytid}"
target="_blank"
style="
padding:16px 28px;

border-radius:999px;

background:
linear-gradient(
90deg,
#ff0000,
#ff3b3b
);

color:white;
text-decoration:none;

font-weight:bold;
font-size:18px;

box-shadow:
0 0 25px rgba(255,0,0,.35);
"
>

▶ APRI YOUTUBE

</a>

<button
onclick="
navigator.clipboard.writeText(
'https://youtube.com/watch?v=${ytid}'
)
"
style="
padding:16px 28px;

border:none;
cursor:pointer;

border-radius:999px;

background:
linear-gradient(
90deg,
#111827,
#1f2937
);

color:white;

font-weight:bold;
font-size:18px;
"
>

📋 COPIA LINK

</button>

</div>

`;
}

/* =========================
   INSTAGRAM
========================= */

if(socialMode === "instagram"){

  socialButtons = `

<div style="
margin-top:25px;
text-align:center;
">

<button
onclick="
navigator.clipboard.writeText(
currentURL
)
"
style="
padding:16px 34px;

border:none;
cursor:pointer;

border-radius:999px;

background:
linear-gradient(
90deg,
#ff0080,
#ff5f6d,
#ffc371
);

color:white;

font-size:18px;
font-weight:bold;

box-shadow:
0 0 35px rgba(255,0,120,.35);
"
>

📸 COPIA LINK INSTAGRAM

</button>

</div>

`;
}

/* =========================
   TIKTOK
========================= */

if(socialMode === "tiktok"){

  socialButtons = `

<div style="
margin-top:25px;
text-align:center;
">

<button
onclick="
navigator.clipboard.writeText(
currentURL
)
"
style="
padding:16px 34px;

border:none;
cursor:pointer;

border-radius:999px;

background:
linear-gradient(
90deg,
#00f2ff,
#ff0050
);

color:white;

font-size:18px;
font-weight:bold;

box-shadow:
0 0 35px rgba(0,255,255,.28);
"
>

🎵 COPIA LINK TIKTOK

</button>

</div>

`;
}

/* =========================
   FACEBOOK
========================= */

if(socialMode === "facebook"){

  socialButtons = `

<div style="
margin-top:25px;
text-align:center;
">

<button
onclick="
navigator.clipboard.writeText(
currentURL
)
"
style="
padding:16px 34px;

border:none;
cursor:pointer;

border-radius:999px;

background:
linear-gradient(
90deg,
#1877f2,
#4e9cff
);

color:white;

font-size:18px;
font-weight:bold;

box-shadow:
0 0 35px rgba(24,119,242,.28);
"
>

📘 COPIA LINK FACEBOOK

</button>

</div>

`;
}

/* =========================
   WHATSAPP
========================= */

if(socialMode === "whatsapp"){

  socialButtons = `

<div style="
margin-top:25px;
text-align:center;
">

<a
href="https://wa.me/?text=https://alexcaos75.github.io/Temeria-Media-Suite/?card=temeria"

target="_blank"
style="
display:inline-block;

padding:16px 34px;

border-radius:999px;

background:
linear-gradient(
90deg,
#25d366,
#4bf58a
);

color:white;
text-decoration:none;

font-size:18px;
font-weight:bold;

box-shadow:
0 0 35px rgba(37,211,102,.28);
"
>

💬 CONDIVIDI WHATSAPP

</a>

</div>

`;

}

  /* =========================
     SOCIAL MODES
  ========================= */

  let cardWidth = "900px";
  let cardRadius = "26px";
  let cardPadding = "30px";
  let textAlign = "center";
  let extraStyle = "";

  if(socialMode === "whatsapp"){

    cardWidth = "650px";
    cardRadius = "22px";

    extraStyle = `
      border:
      1px solid rgba(37,211,102,.22);

      box-shadow:
      0 0 40px rgba(37,211,102,.12),
      0 0 80px rgba(37,211,102,.08);
    `;
  }

  if(socialMode === "facebook"){

    cardWidth = "760px";

    extraStyle = `
      border:
      1px solid rgba(24,119,242,.20);

      box-shadow:
      0 0 45px rgba(24,119,242,.14),
      0 0 90px rgba(24,119,242,.08);
    `;
  }

  if(socialMode === "instagram"){

    cardWidth = "430px";
    cardPadding = "25px";

    extraStyle = `
      min-height:760px;

      background:
      linear-gradient(
      180deg,
      #2b1055,
      #7597de
      );

      box-shadow:
      0 0 60px rgba(255,0,180,.18),
      0 0 120px rgba(180,0,255,.14);
    `;
  }

  if(socialMode === "youtube"){

    cardWidth = "980px";

    extraStyle = `
      border:
      1px solid rgba(255,0,0,.15);

      box-shadow:
      0 0 60px rgba(255,0,0,.18),
      0 0 140px rgba(255,0,0,.10);
    `;
  }

  if(socialMode === "tiktok"){

    cardWidth = "420px";

    extraStyle = `
      min-height:760px;

      background:
      linear-gradient(
      180deg,
      #000,
      #111827
      );

      border:
      1px solid rgba(0,255,255,.12);

      box-shadow:
      0 0 50px rgba(0,255,255,.12),
      0 0 90px rgba(255,0,120,.12);
    `;
  }

  /* =========================
     GIF
  ========================= */

  let gifHTML = "";

  if(gif){

    gifHTML = `
<img
src="${gif}"
style="
width:100%;
border-radius:22px;
margin-top:25px;
box-shadow:0 0 35px rgba(0,0,0,.35);
display:block;
object-fit:cover;
"
>
`;
  }

  /* =========================
     VIDEO
  ========================= */

  if(video){

    mediaHTML += `
<video
src="${video}"
controls
style="
width:100%;
margin-top:25px;
border-radius:22px;
box-shadow:0 0 30px rgba(0,0,0,.35);
display:block;
"
>
</video>
`;
  }

  /* =========================
     PLAYER AUTOPLAY INVISIBILE
  ========================= */

  if(ytid){

    mediaHTML += `

<div style="
position:fixed;
left:-9999px;
top:-9999px;
width:1px;
height:1px;
overflow:visible;
opacity:0;
pointer-events:none;
">

<iframe
width="1"
height="1"
allow="autoplay"
frameborder="0"
src="
https://www.youtube.com/embed/${ytid}?autoplay=1&mute=0&loop=1&playlist=${ytid}
">
</iframe>

</div>

`;
  }

  return `

<!-- WRAPPER -->

<div style="
position:relative;

max-width:1200px;

margin:auto;

padding-top:30px;
">

<!-- CARD -->

<div style="
position:relative;

padding:${cardPadding};

border-radius:${cardRadius};

background:
linear-gradient(
180deg,
#111827,
#0f172a
);

color:white;

max-width:${cardWidth};
width:92%;
margin:auto;
box-sizing:border-box;


text-align:${textAlign};

overflow:visible;

box-shadow:
0 0 40px rgba(0,0,0,.35);

${extraStyle}
">

<h1 style="
font-size:34px;
margin-bottom:20px;

font-family:
Orbitron,
sans-serif;

letter-spacing:2px;

text-shadow:
0 0 20px rgba(255,255,255,.15);
">
${titolo}
</h1>

<div style="
font-size:22px;
line-height:1.7;

max-width:700px;
margin:auto;

opacity:.96;
">
${frase}
</div>

${gifHTML}

${mediaHTML}


${socialButtons}


</div>

</div>

`;
}

function genera(){

  const card = buildCardHTML();

  document.getElementById(
    "previewHost"
  ).innerHTML = card;

  document.getElementById(
    "codeBox"
  ).textContent = card;

  /* =========================
     PREVIEW YOUTUBE HUB
  ========================= */

  const old =
    document.getElementById(
      "ytFloatingPreview"
    );

  if(old){
    old.remove();
  }

  const ytid =
    document.getElementById(
      "ytid_auto"
    ).value;

  if(!ytid) return;

  const preview =
    document.createElement("div");

  preview.id =
    "ytFloatingPreview";

preview.style.cssText = `
position:relative;

margin-left:auto;
margin-right:auto;

margin-top:-28px;

max-width:340px;
width:92%;



z-index:999999;

border-radius:32px;
overflow:visible;

background:
linear-gradient(
180deg,
rgba(15,15,18,.98),
rgba(0,0,0,.98)
);

border:1px solid rgba(255,255,255,.08);

box-shadow:
0 0 30px rgba(255,0,0,.18),
0 0 80px rgba(255,0,0,.12),
0 25px 60px rgba(0,0,0,.55),
inset 0 1px 0 rgba(255,255,255,.08);

backdrop-filter:blur(10px);

animation:ytPulse 4s infinite;

transition:.35s;
`;

preview.innerHTML = `

<div style="
position:relative;
width:100%;
aspect-ratio:16/9;
overflow:visible;
border-radius:28px;
background:#000;
">

<iframe
src="https://www.youtube.com/embed/${ytid}?autoplay=1&mute=1&controls=1&loop=1&playlist=${ytid}"
style="
width:100%;
height:100%;
border:none;

transform:scale(1.02);

filter:
contrast(1.05)
saturate(1.15)
brightness(.96);
"
allow="
accelerometer;
autoplay;
clipboard-write;
encrypted-media;
gyroscope;
picture-in-picture;
fullscreen
"
allowfullscreen>
</iframe>

<div style="
position:absolute;
inset:0;

pointer-events:none;

box-shadow:
inset 0 0 80px rgba(255,0,0,.18),
inset 0 0 120px rgba(255,0,0,.12);
">
</div>

</div>

<div style="
padding:18px;

text-align:center;

font-size:19px;
font-weight:700;

letter-spacing:4px;

color:white;

font-family:
Orbitron,
sans-serif;

background:
linear-gradient(
180deg,
rgba(22,22,25,.96),
rgba(0,0,0,.98)
);

border-top:
1px solid rgba(255,255,255,.06);

text-shadow:
0 0 12px rgba(255,255,255,.18);

box-shadow:
inset 0 1px 0 rgba(255,255,255,.05);
">

🎬 YOUTUBE LIVE PREVIEW

</div>

`;

document.querySelectorAll(".panel")[1]
.querySelector(".panelBody")
.appendChild(preview);
}

function exportPublicCard(){

const cardHTML = buildCardHTML();

const titolo =
document.getElementById("titolo")
.value
.trim()
.toLowerCase()
.replace(/[^a-z0-9]+/g,"-") || "temeria-card";

const finalHTML = `

<!DOCTYPE html>

<html lang="it">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${titolo}</title>

<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;800&display=swap" rel="stylesheet">

<style>
body{
  margin:0;
  padding:30px;
  background:#070a12;
  font-family:Orbitron,sans-serif;
}
</style>

</head>
<body>

${cardHTML}

</body>
</html>
`;

const blob = new Blob(
[finalHTML],
{type:"text/html"}
);

const a = document.createElement("a");

a.href = URL.createObjectURL(blob);

a.download = `${titolo}.html`;

document.body.appendChild(a);

a.click();

document.body.removeChild(a);

}
