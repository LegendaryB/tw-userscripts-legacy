// ==UserScript==
// @name         Color farm utilisation
// @namespace    https://github.com/LegendaryB/tw-framework
// @version      0.1
// @author       LegendaryB
// @match        https://*.die-staemme.de/game.php?*&screen=overview_villages*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=die-staemme.de
// @grant        none
// ==/UserScript==

// User configuration
const CONFIG = {
    COLOR_ORANGE_THRESHOLD: 800,
    COLOR_RED_THRESHOLD: 300,
    USE_COLOR_GREEN: true
};

(function() {
    'use strict';

    const TABLE = document.getElementById('production_table');
    const CELL_INDEX = 6;

    const between = (x, min, max) => {
        return x >= min && x <= max;
    }

    for (const row of TABLE.querySelectorAll('[class*=row_]')) {
        let cell = row.cells[CELL_INDEX];
        let values = cell.innerText.split('/');
        let used = Number(values[0]);
        let available = Number(values[1]);

        let sum = available - used;

        if (between(sum, CONFIG.COLOR_RED_THRESHOLD, CONFIG.COLOR_ORANGE_THRESHOLD)) {
            cell.innerHTML = `<span style="color: orange;">${cell.innerText}</span>`;
        }
        else if (between(sum, 0, CONFIG.COLOR_RED_THRESHOLD)) {
            cell.innerHTML = `<span style="color: red;">${cell.innerText}</span>`;
        }
        else if (CONFIG.USE_COLOR_GREEN) {
            cell.innerHTML = `<span style="color: green;">${cell.innerText}</span>`;
        }
    }
})();