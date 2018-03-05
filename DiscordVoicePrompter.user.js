// ==UserScript==
// @name         Discord Voice Prompter
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Adds a prompt when trying to enter a voice channel
// @author       RB
// @match        https://discordapp.com/*
// @grant        none
// @run-at       document-start
// @updateURL    https://raw.githubusercontent.com/ReluctusB/Discord-Voice-Prompter/master/DiscordVoicePrompter.user.js
// @downloadURL  https://raw.githubusercontent.com/ReluctusB/Discord-Voice-Prompter/master/DiscordVoicePrompter.user.js
// ==/UserScript==

//Creates a Discord-styled popup confirmation box.
function createPopupConfirm(title,text,obj,funct) {
    var frag = document.createDocumentFragment();
    var backdrop = document.createElement("DIV");
    backdrop.className = "backdrop-2ohBEd";
    backdrop.style.opacity = ".85";
    backdrop.style.backgroundColor = "rgb(0, 0, 0)";
    backdrop.style.transform = "translateZ(0px)";
    backdrop.addEventListener("click", clearPopup);
    frag.appendChild(backdrop);
    var popupDiv = document.createElement("DIV");
    popupDiv.className = "modal-2LIEKY";
    popupDiv.style.opacity = "1";
    popupDiv.style.transform = "scale(1) translateZ(0px)";
    frag.appendChild(popupDiv);
    var inner = document.createElement("DIV");
    inner.className = "inner-1_1f7b";
    popupDiv.appendChild(inner);
    var popup = document.createElement("DIV");
    popup.className = "modal-3HOjGZ sizeSmall-1sh0-r";
    popup.id="woop";
    inner.appendChild(popup);
    var headTitle = document.createElement("DIV");
    headTitle.className = "flex-lFgbSz flex-3B1Tl4 horizontal-2BEEBe horizontal-2VE-Fw flex-3B1Tl4 directionRow-yNbSvJ justifyStart-2yIZo0 alignCenter-3VxkQP noWrap-v6g9vO header-3sp3cE";
    headTitle.style.flex = "flex: 0 0 auto";
    popup.appendChild(headTitle);
    var headTitleTitle = document.createElement("H4");
    headTitleTitle.className = "h4-2IXpeI title-1pmpPr size16-3IvaX_ height20-165WbF weightSemiBold-T8sxWH defaultColor-v22dK1 defaultMarginh4-jAopYe marginReset-3hwONl";
    headTitleTitle.innerText = title;
    headTitle.appendChild(headTitleTitle);
    var mainText = document.createElement("DIV");
    mainText.className="message-3gHzqQ marginBottom20-2Ifj-2 medium-2KnC-N size16-3IvaX_ height20-165WbF primary-2giqSn";
    mainText.style.padding="20px";
    mainText.innerText=text;
    popup.appendChild(mainText);
    var footDiv = document.createElement("DIV");
    footDiv.className = "flex-lFgbSz flex-3B1Tl4 horizontalReverse-2LanvO horizontalReverse-k5PqxT flex-3B1Tl4 directionRowReverse-2eZTxP justifyStart-2yIZo0 alignStretch-1hwxMa noWrap-v6g9vO footer-1PYmcw";
    footDiv.style.flex = "flex: 0 0 auto";
    popup.appendChild(footDiv);
    var accept = document.createElement("Button");
    accept.className = "buttonSpacing-3R7DSg button-2t3of8 lookFilled-luDKDo colorBrand-3PmwCE sizeMedium-2VGNaF grow-25YQ8u";
    accept.innerText = "Let's go!";
    accept.addEventListener("click",function(){clearPopup();funct(obj);});
    footDiv.appendChild(accept);
    var deny = document.createElement("Button");
    deny.className = "buttonSpacing-3R7DSg button-2t3of8 lookGhost-GyT-k0 colorBrand-3PmwCE sizeMedium-2VGNaF grow-25YQ8u";
    deny.innerText = "No thanks";
    deny.addEventListener("click",clearPopup);
    footDiv.appendChild(deny);

    var appFront = document.getElementById('app-mount');
    appFront.lastChild.appendChild(frag);
}

//closes popup generated by createPopupConfirm
function clearPopup() {
    var appFront = document.getElementById('app-mount');
    appFront.lastChild.innerHTML="";
}

//Simulates a click event on chat.
function askNicely(chat) {
    chat.click();
}

//Covers voice chat channels with 'obscurers' that call create PopupConfirm when clicked.
function addObscurity() {
    var chatlist = document.querySelectorAll(".wrapperDefaultVoice-2ud9mj, .wrapperHoveredVoice-3tbfNN");
    for (let i = 0; i < chatlist.length; i++) {
        if (!chatlist[i].previousSibling){
            var cover = document.createElement("DIV");
            cover.style.height = "34px";
            cover.style.width = "100%";
            cover.style.zIndex = 100;
            cover.style.position="absolute";
            cover.style.cursor="pointer";
            cover.id = i.toString();
            cover.addEventListener("click",function(){createPopupConfirm("Now entering: "+this.nextElementSibling.getElementsByClassName("nameDefaultVoice-1swZoh")[0].innerText,"Do you want to enter this channel?",this.nextElementSibling,askNicely);});
            cover.addEventListener("mousedown", function(event){if(event.button===2){this.style.display="none";}});
            chatlist[i].addEventListener("mouseup",function(event){if(event.button===2){let obj=this; setTimeout(function(){obj.previousSibling.style.display="block";},1);}});
            chatlist[i].parentElement.insertBefore(cover, chatlist[i]);
        }
    }
}

//Puts click events to call addObscurity on everything else that needs it within a guild itself
function setUpGuild() {
    if (document.getElementsByClassName("wrapperDefaultVoice-2ud9mj")[0]||document.getElementsByClassName("wrapperHoveredVoice-3tbfNN")[0]){
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

window.addEventListener("load", function a() {
    if (document.getElementsByClassName('guild')[1]){
        setUpGuild();
        var guildlist = document.getElementsByClassName("guild");
        for (let i = 0; i < guildlist.length; i++) {
            guildlist[i].addEventListener("click", function(){setTimeout(function(){setUpGuild();},150);});
        }
    } else {
        setTimeout(a,1000);
    }
});
