import TemplateData from "./templates/settings-template-data";
import Translator from '../translator';

import ConfigurationStore from "../configurationStore";

import { getTableHTML } from "./templates/settings-table-template";
import { getTablePlaceholderRowHTML } from "./templates/settings-table-placeholder-template";
import { getTableItemHTML } from "./templates/settings-table-item-template";
import { getTablePreviewRowHTML } from "./templates/settings-table-preview-template";

import { VillageNoteTemplate } from "../villageNoteTemplate";
import { TemplateProcessor } from "../templateProcessing/templateProcessor";

const TABLE_ANCHOR_ELEMENT_ID = 'dialog-sync-show';

class SettingsViewHandler {
    constructor(configuration) {
        this.configuration = configuration;
        this.createElements();
    }

    createElements = () => {
        const table = getTableHTML();
        const element = this.createTemplateElement(table);

        document.getElementById(TABLE_ANCHOR_ELEMENT_ID)
            .parentElement
            .after(element.content);

        if (this.configuration.templates.length === 0) {
            this.addPlaceholderTableRow();
        }
        else {
            this.loadTemplates();
        }

        this.addEventHandlers();
    }

    getTableBodyElement = () => {
        let table = document.getElementById(TemplateData.TABLE_ID);
        let tableBody = table.querySelector('tbody');

        return tableBody;
    }

    createAndAppendToTableBody = (context, factory) => {
        const element = factory(context);
        const templateElement = this.createTemplateElement(element);

        let tableBody = this.getTableBodyElement();
        tableBody.appendChild(templateElement.content);
    }

    addTableItem = (item) => {
        this.createAndAppendToTableBody(item, getTableItemHTML);

        this.addPreviewEventHandler(item.id);
        this.addDeleteEventHandler(item.id);
        this.removePlaceholderTableRow();
    }

    addPlaceholderTableRow = () =>
        this.createAndAppendToTableBody(null, getTablePlaceholderRowHTML);

    addPreviewTableRow = (preview) =>
        this.createAndAppendToTableBody(preview, getTablePreviewRowHTML);

    removePlaceholderTableRow = () => 
        this.removeTableRow(TemplateData.TABLE_PLACEHOLDER_ROW_ID);

    removePreviewTableRow = () =>
        this.removeTableRow(TemplateData.TABLE_PREVIEW_ROW_ID);

    removeTableRow = (elementId) => {
        let row = document.getElementById(elementId);

        if (row !== null) {
            row.remove();
        }
    }

    addItemButtonEventHandler = (prefix, id, fn) => {
        id = `${prefix}${id}`;

        let btn = document.getElementById(id);
        btn.onclick = () => fn(id);
    }

    addPreviewEventHandler = (id) => 
        this.addItemButtonEventHandler(TemplateData.PREVIEW_BUTTON_ID_PREFIX, id, this.previewTemplate);

    addDeleteEventHandler = (id) => 
        this.addItemButtonEventHandler(TemplateData.DELETE_BUTTON_ID_PREFIX, id, this.deleteTemplate);

    createTemplate = () => {
        let templateName = prompt(Translator.getText("settings.createButtonDialogText"));

        if (templateName === null || templateName.length < 1) {
            UI.ErrorMessage(Translator.getText("settings.createButtonErrorText"));
            return;
        }

        let template = new VillageNoteTemplate(
            templateName, 
            '');

        this.removePreviewTableRow();
        this.configuration.templates.push(template);
        this.addTableItem(template);
    }

    previewTemplate = async (elementId) => {
        let templateId = elementId.replace(TemplateData.PREVIEW_BUTTON_ID_PREFIX, '');

        let templateTableRow = document.getElementById(elementId);
        let previewTableRow = document.getElementById(TemplateData.TABLE_PREVIEW_ROW_ID);

        if (!templateTableRow) {
            return
        }

        if (previewTableRow) {
            previewTableRow.remove();
        }

        let templateInputElement = document.getElementById(`${TemplateData.NOTE_TEMPLATE_INPUT_ID_PREFIX}${templateId}`);

        if (!templateInputElement) {
            return;
        }

        let preview = await TemplateProcessor.process(templateInputElement.value);
        this.addPreviewTableRow(preview);
    }

    deleteTemplate = (elementId) => {
        let templateId = elementId.replace(TemplateData.DELETE_BUTTON_ID_PREFIX, '');
        this.configuration.templates = this.configuration.templates.filter(t => t.id != templateId);

        document.getElementById(elementId).closest('tr').remove();
        this.removePreviewTableRow();

        if (this.configuration.templates.length === 0) {
            this.addPlaceholderTableRow();
        }
    }

    loadTemplates = () => {
        for (let template of this.configuration.templates) {
            debugger;
            this.addTableItem(template);
        }
    }

    saveTemplates = () => {
        for (let template of this.configuration.templates) {
            let inputElement = document.getElementById(`${TemplateData.NOTE_TEMPLATE_INPUT_ID_PREFIX}${template.id}`);

            if (!inputElement) {
                continue;
            }

            template.content = inputElement.value;
        }

        ConfigurationStore.save(this.configuration);
    }

    addEventHandlers = () => {
        document.getElementById(TemplateData.CREATE_BUTTON_ID).onclick = this.createTemplate;
        document.getElementById(TemplateData.SAVE_BUTTON_ID).onclick = this.saveTemplates;
    }

    createTemplateElement = (innerHTML) => {
        let element = document.createElement('template');
        element.innerHTML = innerHTML;

        return element;
    }
}

export const useSettingsViewHandler = (configuration) => new SettingsViewHandler(configuration);