// ==UserScript==
// @name         Discord Voice Prompter
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Adds a prompt when trying to enter a voice channel
// @author       RB
// @match        https://discordapp.com/*
// @grant        none
// @run-at       document-start
// @updateURL    https://raw.githubusercontent.com/ReluctusB/Discord-Voice-Prompter/master/DiscordVoicePrompter.user.js
// @downloadURL  https://raw.githubusercontent.com/ReluctusB/Discord-Voice-Prompter/master/DiscordVoicePrompter.user.js
// ==/UserScript==

//Initiates prompt, simulates a click event on chat is prompt is accepted.
function askNicely(chat) {
    if(window.confirm("Join voice chat?")) {
        chat.click();
    }
}

//Covers voice chat channels with 'obscurers' that call askNicely when clicked.
function addObscurity() {
    var chatlist = document.getElementsByClassName("wrapperDefaultVoice-2ud9mj");
    for (let i = 0; i < chatlist.length; i++) {
        var cover = document.createElement("DIV");
        cover.style.height = "34px";
        cover.style.width = "100%";
        cover.style.zIndex = 100;
        cover.style.position="absolute";
        cover.style.cursor="pointer";
        cover.id = i.toString();
        cover.addEventListener("click",function(){askNicely(this.nextElementSibling);});
        chatlist[i].parentElement.insertBefore(cover, chatlist[i]);
    }
}

//Puts click events to call addObscurity on everything else that needs it within a guild itself
function setUpGuild() {
    if (document.getElementsByClassName("wrapperDefaultVoice-2ud9mj")[0]){
        addObscurity();
    }
    //Handles category dropdowns
    if (document.getElementsByClassName("containerDefault-1bbItS")[0]){
        var categorylist = document.getElementsByClassName("containerDefault-1bbItS");
        for (let i = 0; i < categorylist.length; i++) {
            categorylist[i].addEventListener("click", function(){setTimeout(addObscurity,150);}, false);
        }
    }
    //Handles scrolling down a channel list
    document.getElementsByClassName("scroller-fzNley")[0].addEventListener("scroll", function(){setTimeout(addObscurity,150);}, false);
}

//Calls initial setUpGuild and adds click events to call setUpGuild on guilds.
window.addEventListener("load", function(){setTimeout(function() {
    if (document.getElementsByClassName('guild')[0]){
        setUpGuild();
        var guildlist = document.getElementsByClassName("guild");
        for (let i = 0; i < guildlist.length; i++) {
            guildlist[i].addEventListener("click", function(){setTimeout(function(){setUpGuild();},150);});
        }
    }
},1000);});


