// ==UserScript==
// @name         Select reports
// @namespace    https://github.com/LegendaryB/tw-userscripts
// @version      0.3
// @author       LegendaryB
// @description  Inserts radio buttons in the report overview to select all reports from today, yesterday or a custom date.
// @include      https://de*.die-staemme.de/game.php?*&screen=report*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=die-staemme.de
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const TODAY_ELEMENT_ID = 'select_reports_from_today';
    const YESTERDAY_ELEMENT_ID = 'select_reports_from_yesterday';
    const CUSTOM_ELEMENT_ID = 'select_custom_reports';
    const RESET_ELEMENT_ID = 'select_reports_reset';

    const RADIO_ELEMENT_NAME = 'select_reports';

    const TEMPLATE = `
    <tr id="select_reports_header">
       <th colspan="4">
          <span>Select reports</span>
          <a id="${RESET_ELEMENT_ID}" href="#" style="float: right;">Reset</a>
       </th>
   </tr>
   <tr>
       <td colspan="4">
          <input type="radio" id="${TODAY_ELEMENT_ID}" name="${RADIO_ELEMENT_NAME}"><label for="${TODAY_ELEMENT_ID}">from today</label>
       </td>
   </tr>
   <tr>
       <td colspan="4">
          <input type="radio" id="${YESTERDAY_ELEMENT_ID}" name="${RADIO_ELEMENT_NAME}"><label for="${YESTERDAY_ELEMENT_ID}">from yesterday</label>
       </td>
   </tr>
   <tr>
       <td colspan="4">
          <input type="radio" id="${CUSTOM_ELEMENT_ID}" name="${RADIO_ELEMENT_NAME}"><label for="${CUSTOM_ELEMENT_ID}">from custom date</label>
       </td>
   </tr>`;

    const CONTAINER = document.getElementById('filter_own_reports');

    const clearSelection = () => {
        for (const row of document.querySelectorAll('tr[class*=report-]')) {
            let checkboxElement = row.querySelector('input[type=checkbox]');

            checkboxElement.checked = false;
        }
    }

    const markReports = (date, when) => {
        let count = 0;

        for (const row of document.querySelectorAll('tr[class*=report-]')) {
            let checkboxElement = row.querySelector('input[type=checkbox]');
            let reportTimeElement = row.querySelector('td.nowrap');

            checkboxElement.checked = reportTimeElement.innerText.includes(date);

            if (checkboxElement.checked) {
                count++;
            }
        }

        UI.SuccessMessage(`All reports (${count}) from ${when} selected!`);
    }

    let markReportsFromToday = () => markReports(getTodayDate(), 'today');

    let markReportsFromYesterday = () => markReports(getYesterdayDate(), 'yesterday');

    const insertUserInterfaceElements = (anchor) => {
        let templateElement = document.createElement('template');
        templateElement.innerHTML = TEMPLATE;

        anchor.after(templateElement.content);
    };

    const getDate = (date) => {
        let month = date.getMonth() + 1;
        month = month < 10 ? `0${month}` : month;

        let year = date.getFullYear().toString().substr(-2);

        return `${date.getDate()}.${month}.${year}`;
    }

    const getTodayDate = () => {
        return getDate(new Date());
    };

    const getYesterdayDate = () => {
        let date = new Date(new Date().getTime() - 24 * 60 * 60 * 1000)

        return getDate(date);
    }

    const isEmptyPromptValue = (data) => {
        return data == null || data.length <= 0;
    }

    const anchor = CONTAINER.closest('tr');
    insertUserInterfaceElements(anchor);

    const RESET_ELEMENT = document.getElementById(RESET_ELEMENT_ID);

    const TODAY_ELEMENT = document.getElementById(TODAY_ELEMENT_ID);
    const YESTERDAY_ELEMENT = document.getElementById(YESTERDAY_ELEMENT_ID);
    const CUSTOM_ELEMENT = document.getElementById(CUSTOM_ELEMENT_ID);

    RESET_ELEMENT.onclick = () => {
        TODAY_ELEMENT.checked = false;
        YESTERDAY_ELEMENT.checked = false;

        clearSelection();

        UI.InfoMessage(`Auswahl erfolgreich zurückgesetzt.`);
    };

    TODAY_ELEMENT.addEventListener('change', () => {
        CUSTOM_ELEMENT.parentElement.querySelector('label').innerText = 'from custom date';

        markReportsFromToday();
    });

    YESTERDAY_ELEMENT.addEventListener('change', () => {
        CUSTOM_ELEMENT.parentElement.querySelector('label').innerText = 'from custom date';

        markReportsFromYesterday();
    });

    CUSTOM_ELEMENT.addEventListener('change', () => {
        let date = prompt('Please enter the custom date:');

        if (isEmptyPromptValue(date)) {
            UI.ErrorMessage("No custom date provided. Nothing selected!");

            clearSelection();
            return;
        }

        CUSTOM_ELEMENT.parentElement.querySelector('label').innerText = date;
        markReports(date, date);
    });
})();