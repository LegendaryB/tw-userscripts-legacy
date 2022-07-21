// ==UserScript==
// @name         AddMillisecondsWithColorTrigger
// @namespace    https://github.com/LegendaryB/tw-framework
// @version      0.1
// @description  Add milliseconds to the confirm command screen. A target millisecond is configurable. The arrival time row will be painted red and flashes green when you should press the attack button.
// @author       LegendaryB
// @include      https://de*.die-staemme.de/game.php?**&screen=place&try=confirm
// @resource     table-row-template https://raw.githubusercontent.com/LegendaryB/tw-framework/main/src/userscripts/addMillisecondsWithColorTrigger/table-row-template.html
// @resource     span-ms-template https://raw.githubusercontent.com/LegendaryB/tw-framework/main/src/userscripts/addMillisecondsWithColorTrigger/span-ms-template.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=die-staemme.de
// @grant        GM_getResourceText
// ==/UserScript==

(function () {
    'use strict';

    const TABLE_ROW_TEMPLATE = GM_getResourceText('table-row-template');
    const SPAN_MS_TEMPLATE = GM_getResourceText('span-ms-template');

    $($('#command-data-form').find('tbody')[0]).append(TABLE_ROW_TEMPLATE);
    $('.relative_time').after(SPAN_MS_TEMPLATE);

    const SERVER_MS_ELEMENT = $('#serverMs');
    const SAVE_TARGET_MS_ELEMENT = $('#saveTargetMs');

    const TARGET_MS_ELEMENT = $('#targetMs');
    const DELAY_ELEMENT = $('#delay');
    const OFFSET_ELEMENT = $('#offset');

    const ARRIVAL_ELEMENT = $('#date_arrival');

    let targetMs = 0;
    let delay = 0;
    let offset = 0;

    const setArrivalElementStyle = (color) => {
        ARRIVAL_ELEMENT.css({ 'background-color': color });
    };

    const inRange = (value, min, max) => {
        return value >= min && value <= max;
    };

    const highlightServerMsElement = (currentMs) => {
        if (targetMs == 0) {
            return;
        }

        if (currentMs == targetMs || inRange(currentMs, targetMs - offset - delay, targetMs)) {
            setArrivalElementStyle('Lime');
        }
        else {
            setArrivalElementStyle('Red');
        }
    };

    const run = () => {
        let date = new Date(Timing.getCurrentServerTime());
        let currentMs = date.getMilliseconds();

        highlightServerMsElement(currentMs);

        SERVER_MS_ELEMENT.text(`:${currentMs}`);

        requestAnimationFrame(run);
    };

    SAVE_TARGET_MS_ELEMENT.click(() => {
        targetMs = Number(TARGET_MS_ELEMENT.val());
        delay = Number(DELAY_ELEMENT.val());
        offset = Number(OFFSET_ELEMENT.val());

        UI.SuccessMessage('Target millisecond saved!');
    });

    run();
})();