import { Configuration } from "./configuration";

const CONFIG_STORAGE_KEY = 'tw_villageNoteTemplates';

class ConfigurationStore {
    load() {
        let data = localStorage.getItem(CONFIG_STORAGE_KEY);

        return data === null ?
            new Configuration({templates: []}) :
            new Configuration(JSON.parse(data));
    }

    save(config) {
        let data = JSON.stringify(config);
        localStorage.setItem(CONFIG_STORAGE_KEY, data);
    }
}

export default new ConfigurationStore();