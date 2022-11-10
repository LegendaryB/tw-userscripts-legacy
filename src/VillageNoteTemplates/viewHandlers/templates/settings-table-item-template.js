import Translator from "../../translator";
import TemplateData from "./settings-template-data";

export const getTableItemHTML = (item) => {
    let template = `
        <tr>
            <td>${item.name}</td>
            <td><textarea id="${TemplateData.NOTE_TEMPLATE_INPUT_ID_PREFIX}${item.id}" placeholder="{{settings.templateInputPlaceholder}}" rows="1" class="input-nicer" style="width: 100%;">${item.content}</textarea></td>
            <td>
                <div style="float: right;">
                    <img id="${TemplateData.PREVIEW_BUTTON_ID_PREFIX}${item.id}" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAABhWlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV9TpUUqCnYQEclQnSyIFnGUKhbBQmkrtOpgcumH0KQhSXFxFFwLDn4sVh1cnHV1cBUEwQ8QRycnRRcp8X9JoUWMB8f9eHfvcfcOEBoVpppdE4CqWUY6ERdz+RUx8IoARhBEP2ISM/VkZiELz/F1Dx9f76I8y/vcn6NXKZgM8InEs0w3LOJ14ulNS+e8TxxmZUkhPiceN+iCxI9cl11+41xyWOCZYSObniMOE4ulDpY7mJUNlThGHFFUjfKFnMsK5y3OaqXGWvfkLwwVtOUM12kOI4FFJJGCCBk1bKACC1FaNVJMpGk/7uEfcvwpcsnk2gAjxzyqUCE5fvA/+N2tWZyadJNCcaD7xbY/RoHALtCs2/b3sW03TwD/M3Cltf3VBjDzSXq9rUWOgL5t4OK6rcl7wOUOMPikS4bkSH6aQrEIvJ/RN+WBgVugZ9XtrbWP0wcgS10t3QAHh8BYibLXPN4d7Ozt3zOt/n4AqZdyvU7YVmAAAAAGYktHRAC6AI8Af4nnm9oAAAAJcEhZcwAALiMAAC4jAXilP3YAAAAHdElNRQfmBx4IFRu97NDDAAAAGXRFWHRDb21tZW50AENyZWF0ZWQgd2l0aCBHSU1QV4EOFwAAAGtJREFUOMvd07ENgEAIheFfZTA3k8EsvETXsHARbYy54kLuwMJI9Rq+hADwtRqepKyMHCzsHqjLoPNOG6AocxTCA1pQE1gDVYEtkAl6oCLYv3VH4ugpjiZRoAWqWr9EAQtyvUgOJWBCSfyiLmeWKy5sz4b8AAAAAElFTkSuQmCC" style="cursor: pointer;" alt="{{settings.previewTemplateAltText}}" title="{{settings.previewTemplateTooltip}}" class="cancel_link_icon">
                    <img id="${TemplateData.DELETE_BUTTON_ID_PREFIX}${item.id}" src="https://dsde.innogamescdn.com/graphic/delete.png" title="{{settings.deleteTemplateTooltip}}" style="cursor: pointer;" alt="{{settings.deleteTemplateAltText}}" class="cancel_link_icon">
                </div>
            </td>
        </tr>`;

    return Translator.translate(template);
}