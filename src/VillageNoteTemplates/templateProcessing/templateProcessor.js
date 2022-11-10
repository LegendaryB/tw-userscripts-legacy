export class TemplateProcessor {
    static #findTemplatePlaceholders = (template) => {
        return template.match(/%\w+%/g) || [];
    }

    static #buildTemplatePreviewURL = () => {
        let url = new URL(window.location.href);
        url.search = '';

        url.searchParams.append('village', game_data.village.id);
        url.searchParams.append('screen', 'mail');
        url.searchParams.append('mode', 'new');
        url.searchParams.append('action', 'send');

        return url.toString();
    }

    static async #fetchTemplatePreviewPage(template) {
        let requestURL = this.#buildTemplatePreviewURL();

        let formData = new FormData();
        formData.append('to', '');
        formData.append('subject', '');
        formData.append('text', template);
        formData.append('extended', '0');
        formData.append('preview', 'Vorschau');
        formData.append('h', game_data.csrf);

        const response = await fetch(requestURL, {
            method: 'POST',
            body: formData
        });

        return await response.text();
    }

    static #getTemplatePreview = (templatePreviewPage) => {
        let domParser = new DOMParser();
        let doc = domParser.parseFromString(templatePreviewPage, 'text/html');

        let templatePreviewTable = doc.getElementById('igm_affront_hint')
            .nextElementSibling
            .nextElementSibling;

        let templatePreviewElement = templatePreviewTable.querySelector('tr');

        return templatePreviewElement.innerHTML.replace('colspan="2"', 'colspan="3"');
    }

    static async process(template) {
        debugger;
        let templatePreviewPage = await this.#fetchTemplatePreviewPage(template);
        template = this.#getTemplatePreview(templatePreviewPage);
        
        
        return template;
    }
}