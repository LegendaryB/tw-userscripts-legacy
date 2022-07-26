// ==UserScript==
// @name         Village note templates
// @namespace    https://github.com/LegendaryB/tw-userscripts
// @version      0.1
// @author       LegendaryB
// @description  
// @include      https://de*.die-staemme.de/game.php?*&screen=info_village*
// @include      https://de*.die-staemme.de/game.php?*&screen=settings
// @include      https://de*.die-staemme.de/game.php?*&screen=settings*mode=settings*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=die-staemme.de
// @grant        none
// ==/UserScript==

const addModule = (src) => {
    const scriptElement = document.createElement('script');
    scriptElement.type = 'module';
    scriptElement.src = src;

    document.head.appendChild(scriptElement);
}

(async () => {
    addModule('https://cdn.jsdelivr.net/gh/LegendaryB/tw-userscripts/src/VillageNoteTemplates/villageNoteTemplate.min.js');
    addModule('https://cdn.jsdelivr.net/gh/LegendaryB/tw-userscripts/src/VillageNoteTemplates/userscript.min.js');
});