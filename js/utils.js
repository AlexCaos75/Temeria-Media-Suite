/* =========================
   Utils
========================= */

function escapeHTML(txt){
  return (txt ?? "")
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;")
    .replace(/'/g,"&#39;");
}

function nl2brSafe(txt){
  return escapeHTML(txt).replace(/\n/g,"<br>");
}

function readFileAsDataURL(file){
  return new Promise((resolve,reject)=>{
    const r = new FileReader();

    r.onload = ()=> resolve(String(r.result || ""));
    r.onerror = ()=> reject(new Error("Errore lettura file"));

    r.readAsDataURL(file);
  });
}

function debounce(fn, wait=180){
  let t=null;

  return (...args)=>{
    clearTimeout(t);

    t=setTimeout(()=>fn(...args), wait);
  };
}

function safeURL(url){

  const u = String(url || "").trim();

  if(!u) return "";

  if(/^https?:\/\//i.test(u)){
    return u;
  }

  return "";
}
