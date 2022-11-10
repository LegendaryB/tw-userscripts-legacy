import Translator from "../../translator";
import TemplateData from "./settings-template-data";

export const getTableHTML = () => {
    let template = `
        <br>
        <table class="vis settings" width="100%">
            <tbody>
                <tr>
                    <th colspan="2">
                        {{settings.header}}
                        <a href="#" target="_blank"><span title="{{settings.infoTooltip}}" style="float: right;" class="icon info-med sitter_details"></span></a>
                    </th>
                </tr>
                <tr>
                    <td colspan="2">
                        <table id="${TemplateData.TABLE_ID}" class="vis settings" width="100%">
                            <tbody>
                            </tbody>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td colspan="2" style="padding: 4px;">
                        <input id="${TemplateData.SAVE_BUTTON_ID}" class="btn" type="button" value="{{settings.saveButton}}">
                        <input id="${TemplateData.CREATE_BUTTON_ID}" class="btn" type="button" value="{{settings.createButton}}">

                        <div style="float: right;">
                            <input id="${TemplateData.IMPORT_BUTTON_ID}" class="btn" type="button" value="{{settings.importButton}}">
                            <input id="${TemplateData.EXPORT_BUTTON_ID}" class="btn" type="button" value="{{settings.exportButton}}">
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
        <br>`

    return Translator.translate(template);
}