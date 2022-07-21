// ==UserScript==
// @name         Distanz zwischen zwei Dörfern berechnen
// @namespace    https://github.com/LegendaryB/tw-framework
// @version      0.3
// @author       LegendaryB
// @include		 https://de*.die-staemme.de/game.php*screen=map*
// @require      https://raw.githubusercontent.com/LegendaryB/tw-framework/main/dist/framework.js
// @resource     table-template https://raw.githubusercontent.com/LegendaryB/tw-framework/main/src/userscripts/distanceCalculator/table-template.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=die-staemme.de
// @grant        GM_getResourceText
// ==/UserScript==

(async () => {
    'use strict';

    const win = typeof unsafeWindow != 'undefined' ? unsafeWindow : window;

    const TABLE_TEMPLATE = GM_getResourceText('table-template');

    let active = false;
    let onClickFn;

    let villageArray = [];

    const run = () => {
        active = true;
        win.TWMap.mapHandler.integratedSpawnSector = win.TWMap.mapHandler.spawnSector;
        win.TWMap.mapHandler.spawnSector = spawnSector;

        onClickFn = win.TWMap.mapHandler.onClick;
        win.TWMap.mapHandler.onClick = clickFunction;
        win.TWMap.reload();
    };

    const disable = () => {
        active = false;
        win.TWMap.mapHandler.onClick = onClickFn;
        win.TWMap.mapHandler.spawnSector = win.TWMap.mapHandler.integratedSpawnSector;
        win.TWMap.reload();

        $('#distance-calc-table').remove();
    };

    const spawnSector = (data, sector) => {
        win.TWMap.mapHandler.integratedSpawnSector(data, sector);

        for (let i = 0; i < villageArray.length; i++) {
            let village = villageArray[i];

            let v = $('#map_village_' + village.id);

            $('<div class="DistanceCalculatorOverlay" id="DistanceCalculator_overlay_' + village.id + '" style="width:52px; height:37px; position: absolute; z-index: 50; left:' + $(v).css('left') + '; top: ' + $(v).css('top') + ';"></div>').appendTo(v.parent());
            $('#DistanceCalculator_overlay_' + village.id).css('outline', '2px solid red');
        }
    }

    const formatTime = (input) => {
        return input < 10 ? `0${input}` : input;
    }

    const convertTime = (input) => {
        let input1 = Math.round(input * 60);
        let seconds = (input1 % 60);
        let input2 = Math.floor(input1 / 60);
        let minutes = input2 % 60;
        let input3 = Math.floor(input2 / 60);
        let hours = input3 % 24;
        let days = Math.floor(input3 / 24);

        if (days > 0) {
            return `${days} Tag(e) ${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}`;
        }
        else {
            return `${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}`;
        }
    }

    const calculateDistance = () => {
        let startX = villageArray[0].X;
        let startY = villageArray[0].Y;

        let targetX = villageArray[1].X;
        let targetY = villageArray[1].Y;

        let xDis = startX - targetX;
        let yDis = startY - targetY;

        return Math.sqrt(xDis * xDis + yDis * yDis);
    }

    const calculateUnitTravelTime = () => {
        let distance = calculateDistance();
        let unitInfo = win.TWFramework.World.UnitInfo;

        debugger;

        return {
            Axe: convertTime(unitInfo.Axe.Speed * distance),
            Sword: convertTime(unitInfo.Sword.Speed * distance),
            Spear: convertTime(unitInfo.Spear.Speed * distance),
            Spy: convertTime(unitInfo.Spy.Speed * distance),
            Light: convertTime(unitInfo.Light.Speed * distance),
            Heavy: convertTime(unitInfo.Heavy.Speed * distance),
            Ram: convertTime(unitInfo.Ram.Speed * distance),
            Catapult: convertTime(unitInfo.Catapult.Speed * distance),
            Snob: convertTime(unitInfo.Snob.Speed * distance)
        };
    }

    const markVillageAsSelected = (id) => {
        $('#DistanceCalculator_overlay_' + id).css('outline', '2px solid red');
    }
    const demarkVillageAsSelected = (id) => {
        $('#DistanceCalculator_overlay_' + id).css('outline', '');
    }

    const renderTravelTimeTable = () => {
        let unitTravelTime = calculateUnitTravelTime();
        let table = TABLE_TEMPLATE;

        for (const [unit, travelTime] of Object.entries(unitTravelTime)) {
            table = table.replace(`%${unit.toUpperCase()}%`, travelTime);
        }

        let template = document.createElement('template');
        template.innerHTML = table;

        $('#map_whole').after(template.content);
    }

    const handleVillage = async (x, y) => {
        let village = {
            id: win.TWMap.villages[(x) * 1000 + y].id,
            X: x,
            Y: y,
            Coordinates: `${x}|${y}`
        }

        if (!village.id) {
            return;
        }

        if (villageArray.length === 2) {
            villageArray = [];
            $('#distance-calc-table').remove();
        }

        let index = villageArray.findIndex(v => v.id === village.id);
        let alreadySelected = index !== -1;

        if (alreadySelected) {
            villageArray[index] = null;
            demarkVillageAsSelected(village.id);
        }
        else {
            villageArray.push(village);
            markVillageAsSelected(village.id);
            win.TWMap.reload();
        }

        if (villageArray.length == 2) {
            renderTravelTimeTable();
        }
    }

    const clickFunction = (x, y, event) => {
        handleVillage(x, y);
        return false;
    }

    $(document).ready(() => {
        $(document).on("keypress", (e) => {
            if (String.fromCharCode(e.which) == 'd') {
                if (!active) {
                    run();
                } else {
                    disable();
                }
            }
        })
    });
})();