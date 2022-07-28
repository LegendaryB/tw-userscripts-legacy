// ==UserScript==
// @name         Copy tribe member names for message
// @namespace    https://github.com/LegendaryB/tw-userscripts
// @version      0.1
// @author       LegendaryB
// @include      https://de*.die-staemme.de/game.php?*screen=info_ally*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=die-staemme.de
// @grant        none
// ==/UserScript==

(async () => {
    'use strict';

    const TABLE_ANCHOR_ELEMENT_ID = 'info_map_color_toggler';
    const TABLE_ANCHOR_ELEMENT = document.querySelector(`.${TABLE_ANCHOR_ELEMENT_ID}`).closest('tr');

    const COPY_ELEMENT_ID = 'copyTribeMemberNames';

    const TEMPLATE = `
        <td colspan="2">
            <a id="${COPY_ELEMENT_ID}" style="cursor: pointer;">» Copy tribe member names</a>
        </td>`;

    const templateElement = document.createElement('template');
    templateElement.innerHTML = TEMPLATE;

    TABLE_ANCHOR_ELEMENT.after(templateElement.content);

    const COPY_ELEMENT = document.getElementById(COPY_ELEMENT_ID);

    const copyAllPlayerNames = async () => {
        let members = Array.from(document.querySelectorAll('[class=userimage-tiny]'));
        members = members.map(memberImageElement => {
            let member = memberImageElement.nextElementSibling;

            return member.innerText.trim();
        });

        await navigator.clipboard.writeText(members.join(';'));
        UI.SuccessMessage('Player names copied to clipboard!');
    }

    COPY_ELEMENT.onclick = async() => await copyAllPlayerNames();
})();