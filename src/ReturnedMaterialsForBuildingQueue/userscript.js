// ==UserScript==
// @name         Returned materials for building queue
// @namespace    https://github.com/LegendaryB/tw-userscripts
// @version      0.2
// @author       LegendaryB
// @description  Shows the returned materials for the buildings in the queue
// @include      https://de*.die-staemme.de/game.php?*&screen=main*
// @exclude      https://de*.die-staemme.de/game.php?*&screen=main*&mode=destroy
// @require      https://raw.githubusercontent.com/LegendaryB/tw-framework/main/dist/framework.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=die-staemme.de
// @grant        none
// ==/UserScript==

(async () => {
    'use strict';

    const win = typeof unsafeWindow != 'undefined' ? unsafeWindow : window;

    const sleep = ms => new Promise(r => setTimeout(r, ms));

    const waitForFramework = async () => {
        while (!win.TWFramework.finishedLoading) {
            await sleep(1000);
        }
    }

    const TEMPLATE = `
    <div style="display: inline-block; white-space: nowrap;">
        <span class="icon header wood"></span>%WOOD%
        <span class="icon header stone"></span>%STONE%
        <span class="icon header iron"></span>%IRON%
    </div>`;

    const BUILD_ORDER_ELEMENTS = document.querySelectorAll('[class*="buildorder_"]');

    const getBuildingName = (element) => {
        let foundClassName = '';

        for (const className of element.classList) {
            if (className.includes('buildorder_')) {
                foundClassName = className;
                break;
            }
        }

        let name = foundClassName.split('_')[1];
        name = name.charAt(0).toUpperCase() + name.slice(1);

        return name;
    };

    const getBuildingLevel = (element) => {
        let level = element.cells[0].lastChild.data.trim();
        level = level.substring(level.length - 2, level.length);

        return Number(level) - 1;
    }

    const calculate = (building, level) => {
        const buildingInfo = win.TWFramework.World.BuildingInfo[building];

        return {
            Wood: Math.round(buildingInfo.Wood * Math.pow(buildingInfo.WoodFactor, level)),
            Stone: Math.round(buildingInfo.Stone * Math.pow(buildingInfo.StoneFactor, level)),
            Iron: Math.round(buildingInfo.Iron * Math.pow(buildingInfo.IronFactor, level))
        };
    };

    const createReturnedMaterialsElement = (values) => {
        let templateElement = document.createElement('template');
        templateElement.innerHTML = TEMPLATE;
        templateElement.innerHTML = templateElement.innerHTML.replace('%WOOD%', values.Wood);
        templateElement.innerHTML = templateElement.innerHTML.replace('%STONE%', values.Stone);
        templateElement.innerHTML = templateElement.innerHTML.replace('%IRON%', values.Iron);

        return templateElement.content;
    }

    await waitForFramework();

    for (const element of BUILD_ORDER_ELEMENTS) {
        let cancelButton = element.querySelector('.btn-cancel');
        let container = cancelButton.parentElement;

        let building = getBuildingName(cancelButton.closest('tr'));
        let level = getBuildingLevel(cancelButton.closest('tr'));

        let values = calculate(building, level);

        let returnedMaterialsElement = createReturnedMaterialsElement(values);
        container.prepend(returnedMaterialsElement);
    };
})();