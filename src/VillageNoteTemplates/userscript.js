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

import VillageNoteTemplate from "./villageNoteTemplate";

(async () => {
    'use strict';

    // const SCRIPT_ROOT = 'https://raw.githubusercontent.com/LegendaryB/tw-userscripts/main/src/VillageNoteTemplates';

    const SCRIPT_NAME = 'Village note templates';
    
    // Local storage key
    const SETTINGS_STORAGE_KEY = 'tw_villageNoteTemplates';

    // Button element id's
    const SETTINGS_INFO_BTN_ID = `${SETTINGS_STORAGE_KEY}Info`;
    const SETTINGS_NEW_BTN_ID = `${SETTINGS_STORAGE_KEY}New`;
    const SETTINGS_SAVE_BTN_ID = `${SETTINGS_STORAGE_KEY}Save`;

    const SETTINGS_NOTE_TEMPLATE_TABLE_ID = 'asdas';
    const SETTINGS_EMPTY_TABLE_ROW_ID = 'test';

    const NOTE_TEMPLATES = localStorage.getItem(SETTINGS_STORAGE_KEY);

    /*
    class NoteTemplate {
        constructor(name, content) {
            this.name = name;
            this.content = content;
        }
    } */

    const SETTINGS_TEMPLATE = `
        <br>
        <table class="vis settings" width="100%">
            <tbody>
                <tr>
                    <th colspan="2">
                        ${SCRIPT_NAME}
                        <span id="${SETTINGS_INFO_BTN_ID}" style="float: right;" class="icon info-med"></span>
                    </th>
                </tr>
                <tr>
                    <td colspan="2">
                        <table id="${SETTINGS_NOTE_TEMPLATE_TABLE_ID}" class="vis settings" width="100%">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Template</th>
                                <th>Output</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr id="${SETTINGS_EMPTY_TABLE_ROW_ID}">
                                <td colspan="4">
                                    <span>No templates have been added yet.</span>
                                </td>
                            </tr>
                        </tbody>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td colspan="2">
                        <input id="${SETTINGS_NEW_BTN_ID}" class="btn" type="button" value="New template">
                        <input id="${SETTINGS_SAVE_BTN_ID}" style="margin: 4px;" class="btn" type="button" value="Save settings">
                    </td>
                </tr>
            </tbody>
        </table>
        <br>`;

    const SETTINGS_TEMPLATE_NAME_PLACEHOLDER = '%name%';
    const SETTINGS_TEMPLATE_CONTENT_PLACEHOLDER = '%content%';
    const SETTINGS_TEMPLATE_OUTPUT_PLACEHOLDER = '%output%';

    const SETTINGS_NOTE_ITEM_TEMPLATE = `
        <td>${SETTINGS_TEMPLATE_NAME_PLACEHOLDER}</td>
        <td>${SETTINGS_TEMPLATE_CONTENT_PLACEHOLDER}</td>
        <td>${SETTINGS_TEMPLATE_OUTPUT_PLACEHOLDER}</td>
        <td><img src="https://dsde.innogamescdn.com/asset/556944fb/graphic/delete.png" alt="" class="cancel_link_icon"></td>`;

    const DATE_PLACEHOLDER = '%DATE%';
    const PLAYER_PLACEHOLDER = '%PLAYER%';
    const UNIT_AXE = '%UNIT_AXE%';

    const findPlaceholders = (template) => {
        return template.match(/%\w+%/g) || [];
    }

    const handleIconPlaceholder = (placeholder) => {
        const ASSET_BASE_URL = 'https://dsde.innogamescdn.com/graphic';
        const ASSET_BUILDINGS = 'buildings';
        const ASSET_UNITS = 'unit/unit';

        let asset = placeholder;

        asset = asset.replace('%ICON_MAIN%', `${ASSET_BUILDINGS}/main`);
        asset = asset.replace('%ICON_STABLE%', `${ASSET_BUILDINGS}/stable`);
        asset = asset.replace('%ICON_SMITH%', `${ASSET_BUILDINGS}/smith`);
        asset = asset.replace('%ICON_GARAGE%', `${ASSET_BUILDINGS}/garage`);
        asset = asset.replace('%ICON_STATUE%', `${ASSET_BUILDINGS}/statue`);
        asset = asset.replace('%ICON_STORAGE%', `${ASSET_BUILDINGS}/storage`);
        asset = asset.replace('%ICON_PLACE%', `${ASSET_BUILDINGS}/place`);
        asset = asset.replace('%ICON_MARKET%', `${ASSET_BUILDINGS}/market`);
        asset = asset.replace('%ICON_HIDE%', `${ASSET_BUILDINGS}/hide`);
        asset = asset.replace('%ICON_WOOD%', `${ASSET_BUILDINGS}/wood`);
        asset = asset.replace('%ICON_STONE%', `${ASSET_BUILDINGS}/stone`);
        asset = asset.replace('%ICON_IRON%', `${ASSET_BUILDINGS}/iron`);
        asset = asset.replace('%ICON_FARM%', `${ASSET_BUILDINGS}/farm`);
        asset = asset.replace('%ICON_WALL%', `${ASSET_BUILDINGS}/wall`);
        asset = asset.replace('%ICON_SNOBHOUSE%', `${ASSET_BUILDINGS}/snob`);

        asset = asset.replace('%ICON_SPEAR%', `${ASSET_UNITS}_spear`);
        asset = asset.replace('%ICON_SWORD%', `${ASSET_UNITS}_sword`);
        asset = asset.replace('%ICON_AXE%', `${ASSET_UNITS}_axe`);
        asset = asset.replace('%ICON_ARCHER%', `${ASSET_UNITS}_archer`);
        asset = asset.replace('%ICON_SPY%', `${ASSET_UNITS}_spy`);
        asset = asset.replace('%ICON_LIGHT%', `${ASSET_UNITS}_light`);
        asset = asset.replace('%ICON_MARCHER%', `${ASSET_UNITS}_marcher`);
        asset = asset.replace('%ICON_HEAVY%', `${ASSET_UNITS}_heavy`);
        asset = asset.replace('%ICON_RAM%', `${ASSET_UNITS}_ram`);
        asset = asset.replace('%ICON_CATAPULT%', `${ASSET_UNITS}_catapult`);
        asset = asset.replace('%ICON_KNIGHT%', `${ASSET_UNITS}_knight`);
        asset = asset.replace('%ICON_SNOB%', `${ASSET_UNITS}_snob`);

        return `<img src="${ASSET_BASE_URL}/${asset}.png" class=""></img>`;
    }

    const getNoteTemplateOutput = (template) => {
        let placeholders = findPlaceholders(template);

        for (const placeholder of placeholders) {
            if (placeholder.startsWith('%ICON_')) {
                template = template.replace(placeholder, handleIconPlaceholder(placeholder));
            }
        }

        template = template.replace(/\[(b|i|u|s)\](.*?)\[\/\1\]/gs, "<$1>$2</$1>");

        template = template.replace(DATE_PLACEHOLDER, new Date().toLocaleDateString());
        template = template.replace(PLAYER_PLACEHOLDER, `<a href="/game.php?village=${game_data.village.id}&amp;screen=info_player&amp;id=${game_data.player.id}" target="_blank">${game_data.player.name}</a>`);

        return template;
    }

    const createNoteTemplateElement = (noteTemplate) => {
        let innerHTML = SETTINGS_NOTE_ITEM_TEMPLATE;
        innerHTML = innerHTML.replace(SETTINGS_TEMPLATE_NAME_PLACEHOLDER, noteTemplate.name);
        innerHTML = innerHTML.replace(SETTINGS_TEMPLATE_CONTENT_PLACEHOLDER, noteTemplate.content);
        innerHTML = innerHTML.replace(SETTINGS_TEMPLATE_OUTPUT_PLACEHOLDER, getNoteTemplateOutput(noteTemplate.content));

        let table = document.getElementById(SETTINGS_NOTE_TEMPLATE_TABLE_ID);
        let row = table.insertRow();

        row.innerHTML = innerHTML;
    }

    const saveSettings = () => {

        location.reload();
    }

    const createSettingsTable = () => {
        let templateElement = document.createElement('template');
        templateElement.innerHTML = SETTINGS_TEMPLATE;

        let anchor = document.getElementById('dialog-sync-show');
        anchor.parentElement.after(templateElement.content);

        if (NOTE_TEMPLATES === null) {
            document.getElementById(SETTINGS_EMPTY_TABLE_ROW_ID).remove();
        }

        document.getElementById(SETTINGS_SAVE_BTN_ID).onclick = () => saveSettings();
    }

    const applyFarmColors = () => {
    }

    if (game_data.screen === 'settings') {
        createSettingsTable();
        createNoteTemplateElement(new VillageNoteTemplate('OFF', '%ICON_AXE% [b]OFF[/b] %DATE% %PLAYER%'));
        createNoteTemplateElement(new VillageNoteTemplate('OFF', '%ICON_HEAVY% OFF %DATE% %PLAYER%'));
        createNoteTemplateElement(new VillageNoteTemplate('OFF', '%ICON_LIGHT% OFF %DATE% %PLAYER%'));
        createNoteTemplateElement(new VillageNoteTemplate('OFF', '%ICON_SNOBHOUSE% OFF %DATE% %PLAYER% %ICON_AXE% aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'));
        createNoteTemplateElement(new VillageNoteTemplate('OFF', '%ICON_MAIN% OFF %DATE% %PLAYER%'));
        createNoteTemplateElement(new VillageNoteTemplate('OFF', '%ICON_SNOB% OFF %DATE% %PLAYER%'));
    }
    else if (game_data.screen === 'info_village') {
        applyFarmColors();
    }
})();