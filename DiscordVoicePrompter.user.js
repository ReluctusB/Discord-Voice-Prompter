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

//initiates prompt, simulates a click event on chat is prompt is accepted.
function askNicely(chat) {
    if(window.confirm("Join voice chat?")) {
        chat.click();
    }
}

//covers voice chat channels with 'obscurers' that call askNicely when clicked.
function addObscurity() {
    var chatlist = document.getElementsByClassName("wrapperDefaultVoice-2ud9mj");
    console.log(chatlist);
    for (let i = 0; i < chatlist.length; i++) {
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

//sets up initial obscurers and adds click events to call addObscurers on guilds.
window.addEventListener("load", function(){setTimeout(function() {
    if (document.getElementsByClassName('guild')[0]){
        addObscurity();
        var guildlist = document.getElementsByClassName("guild");
        for (let i = 0; i < guildlist.length; i++) {
            guildlist[i].addEventListener("click", function(){setTimeout(function(){
                if (document.getElementsByClassName("wrapperDefaultVoice-2ud9mj")[0]){
                addObscurity();}
            },150);});
        }
    }
},1000);});


