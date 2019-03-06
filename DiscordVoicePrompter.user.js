// ==UserScript==
// @name         Discord Voice Prompter
// @namespace    http://tampermonkey.net/
// @version      1.6.4
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
    backdrop.className = "backdrop-1wrmKB";
    backdrop.style.opacity = ".85";
    backdrop.style.backgroundColor = "rgb(0, 0, 0)";
    backdrop.style.transform = "translateZ(0px)";
    backdrop.addEventListener("click", clearPopup);
    frag.appendChild(backdrop);
    var popupDiv = document.createElement("DIV");
    popupDiv.className = "modal-1UGdnR";
    popupDiv.style.opacity = "1";
    popupDiv.style.transform = "scale(1) translateZ(0px)";
    frag.appendChild(popupDiv);
    var inner = document.createElement("DIV");
    inner.className = "inner-1JeGVc";
    popupDiv.appendChild(inner);
    var popup = document.createElement("DIV");
    popup.className = "modal-3HD5ck sizeSmall-Sf4iOi";
    inner.appendChild(popup);
    var headTitle = document.createElement("DIV");
    headTitle.className = "flex-1xMQg5 flex-1O1GKY horizontal-1ae9ci horizontal-2EEEnY flex-1O1GKY directionRow-3v3tfG justifyStart-2NDFzi alignCenter-1dQNNs noWrap-3jynv6 header-1R_AjF";
    headTitle.style.flex = "flex: 0 0 auto";
    popup.appendChild(headTitle);
    var headTitleTitle = document.createElement("H4");
    headTitleTitle.className = "h4-AQvcAz title-3sZWYQ size16-14cGz5 height20-mO2eIN weightSemiBold-NJexzi defaultColor-1_ajX0 defaultMarginh4-2vWMG5 marginReset-236NPn";
    headTitleTitle.innerText = title;
    headTitle.appendChild(headTitleTitle);
    var mainText = document.createElement("DIV");
    mainText.className="titleDefault-a8-ZSr title-31JmR4 marginReset-236NPn weightMedium-2iZe9B size16-14cGz5 height24-3XzeJx flexChild-faoVW3";
    mainText.style.padding="20px";
    mainText.innerText=text;
    popup.appendChild(mainText);
    var footDiv = document.createElement("DIV");
    footDiv.className = "flex-1xMQg5 flex-1O1GKY horizontalReverse-2eTKWD horizontalReverse-3tRjY7 flex-1O1GKY directionRowReverse-m8IjIq justifyStart-2NDFzi alignStretch-DpGPf3 noWrap-3jynv6 footer-2yfCgX";
    footDiv.style.flex = "flex: 0 0 auto";
    popup.appendChild(footDiv);
    var accept = document.createElement("Button");
    accept.className = "button-38aScr lookFilled-1Gx00P colorBrand-3pXr91 sizeMedium-1AC_Sl grow-q77ONN";
    accept.innerText = "Let's go!";
    accept.addEventListener("click",function(){clearPopup();funct(obj);});
    footDiv.appendChild(accept);
    var deny = document.createElement("Button");
    deny.className = "button-38aScr lookLink-9FtZy- colorGrey-2DXtkV sizeMedium-1AC_Sl grow-q77ONN";
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
    var chatlist = document.querySelectorAll(".wrapperDefaultVoice-1yvceo, .wrapperHoveredVoice-3ItgyI");
    for (let i = 0; i < chatlist.length; i++) {
        if (!chatlist[i].previousSibling){
            var cover = document.createElement("DIV");
            cover.style.height = "34px";
            cover.style.width = "100%";
            cover.style.zIndex = 100;
            cover.style.position="absolute";
            cover.style.cursor="pointer";
            cover.id = i.toString();
            cover.addEventListener("click",function(){createPopupConfirm("Now entering: "+this.nextElementSibling.getElementsByClassName("nameDefaultVoice-3WUH7s")[0].innerText,"Do you want to enter this channel?",this.nextElementSibling,askNicely);});
            cover.addEventListener("mousedown", function(event){if(event.button===2){this.style.display="none";}});
            chatlist[i].addEventListener("mouseup",function(event){if(event.button===2){let obj=this; setTimeout(function(){obj.previousSibling.style.display="block";},1);}});
            chatlist[i].parentElement.insertBefore(cover, chatlist[i]);
        }
    }
}

//Sets event listener on channel containers.
function setUpContainers() {
    var categorylist = document.getElementsByClassName("containerDefault-3GGEv_");
    for (let i = 0; i < categorylist.length; i++) {
        categorylist[i].addEventListener("click", function(){setTimeout(addObscurity,150);}, false);
    }
}

//Puts click events to call addObscurity on everything else that needs it within a guild itself
function setUpGuild() {
    if (document.getElementsByClassName("wrapperDefaultVoice-1yvceo")[0]||document.getElementsByClassName("wrapperHoveredVoice-3ItgyI")[0]){
        addObscurity();
    }
    //Handles category dropdowns
    if (document.getElementsByClassName("containerDefault-3GGEv_")[0]){
        setUpContainers();
    }
    //Handles scrolling down a channel list
    var timer = null;
    document.getElementsByClassName("scroller-2FKFPG")[1].addEventListener("scroll", function(){
         if(timer !== null) {clearTimeout(timer);}
         timer = setTimeout(function() {
             setTimeout(addObscurity,150);
             if (document.getElementsByClassName("containerDefault-3GGEv_")[0]){setUpContainers();}
         }, 150);
    }, false);
}

//Calls initial setUpGuild and adds click event to call setUpGuild on guilds.
window.addEventListener("load", function loadLoop() {
    if (document.getElementsByClassName('guild-1EfMGQ')[1]){
        console.log("Help");
        setUpGuild();
        var buildGuild = function() {
            document.getElementById("app-mount").addEventListener("click",function(){
                setTimeout(setUpGuild,150);
            });
        };
        buildGuild();
    } else {
        setTimeout(loadLoop,1000);
    }
});
