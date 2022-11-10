import * as TranslationProviders from "./i18n"

class Translator {
    #translations;

    constructor() {
        this.#translations = this.#getTranslationProvider();
    }

    #getTranslationProvider = () => {
        let provider = TranslationProviders[navigator.language];
        provider = provider || TranslationProviders['en']; 

        return provider;
    }

    #handlebarToKey = (handlebar) => {
        return handlebar.replace('{{', '').replace('}}', '');
    }

    getText = (key) => {
        let propertyNames = key.split('.');
        let translation = propertyNames.reduce((prev, curr) => prev && prev[curr], this.#translations);

        return translation;
    }

    translate = (data) => {
        let handlebars = data.match(/{{{?(#[a-z]+ )?[a-z]+.[a-z]*}?}}/gi);

        for (const handlebar of handlebars) {
            let key = this.#handlebarToKey(handlebar);
            let translatedValue = this.getText(key);
    
            data = data.replace(handlebar, translatedValue);
        }
    
        return data;
    }
}

export default new Translator();

/*
export const translate = (data) => {
    let language = getLanguage();
    let translationProvider = language === 'de' ? de : en;

    let handlebars = data.match(/{{{?(#[a-z]+ )?[a-z]+.[a-z]*}?}}/gi);

    for (const handlebar of handlebars) {
        let key = getTranslationKey(handlebar);
        let value = getTranslationByKey(translationProvider, key);

        data = data.replace(handlebar, value);
    }

    return data;
}
*/