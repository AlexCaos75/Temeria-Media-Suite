/* =========================================================
   TEMERIA MEDIA FORGE V4 - APP INIT
========================================================= */

(function(){
  "use strict";

  let autoGenerateEnabled = true;

  function debounce(fn, delay = 300){
    let timer;
    return function(...args){
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this,args), delay);
    };
  }

  function updateAutoKPI(){
    const kpi = document.getElementById("kpiAuto");
    if(kpi) kpi.textContent = autoGenerateEnabled ? "Auto-genera: ON" : "Auto-genera: OFF";
  }

  function setAutoGenerate(enabled){
    autoGenerateEnabled = !!enabled;
    updateAutoKPI();
    if(autoGenerateEnabled && typeof window.genera === "function") window.genera();
  }

  function toggleAutoGenerate(){
    setAutoGenerate(!autoGenerateEnabled);
  }

  const autoG = debounce(() => {

  if(!autoGenerateEnabled)
    return;

  if(typeof window.genera === "function") {

    requestAnimationFrame(() => {

      window.genera();

    });

  }

}, 700);

  function bindAutoGenerate(){
    document.querySelectorAll("input, textarea, select").forEach(el => {
      el.addEventListener("input", autoG);
      el.addEventListener("change", autoG);
    });
  }

  function init(){
    bindAutoGenerate();
    updateAutoKPI();
    if(window.TemeriaForge?.renderHistoryList) window.TemeriaForge.renderHistoryList();
    if(typeof window.genera === "function") window.genera();
  }

  window.toggleAutoGenerate = toggleAutoGenerate;
  window.setAutoGenerate = setAutoGenerate;

  window.addEventListener("load", init);
})();
