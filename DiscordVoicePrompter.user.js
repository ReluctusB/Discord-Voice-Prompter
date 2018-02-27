// ==UserScript==
// @name         Discord Voice Prompter
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a prompt when trying to enter a voice channel
// @author       RB
// @match        https://discordapp.com/*
// @grant        none
// @run-at       document-start
// @updateURL    https://raw.githubusercontent.com/ReluctusB/Discord-Voice-Prompter/master/DiscordVoicePrompter.user.js
// @downloadURL  https://raw.githubusercontent.com/ReluctusB/Discord-Voice-Prompter/master/DiscordVoicePrompter.user.js
// ==/UserScript==

function askNicely(chat) {
    if(window.confirm("Join voice chat?")) {
        chat.click();
    }
}

function addObscurity() {
        var chatlist = document.getElementsByClassName("wrapperDefaultVoice-2ud9mj");
        for (var i = 0; i < chatlist.length; i++) {
            chatlist[i].classList.add("voice");
            var cover = document.createElement("DIV");
            cover.style.height = "34px";
            cover.style.width = "100%";
            cover.style.zIndex = 5000;
            cover.style.position="absolute";
            cover.id = i.toString();
            cover.addEventListener("click",function(){askNicely(this.nextElementSibling);});
            chatlist[i].parentElement.insertBefore(cover, chatlist[i]);
        }
}

window.addEventListener("load", function a() {
    if (document.getElementsByTagName('textarea')[0]){
        addObscurity();
    }else{
        setTimeout(a,1000);}
});
window.addEventListener("click", addObscurity, false);
