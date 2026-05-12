/* =========================
   APP INIT
========================= */

let autoGenerateEnabled = true;

const autoG = debounce(()=>{

  if(!autoGenerateEnabled) return;

  genera();

}, 300);

(function initUltra(){

  genera();

})();