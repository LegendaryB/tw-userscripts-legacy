// ==UserScript==
// @name         Dynamic quick link scripts
// @namespace    https://github.com/LegendaryB/tw-userscripts
// @version      0.2
// @author       LegendaryB
// @match        https://*.die-staemme.de/game.php?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=die-staemme.de
// @grant        none
// ==/UserScript==

(async () => {
  'use strict';

  class QuickLink {
    id = undefined;
    displayName = undefined;
    scriptLink = undefined;

    constructor(displayName, scriptLink) {
      this.id = Date.now();
      this.displayName = displayName;
      this.scriptLink = scriptLink;
    }
  }

  const QUICKBAR_ELEMENT = document.querySelector('.menu.quickbar');
  const QUICKBAR_ADD_ELEMENT_ID = 'quickLinkAddButton';
  const QUICKBAR_STORAGE_ID = 'tw_dynamic_quicklinks';

  const QUICKBAR_ADD_ELEMENT_HTML_TEMPLATE = `
          <li id="${QUICKBAR_ADD_ELEMENT_ID}" class="quickbar_item">
            <span>
              <a class="quickbar_link" href="#">
                %QUICKLINK_DISPLAY_NAME%
              </a>
            </span>
          </li>`;

  const QUICKBAR_ELEMENT_HTML_TEMPLATE = `
          <li id="%QUICKLINK_ID%" class="quickbar_item">
            <span>
              <a class="quickbar_link" href="#">
                %QUICKLINK_DISPLAY_NAME%
              </a>
              <img height="14" width="14" src="https://dsde.innogamescdn.com/asset/88a8f29e/graphic/delete.png" alt="" class="cancel_link_icon">
            </span>
          </li>`;

  let quickLinks = [];

  const createQuickLinkElement = (quicklink, template) => {
    template = template.replace('%QUICKLINK_ID%', quicklink.id);
    template = template.replace('%QUICKLINK_DISPLAY_NAME%', quicklink.displayName);

    let templateElement = document.createElement('template');
    templateElement.innerHTML = template;

    return templateElement.content;
  }

  const DELETE_CLICK_HANDLER = (id) => {
    let element = document.getElementById(id);
    element.parentElement.removeChild(element);

    const index = quickLinks.findIndex(element => element.id == id);

    if (index === undefined) {
      return;
    }

    delete quickLinks[index];
    saveQuickLinks();
  }

  const ADD_CLICK_HANDLER = () => {
    let displayName = prompt('Display name:');

    if (displayName === null || displayName.length < 1) {
      UI.ErrorMessage('You must enter a display name for the script!');
      return;
    }

    let scriptLink = prompt('Script link:');

    if (scriptLink === null || scriptLink.length < 1) {
      UI.ErrorMessage('You must enter a link to a script!');
      return;
    }

    let link = new QuickLink(displayName, scriptLink);

    insertQuickLink(link);
    quickLinks.push(link);
    saveQuickLinks();

    UI.SuccessMessage('Quick link saved!');
  }

  const insertQuickLink = (quickLink) => {
    let element = createQuickLinkElement(quickLink, QUICKBAR_ELEMENT_HTML_TEMPLATE);

    document.getElementById(QUICKBAR_ADD_ELEMENT_ID).before(element);
    document.getElementById(quickLink.id).querySelector('a').onclick = () => {
      let script = document.createElement('script');
      script.src = quickLink.scriptLink;
      script.async = true;

      document.head.appendChild(script);
    };
    document.getElementById(quickLink.id).querySelector('.cancel_link_icon').onclick = () => DELETE_CLICK_HANDLER(quickLink.id);
  }

  const insertQuickLinks = (quicklinks) => {
    for (const quickLink of quicklinks) {
      insertQuickLink(quickLink);
    }
  }

  const saveQuickLinks = () => {
    localStorage.setItem(QUICKBAR_STORAGE_ID, JSON.stringify(quickLinks));
  }

  const loadQuickLinks = () => {
    let data = localStorage.getItem(QUICKBAR_STORAGE_ID);

    return data === null ? [] : JSON.parse(data);
  }

  const insertAddNewQuickLinkButton = () => {
    let quickLink = new QuickLink('Add script', '');
    let quickLinkElement = createQuickLinkElement(quickLink, QUICKBAR_ADD_ELEMENT_HTML_TEMPLATE);
    QUICKBAR_ELEMENT.appendChild(quickLinkElement);

    document.getElementById(QUICKBAR_ADD_ELEMENT_ID).onclick = ADD_CLICK_HANDLER;
  }

  quickLinks = loadQuickLinks();
  insertAddNewQuickLinkButton();

  insertQuickLinks(quickLinks);
})();