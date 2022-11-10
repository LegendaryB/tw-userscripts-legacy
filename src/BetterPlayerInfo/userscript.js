// ==UserScript==
// @name         BetterPlayerInfo
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
    const VILLAGE_TABLE_COORDS_CELL_INDEX = 1;
    const COPY_COORDS_ELEMENT_ID = 'copyCoordinates';

    const VILLAGE_TABLE = document.getElementById(VILLAGE_TABLE_ID);
    const VILLAGE_TABLE_COORDINATE_HEADER = VILLAGE_TABLE.rows[0].cells[VILLAGE_TABLE_COORDS_CELL_INDEX];

    const TABLE_HEADER_TEMPLATE = `
        <a id="${COPY_COORDS_ELEMENT_ID}" style="cursor: pointer;" title="Click to copy all village coordinates">${VILLAGE_TABLE_COORDINATE_HEADER.innerText}</a>`;

    VILLAGE_TABLE_COORDINATE_HEADER.innerHTML = TABLE_HEADER_TEMPLATE;

    const COPY_COORDS_ELEMENT = document.getElementById(COPY_COORDS_ELEMENT_ID);

    

    const copyAllVillageCoordinates = async () => {
        let tableBody = VILLAGE_TABLE.querySelector('tbody');
        let result = [];

        for (const row of tableBody.rows) {
            let coord = row.cells[VILLAGE_TABLE_COORDS_CELL_INDEX].innerText;
            result.push(coord);
        }

        await navigator.clipboard.writeText(result.join('\n'));
        UI.SuccessMessage('Village coordinates copied to clipboard!');
    }

    COPY_COORDS_ELEMENT.onclick = async () => await copyAllVillageCoordinates();
})();