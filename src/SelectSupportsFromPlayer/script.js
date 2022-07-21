// ==UserScript==
// @name         Select supports from player
// @namespace    https://github.com/LegendaryB/tw-userscripts
// @version      0.3
// @author       LegendaryB
// @description  Inserts a list of the supporting players in the gathering place. When a player name is clicked, all supports from the player will be selected and can be sent back
// @include		 https://de*.die-staemme.de/game.php*screen=place*&mode=units*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=die-staemme.de
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const CONTENT_ROOT_ELEMENT_ID = "content_value";
    const SUPPORT_TABLE_ELEMENT_ID = "units_home";

    const CONTENT_ROOT_ELEMENT = document.getElementById(CONTENT_ROOT_ELEMENT_ID);
    const SUPPORT_TABLE = document.getElementById(SUPPORT_TABLE_ELEMENT_ID);

    const PLAYER_RX = /\(([^()]*)\)/g;

    const ROWS = [];

    let SUPPORT_TABLE_ROW_ARRAY = Array.from(SUPPORT_TABLE.rows).slice(2);

    Array.from(SUPPORT_TABLE_ROW_ARRAY).forEach((row) => {
        if (row.firstElementChild.colSpan <= 1) {
            ROWS.push(row);
        }
    });

    let getPlayerName = (row) => {
        let troopSource = row.children[1].innerText;
        let matches = troopSource.match(PLAYER_RX);

        return matches[0].replace("(", "").replace(")", "");
    }

    let getPlayerNames = () => {
        let names = [];

        for (let i = 0; i < ROWS.length; i++) {
            let row = ROWS[i];
            let name = getPlayerName(row);

            if (!names.includes(name)) {
                names.push(name);
            }
        }

        return names;
    }

    let markSupportsFromPlayer = (playerName) => {
        let message = `Selected all supports of player '${playerName}'!`;

        ROWS.forEach((row => {
            if (getPlayerName(row) == playerName) {
                row.firstElementChild.firstElementChild.checked = !row.firstElementChild.firstElementChild.checked;

                if (!row.firstElementChild.firstElementChild.checked) {
                    message = `Deselected all supports of player '${playerName}'!`;
                }
            }
        }));

        UI.SuccessMessage(message);
    }

    let createUserInterface = (playerNames) => {
        let anchorElement = CONTENT_ROOT_ELEMENT.children[2];

        let container = document.createElement("div");
        container.style = "margin-top: 10px;";

        for (let i = 0; i < playerNames.length; i++) {
            let link = document.createElement("a");
            link.target = "_self";
            link.style = "cursor: pointer;";
            link.innerText = playerNames[i].concat(i == playerNames.length - 1 ? "" : ", ");
            link.onclick = () => markSupportsFromPlayer(playerNames[i]);

            container.appendChild(link);
        }

        anchorElement.after(container);
    }


    let playerNames = getPlayerNames();

    if (playerNames.length > 0) {
        createUserInterface(playerNames);
    }
})();