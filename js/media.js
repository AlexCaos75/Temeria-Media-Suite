/* =========================================================
   TEMERIA MEDIA FORGE V5 - MEDIA ENGINE
========================================================= */

(function(){
  "use strict";

  function E(){ return window.TemeriaForge; }
  function esc(v){ return E().escapeAttr(v); }

  function showByOutput(state, type){
    const mode = state.style.outputMode;

    if(mode === "minimal") return false;
    if(type === "image" && mode === "music_focus") return false;
    if(type === "video" && ["music_focus","image_focus"].includes(mode)) return false;
    if(type === "audio" && ["image_focus","video_focus"].includes(mode)) return false;

    return true;
  }

  function getVideoSrc(state){
    return (
      state.media.videoUrlPublic ||
      state.media.videoPublic ||
      state.media.videoUrl ||
      ""
    );
  }

  function buildMainImage(state){
    const src =
      state.media.mainImagePublic ||
      state.media.mainImage ||
      state.media.mainImageRaw ||
      "";

    if(!src || !showByOutput(state,"image")) return "";

    const img = `
<img src="${esc(src)}" alt="" loading="eager" fetchpriority="high" decoding="async" style="
width:100%;height:auto;border-radius:22px;margin-top:25px;display:block;object-fit:contain;
box-shadow:0 0 35px rgba(0,0,0,.35),0 0 35px ${esc(state.theme.accent3)}55;
">`;

    return state.media.mainImageLink
      ? `<a href="${esc(state.media.mainImageLink)}" target="_blank" rel="noopener noreferrer">${img}</a>`
      : img;
  }

  function buildLogo(state){
    const src = state.media.logo;
    if(!src) return "";

    const img = `
<img src="${esc(src)}" alt="" loading="eager" fetchpriority="high" decoding="async" style="
width:90px;height:90px;object-fit:cover;border-radius:50%;
border:2px solid ${esc(state.theme.accent)};
box-shadow:0 0 25px ${esc(state.theme.accent)};
">`;

    const body = state.media.logoLink
      ? `<a href="${esc(state.media.logoLink)}" target="_blank" rel="noopener noreferrer">${img}</a>`
      : img;

    return `<div style="margin-top:20px;display:flex;justify-content:center;">${body}</div>`;
  }

  function buildVideo(state){
    const videoSrc = getVideoSrc(state);

    if(!videoSrc || !showByOutput(state,"video")){
      return "";
    }

    const mode = state.media.videoMode || "visible_controls";

    if(mode === "visible_controls"){
      return `
<video src="${esc(videoSrc)}" controls playsinline preload="metadata" style="
width:100%;margin-top:25px;border-radius:22px;display:block;
box-shadow:0 0 30px rgba(0,0,0,.35);
"></video>`;
    }

    if(mode === "visible_temeria"){
      const id = "temeriaVideo_" + Math.random().toString(36).slice(2,9);

      return `
<div style="margin-top:25px;text-align:center;">
  <video id="${id}" src="${esc(videoSrc)}" playsinline preload="metadata" loop style="
    width:100%;border-radius:22px;display:block;box-shadow:0 0 30px rgba(0,0,0,.35);
  "></video>

  <div style="display:flex;gap:14px;justify-content:center;flex-wrap:wrap;margin-top:18px;">
    <button type="button" onclick="TemeriaPublicPlayer.video('${id}','play')" style="padding:15px 28px;border:none;cursor:pointer;border-radius:999px;background:linear-gradient(90deg,#00f6ff,#6cff9f);color:#020617;font-weight:800;font-size:17px;">▶ PLAY</button>
    <button type="button" onclick="TemeriaPublicPlayer.video('${id}','stop')" style="padding:15px 28px;border:none;cursor:pointer;border-radius:999px;background:linear-gradient(90deg,#ff0033,#ff6b6b);color:white;font-weight:800;font-size:17px;">⏹ STOP</button>
  </div>
</div>`;
    }

    if(mode === "hidden_autoplay"){
      const id = "temeriaHidden_" + Math.random().toString(36).slice(2,9);

      return `
<video id="${id}" class="temeria-hidden-autoplay" src="${esc(videoSrc)}" autoplay muted loop playsinline preload="auto" style="
position:absolute;width:1px;height:1px;opacity:0;pointer-events:none;left:-9999px;top:-9999px;
"></video>

<button type="button" onclick="TemeriaPublicPlayer.enableHiddenAudio('${id}', this)" style="
margin-top:20px;padding:14px 28px;border:none;border-radius:999px;cursor:pointer;
background:linear-gradient(90deg,#00f6ff,#b06cff);color:white;font-size:17px;font-weight:bold;
box-shadow:0 0 25px rgba(176,108,255,.35);
">🔊 Attiva musica</button>`;
    }

    if(mode === "hidden_autoplay_audio"){
      const id = "temeriaHiddenAudio_" + Math.random().toString(36).slice(2,9);

      return `
<video id="${id}" class="temeria-hidden-autoplay-audio" autoplay loop playsinline preload="auto" style="
position:absolute;width:1px;height:1px;opacity:0;pointer-events:none;left:-9999px;top:-9999px;
">
  <source src="${esc(videoSrc)}" type="video/mp4">
</video>`;
    }

    return "";
  }

  function buildYoutubeURL(id, autoplay = false){
    return `https://www.youtube.com/embed/${id}?` +
      `enablejsapi=1&playsinline=1&loop=1&playlist=${id}` +
      `&controls=0&modestbranding=1&rel=0&iv_load_policy=3&disablekb=1&fs=0` +
      `&origin=${encodeURIComponent(location.origin)}` +
      (autoplay ? `&autoplay=1&mute=0` : ``);
  }

  function buildYoutubeHidden(id){
    if(!id) return "";
    const safe = encodeURIComponent(id);

    return `
<div style="position:absolute;width:1px;height:1px;opacity:0;pointer-events:none;left:-9999px;top:-9999px;overflow:hidden;">
  <iframe width="1" height="1" allow="autoplay; encrypted-media" referrerpolicy="strict-origin-when-cross-origin" frameborder="0" src="${buildYoutubeURL(safe,true)}"></iframe>
</div>`;
  }

  function buildYoutubeButtons(id){
    if(!id) return "";

    const safe = encodeURIComponent(id);
    const uid = "temeriaYT_" + Math.random().toString(36).slice(2,9);

    return `
<div class="temeria-audio-box" style="margin-top:25px;text-align:center;">
  <div id="${uid}_wrap" style="position:absolute;width:1px;height:1px;opacity:0;pointer-events:none;left:-9999px;top:-9999px;overflow:hidden;">
    <iframe id="${uid}" width="1" height="1" allow="autoplay; encrypted-media" referrerpolicy="strict-origin-when-cross-origin" frameborder="0" src="${buildYoutubeURL(safe,false)}"></iframe>
  </div>

  <div style="display:flex;gap:14px;justify-content:center;flex-wrap:wrap;">
    <button type="button" onclick="TemeriaPublicPlayer.yt('${uid}','playVideo')" style="padding:15px 28px;border:none;cursor:pointer;border-radius:999px;background:linear-gradient(90deg,#00f6ff,#6cff9f);color:#020617;font-weight:800;font-size:17px;">▶ PLAY</button>
    <button type="button" onclick="TemeriaPublicPlayer.yt('${uid}','pauseVideo')" style="padding:15px 28px;border:none;cursor:pointer;border-radius:999px;background:linear-gradient(90deg,#ff0033,#ff6b6b);color:white;font-weight:800;font-size:17px;">⏹ STOP</button>
  </div>
</div>`;
  }

  function buildMP3(state){
    if(!state.media.mp3Url) return "";

    const id = "temeriaMP3_" + Math.random().toString(36).slice(2,9);

    return `
<div class="temeria-audio-box" style="margin-top:25px;text-align:center;">
  <audio id="${id}" src="${esc(state.media.mp3Url)}" loop preload="metadata" style="display:none;"></audio>

  <div style="display:flex;gap:14px;justify-content:center;flex-wrap:wrap;">
    <button type="button" onclick="TemeriaPublicPlayer.mp3('${id}','play')" style="padding:15px 28px;border:none;cursor:pointer;border-radius:999px;background:linear-gradient(90deg,#00f6ff,#6cff9f);color:#020617;font-weight:800;font-size:17px;">▶ PLAY</button>
    <button type="button" onclick="TemeriaPublicPlayer.mp3('${id}','stop')" style="padding:15px 28px;border:none;cursor:pointer;border-radius:999px;background:linear-gradient(90deg,#ff0033,#ff6b6b);color:white;font-weight:800;font-size:17px;">⏹ STOP</button>
  </div>
</div>`;
  }

  function buildAudio(state){
    const videoSrc = getVideoSrc(state);

    if(videoSrc && !state.media.mp3Url){
      return "";
    }

    if(!showByOutput(state,"audio")) return "";
    if(state.media.audioMode === "none") return "";

    if(state.media.audioMode === "yt_auto"){
      return buildYoutubeHidden(state.media.youtubeAutoId || state.media.youtubeButtonId);
    }

    if(state.media.audioMode === "yt_buttons"){
      return buildYoutubeButtons(state.media.youtubeButtonId || state.media.youtubeAutoId);
    }

    if(state.media.audioMode === "mp3"){
      return buildMP3(state);
    }

    return "";
  }

  function publicPlayerScript(){
    return `
<script>
window.TemeriaPublicPlayer =
window.TemeriaPublicPlayer || {

  yt:function(id,action){
    var iframe = document.getElementById(id);
    if(!iframe || !iframe.contentWindow) return;

    iframe.contentWindow.postMessage(
      JSON.stringify({event:"command",func:action,args:[]}),
      "*"
    );
  },

  mp3:function(id,action){
    var audio = document.getElementById(id);
    if(!audio) return;

    if(action === "play"){
      audio.play().catch(function(){
        alert("Premi PLAY di nuovo: il browser ha bloccato l'audio.");
      });
    }

    if(action === "stop"){
      audio.pause();
      audio.currentTime = 0;
    }
  },

  video:function(id,action){
    var video = document.getElementById(id);
    if(!video) return;

    if(action === "play"){
      video.play().catch(function(){
        alert("Premi PLAY di nuovo: il browser ha bloccato il video.");
      });
    }

    if(action === "stop"){
      video.pause();
      video.currentTime = 0;
    }
  },

  enableHiddenAudio:function(id,btn){
    var video = document.getElementById(id);
    if(!video) return;

    video.muted = false;
    video.volume = 1;

    video.play()
    .then(function(){
      if(btn){
        btn.innerHTML = "🎵 Musica attiva";
        btn.style.opacity = ".75";
      }
    })
    .catch(function(){
      alert("Il browser richiede un secondo tocco per attivare l'audio.");
    });
  },

  copy:function(text){
    if(navigator.clipboard){
      navigator.clipboard.writeText(text);
    }
  }
};

setTimeout(function(){
  var safeVideos = document.querySelectorAll(".temeria-hidden-autoplay");

  safeVideos.forEach(function(v){
    v.muted = true;
    v.volume = 0;

    var p = v.play();

    if(p){
      p.catch(function(err){
        console.log("TEMERIA SAFE AUTOPLAY BLOCK", err);
      });
    }
  });
},800);
<\/script>`;
  }

  window.TemeriaPublicPlayer =
  window.TemeriaPublicPlayer || {
    yt:function(id,action){
      var iframe = document.getElementById(id);
      if(!iframe || !iframe.contentWindow) return;

      iframe.contentWindow.postMessage(
        JSON.stringify({event:"command",func:action,args:[]}),
        "*"
      );
    },

    mp3:function(id,action){
      var audio = document.getElementById(id);
      if(!audio) return;

      if(action === "play") audio.play().catch(function(){});
      if(action === "stop"){
        audio.pause();
        audio.currentTime = 0;
      }
    },

    video:function(id,action){
      var video = document.getElementById(id);
      if(!video) return;

      if(action === "play") video.play().catch(function(){});
      if(action === "stop"){
        video.pause();
        video.currentTime = 0;
      }
    },

    enableHiddenAudio:function(id,btn){
      var video = document.getElementById(id);
      if(!video) return;

      video.muted = false;
      video.volume = 1;

      video.play()
      .then(function(){
        if(btn){
          btn.innerHTML = "🎵 Musica attiva";
          btn.style.opacity = ".75";
        }
      })
      .catch(function(){});
    },

    copy:function(text){
      if(navigator.clipboard){
        navigator.clipboard.writeText(text);
      }
    }
  };

 setTimeout(function(){

  const safeVideos =
    document.querySelectorAll(".temeria-hidden-autoplay");

  safeVideos.forEach(function(v){

    v.muted = true;
    v.volume = 0;

    const p = v.play();

    if(p){
      p.catch(function(){});
    }

  });

  const audioVideos =
    document.querySelectorAll(".temeria-hidden-autoplay-audio");

  audioVideos.forEach(function(v){

    v.muted = false;
    v.volume = 1;

    const p = v.play();

    if(p){
      p.catch(function(err){
        console.log("TEMERIA AUDIO AUTOPLAY BLOCK", err);
      });
    }

  });
  
},1400);

  window.TemeriaMedia = {
    buildMainImage,
    buildLogo,
    buildVideo,
    buildAudio,
    publicPlayerScript
  };

})();
