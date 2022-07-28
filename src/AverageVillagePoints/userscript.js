// ==UserScript==
// @name         Average village points
// @namespace    https://github.com/LegendaryB/tw-userscripts
// @version      0.1
// @author       LegendaryB
// @include      https://de*.die-staemme.de/game.php?*screen=info_player*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=die-staemme.de
// @grant        none
// ==/UserScript==

(async () => {
    'use strict';

    const VILLAGE_TABLE_ID = 'villages_list';
    const VILLAGE_TABLE_POINTS_CELL_INDEX = 2;

    const VILLAGE_TABLE = document.getElementById(VILLAGE_TABLE_ID);
    const VILLAGE_TABLE_POINTS_HEADER_ELEMENT = VILLAGE_TABLE.rows[0].cells[VILLAGE_TABLE_POINTS_CELL_INDEX];

    const getVillageCount = () => {
        let tableBody = VILLAGE_TABLE.querySelector('tbody');

        return tableBody.rows.length;
    }

    const getVillagePoints = () => {
        let tableBody = VILLAGE_TABLE.querySelector('tbody');
        let result = 0;

        for (const row of tableBody.rows) {
            let points = Number(row.cells[VILLAGE_TABLE_POINTS_CELL_INDEX].innerText.replace('.', ''));
            result += points;
        }

        return result;
    }

    let villageCount = getVillageCount();
    let villagePoints = getVillagePoints();

    let average = Math.round(villagePoints / villageCount);

    VILLAGE_TABLE_POINTS_HEADER_ELEMENT.innerHTML = `
            ${VILLAGE_TABLE_POINTS_HEADER_ELEMENT.innerHTML}
            <span>Ø ${average}</span>`;
})();