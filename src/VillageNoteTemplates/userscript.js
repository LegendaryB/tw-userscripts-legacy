// ==UserScript==
// @name         Village note templates
// @namespace    https://github.com/LegendaryB/tw-userscripts
// @version      0.1
// @author       LegendaryB
// @include      https://de*.die-staemme.de/game.php?*&screen=info_village*
// @include      https://de*.die-staemme.de/game.php?*&screen=settings
// @include      https://de*.die-staemme.de/game.php?*&screen=settings*mode=settings*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=die-staemme.de
// @grant        none
// ==/UserScript==

import ConfigurationStore from "./configurationStore";

import { useSettingsViewHandler } from "./viewHandlers/settingsViewHandler";
import { useVillageViewHandler } from "./viewHandlers/villageViewHandler";

(() => {
    let configuration = ConfigurationStore.load();
    
    if (game_data.screen === 'settings') {
        useSettingsViewHandler(configuration);
    }
    else if (game_data.screen === 'info_village') {
        useVillageViewHandler(configuration);
    }
})();

/*
    const SETTINGS_TEMPLATE_NAME_PLACEHOLDER = '%name%';
    const SETTINGS_TEMPLATE_CONTENT_PLACEHOLDER = '%content%';
    const SETTINGS_TEMPLATE_OUTPUT_PLACEHOLDER = '%output%';

    const DATE_PLACEHOLDER = '%DATE%';
    const PLAYER_PLACEHOLDER = '%PLAYER%';
    const UNIT_AXE = '%UNIT_AXE%';

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
    }*/