import TemplateData from "./settings-template-data";

export const getTablePreviewRowHTML = (preview) => {
    let template = `
        <tr id="${TemplateData.TABLE_PREVIEW_ROW_ID}">
            ${preview}
        </tr>`

    return template;
}