// ==UserScript==
// @name         Dynamic quick link script loader
// @namespace    http://tampermonkey.net/
// @version      0.1
// @author       LegendaryB
// @match        https://*.die-staemme.de/game.php?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=die-staemme.de
// @grant        none
// ==/UserScript==

(async () => {
  'use strict';

  class QuickLink {
    id = undefined;
    title = undefined;
    script = undefined;

    constructor(title, script) {
      this.id = Date.now();
      this.title = title;
      this.script = script;
    }
  }

  const QUICKBAR_ELEMENT = document.querySelector('.menu.quickbar');
  const QUICKBAR_ADD_ELEMENT_ID = 'quickLinkAddButton';
  const QUICKBAR_STORAGE_ID = 'tw_dynamic_quicklinks';

  const QUICKBAR_ADD_ELEMENT_HTML_TEMPLATE = `
          <li id="${QUICKBAR_ADD_ELEMENT_ID}" class="quickbar_item">
            <span>
              <a class="quickbar_link" href="#">
                %QUICKLINK_TITLE%
              </a>
            </span>
          </li>`;

  const QUICKBAR_ELEMENT_HTML_TEMPLATE = `
          <li id="%QUICKLINK_ID%" class="quickbar_item">
            <span>
              <a class="quickbar_link" href="#">
                %QUICKLINK_TITLE%
              </a>
              <img height="14" width="14" src="https://dsde.innogamescdn.com/asset/88a8f29e/graphic/delete.png" alt="" class="cancel_link_icon">
            </span>
          </li>`;

  let quickLinks = [];

  const createQuickLinkElement = (quicklink, template) => {
    template = template.replace('%QUICKLINK_ID%', quicklink.id);
    template = template.replace('%QUICKLINK_TITLE%', quicklink.title);

    let templateElement = document.createElement('template');
    templateElement.innerHTML = template;

    return templateElement.content;
  }

  const DELETE_CLICK_HANDLER = (id) => {
    let element = document.getElementById(id);
    element.parentElement.removeChild(element);

    const index = array1.find(element => element.id == id);

    if (index === undefined) {
      return;
    }

    quickLinks[index] = null;
    saveQuickLinks();
  }

  const ADD_CLICK_HANDLER = () => {
    let title = prompt('Titel des Skripts in der Schnellleiste:');
    let script = prompt('Skript einfügen:');

    let quickLink = new QuickLink(title, script);

    insertQuickLink(quickLink);

    quickLinks.push(quickLink);
    saveQuickLinks();
  }

  const insertQuickLink = (quickLink) => {
    let element = createQuickLinkElement(quickLink, QUICKBAR_ELEMENT_HTML_TEMPLATE);

    document.getElementById(QUICKBAR_ADD_ELEMENT_ID).before(element);
    document.getElementById(quickLink.id).querySelector('a').onclick = () => {
      console.log(quickLink.script.replace('javascript: ', ''));
      eval(quickLink.script.replace('javascript: ', ''));
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

    if (data === null) {
      return [];
    }

    return JSON.parse(data);
  }

  const insertAddNewQuickLinkButton = () => {
    let quickLink = new QuickLink('Skript hinzufügen', '');
    let quickLinkElement = createQuickLinkElement(quickLink, QUICKBAR_ADD_ELEMENT_HTML_TEMPLATE);
    QUICKBAR_ELEMENT.appendChild(quickLinkElement);

    document.getElementById(QUICKBAR_ADD_ELEMENT_ID).onclick = ADD_CLICK_HANDLER;
  }

  quickLinks = loadQuickLinks();
  insertAddNewQuickLinkButton();

  insertQuickLinks(quickLinks);
})();