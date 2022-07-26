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

(() => {
    const createScriptElement = (src) => {
        const scriptElement = document.createElement('script');
        scriptElement.src = src;

        return scriptElement;
    }

    const addModule = (src) => {
        const scriptElement = createScriptElement(src);
        scriptElement.type = 'module';

        document.head.appendChild(scriptElement);
    }

    debugger;

    addModule('https://cdn.jsdelivr.net/gh/LegendaryB/tw-userscripts/src/VillageNoteTemplates/villageNoteTemplate.js');
    addModule('https://cdn.jsdelivr.net/gh/LegendaryB/tw-userscripts/src/VillageNoteTemplates/userscript.js');
})();