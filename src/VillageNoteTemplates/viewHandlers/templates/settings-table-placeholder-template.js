import Translator from "../../translator";
import TemplateData from "./settings-template-data";

export const getTablePlaceholderRowHTML = () => {
    let template = `
        <tr id="${TemplateData.TABLE_PLACEHOLDER_ROW_ID}">
            <td colspan="3">
                <span>{{settings.noTemplatesAddedYet}}</span>
            </td>
        </tr>`

    return Translator.translate(template);
}