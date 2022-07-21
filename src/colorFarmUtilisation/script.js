// ==UserScript==
// @name         Color farm utilisation
// @namespace    https://github.com/LegendaryB/tw-userscripts
// @version      0.2
// @author       LegendaryB
// @description  Highlights the farm utilisation in the production overview and lets the user configure custom threesholds
// @include      https://de*.die-staemme.de/game.php?*&screen=overview_villages*
// @include      https://de*.die-staemme.de/game.php?*&screen=settings
// @include      https://de*.die-staemme.de/game.php?*&screen=settings*mode=settings*
// @include      https://de*.die-staemme.de/game.php?*&screen=overview_villages*mode=prod
// @icon         https://www.google.com/s2/favicons?sz=64&domain=die-staemme.de
// @grant        none
// ==/UserScript==

(() => {
    'use strict';

    const SETTINGS_PERCENT_ID = 'colorFarmUtilisationUsePercent';
    const SETTINGS_ORANGE_THREESHOLD_ID = 'colorFarmUtilisationOrangeThreeshold';
    const SETTINGS_RED_THREESHOLD_ID = 'colorFarmUtilisationRedThreeshold';
    const SETTINGS_HIGHLIGHT_FREE_ID = 'colorFarmUtilisationHighlightFree';
    const SETTINGS_HIGHLIGHT_MAXLEVEL_ID = 'colorFarmUtilisationHighlightMaxLevel';
    const SETTINGS_SAVE_ID = 'colorFarmUtilisationSaveBtn';

    const CONFIG = {
        usePercent: localStorage.getItem(SETTINGS_PERCENT_ID) !== null ? localStorage.getItem(SETTINGS_PERCENT_ID) === 'true' : false,
        orangeThreeshold: localStorage.getItem(SETTINGS_ORANGE_THREESHOLD_ID) !== null ? Number(localStorage.getItem(SETTINGS_ORANGE_THREESHOLD_ID)) : 1100,
        redThreeshold: localStorage.getItem(SETTINGS_RED_THREESHOLD_ID) !== null ? Number(localStorage.getItem(SETTINGS_RED_THREESHOLD_ID)) : 800,
        highlightFree: localStorage.getItem(SETTINGS_HIGHLIGHT_FREE_ID) !== null ? localStorage.getItem(SETTINGS_HIGHLIGHT_FREE_ID) === 'true' : false,
        highlightMaxLevel: localStorage.getItem(SETTINGS_HIGHLIGHT_MAXLEVEL_ID) !== null ? localStorage.getItem(SETTINGS_HIGHLIGHT_MAXLEVEL_ID) === 'true' : false
    }

    const TABLE_ELEMENT_ID = 'production_table';
    const TABLE_FARM_CELL_INDEX = 6;
    const MAX_FARM_PLACES = 24000;

    const SETTINGS_TEMPLATE = `
        <br>
        <table class="vis settings" width="100%">
        <tbody>
            <tr>
                <th colspan="2">Color farm utilisation</th>
            </tr>
            <tr>
                <td>Use percent values:</td>
                <td>
                    <input type="checkbox" id="${SETTINGS_PERCENT_ID}">
                </td>
            </tr>
            <tr>
                <td>Free population threeshold (<span style="color: orange;">orange</span>):</td>
                <td><input id="${SETTINGS_ORANGE_THREESHOLD_ID}" type="text" size="4" maxlength="4" value="${CONFIG.orangeThreeshold}"></td>
            </tr>
            <tr>
                <td>Free population threeshold (<span style="color: red;">red</span>):</td>
                <td><input id="${SETTINGS_RED_THREESHOLD_ID}" type="text" size="4" maxlength="4" value="${CONFIG.redThreeshold}"></td>
            </tr>
            <tr>
                <td>Highlight farms with free space in <span style="color: green;">green</span>:</td>
                <td>
                    <input id="${SETTINGS_HIGHLIGHT_FREE_ID}" type="checkbox">
                </td>
            </tr>
            <tr>
                <td>Highlight farms with maximum level in <span style="color: blue;">blue</span>:</td>
                <td>
                    <input id="${SETTINGS_HIGHLIGHT_MAXLEVEL_ID}" type="checkbox">
                </td>
            </tr>
            <tr>
                <td colspan="2">
                    <input id="${SETTINGS_SAVE_ID}" class="btn" type="button" value="Save settings">
                </td>
            </tr>
        </tbody>
    </table>
    <br>`;

    const saveSettings = () => {
        let usePercent = document.getElementById(SETTINGS_PERCENT_ID).checked;
        let orangeThreeshold = Number(document.getElementById(SETTINGS_ORANGE_THREESHOLD_ID).value);
        let redThreeshold = Number(document.getElementById(SETTINGS_RED_THREESHOLD_ID).value);

        if (usePercent) {
            if (orangeThreeshold < 1 || orangeThreeshold > 100) {
                UI.ErrorMessage('The orange threeshold must be between 1 and 100!');
                return;
            }

            if (redThreeshold < 1 || redThreeshold > 100) {
                UI.ErrorMessage('The red threeshold must be between 1 and 100!');
                return;
            }

            if (redThreeshold == orangeThreeshold) {
                UI.ErrorMessage('The red threeshold can not be equal to the orange threeshold!');
                return;
            }

            if (redThreeshold > orangeThreeshold) {
                UI.ErrorMessage('The red threeshold must be less than the orange threeshold!');
                return;
            }
        }

        if (redThreeshold == orangeThreeshold) {
            UI.ErrorMessage('The red threeshold can not be equal to the orange threeshold!');
            return;
        }

        if (redThreeshold > orangeThreeshold) {
            UI.ErrorMessage('The red threeshold must be less than the orange threeshold!');
            return;
        }

        localStorage.setItem(SETTINGS_PERCENT_ID, usePercent);
        localStorage.setItem(SETTINGS_ORANGE_THREESHOLD_ID, orangeThreeshold);
        localStorage.setItem(SETTINGS_RED_THREESHOLD_ID, redThreeshold);
        localStorage.setItem(SETTINGS_HIGHLIGHT_FREE_ID, document.getElementById(SETTINGS_HIGHLIGHT_FREE_ID).checked);
        localStorage.setItem(SETTINGS_HIGHLIGHT_MAXLEVEL_ID, document.getElementById(SETTINGS_HIGHLIGHT_MAXLEVEL_ID).checked);

        location.reload();
    }

    const createSettingsTable = () => {
        let templateElement = document.createElement('template');
        templateElement.innerHTML = SETTINGS_TEMPLATE;

        let anchor = document.getElementById('dialog-sync-show');
        anchor.parentElement.after(templateElement.content);

        if (CONFIG.usePercent) {
            document.getElementById(SETTINGS_PERCENT_ID).setAttribute('checked', undefined);
        }

        if (CONFIG.highlightFree) {
            document.getElementById(SETTINGS_HIGHLIGHT_FREE_ID).setAttribute('checked', undefined);
        }

        if (CONFIG.highlightMaxLevel) {
            document.getElementById(SETTINGS_HIGHLIGHT_MAXLEVEL_ID).setAttribute('checked', undefined);
        }

        document.getElementById(SETTINGS_SAVE_ID).onclick = () => saveSettings();
    }

    const between = (x, min, max) => {
        return x >= min && x <= max;
    }

    const applyFarmColors = () => {
        for (const row of document.getElementById(TABLE_ELEMENT_ID).querySelectorAll('[class*=row_]')) {
            let cell = row.cells[TABLE_FARM_CELL_INDEX];
            let values = cell.innerText.split('/');
            let used = Number(values[0]);
            let available = Number(values[1]);

            let sum = available - used;

            if (CONFIG.usePercent) {
                sum = (sum / available)*100;
            }

            if (available == MAX_FARM_PLACES) {
                if (CONFIG.highlightMaxLevel) {
                    cell.innerHTML = `<span style="color: blue;">${cell.innerText}</span>`;
                }
                continue;
            }

            if (between(sum, CONFIG.redThreeshold, CONFIG.orangeThreeshold)) {
                cell.innerHTML = `<span style="color: orange;">${cell.innerText}</span>`;
            }
            else if (between(sum, 0, CONFIG.redThreeshold)) {
                cell.innerHTML = `<span style="color: red;">${cell.innerText}</span>`;
            }
            else if (CONFIG.highlightFree) {
                cell.innerHTML = `<span style="color: green;">${cell.innerText}</span>`;
            }
        }
    }

    if (game_data.screen === 'settings') {
        createSettingsTable();
    }
    else if (game_data.screen === 'overview_villages') {
        applyFarmColors();
    }
})();