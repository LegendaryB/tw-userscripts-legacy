// ==UserScript==
// @name         AddMilliseconds
// @namespace    https://github.com/LegendaryB/tw-framework
// @version      0.1
// @description  Add milliseconds to the confirm command screen
// @author       LegendaryB
// @include      https://de*.die-staemme.de/game.php?**&screen=place&try=confirm
// @resource     span-ms-template https://raw.githubusercontent.com/LegendaryB/tw-framework/main/src/userscripts/addMilliseconds/span-ms-template.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=die-staemme.de
// @grant        GM_getResourceText
// ==/UserScript==

(function () {
    'use strict';

    const SPAN_MS_TEMPLATE = GM_getResourceText('span-ms-template');

    $('.relative_time').after(SPAN_MS_TEMPLATE);

    const SERVER_MS_ELEMENT = $('#serverMs');

    const run = () => {
        let date = new Date(Timing.getCurrentServerTime());
        let currentMs = date.getMilliseconds();

        SERVER_MS_ELEMENT.text(`:${currentMs}`);

        requestAnimationFrame(run);
    };

    run();
})();