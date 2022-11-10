
class VillageViewHandler {
    constructor(configuration) {
        this.configuration = configuration;
    }
}

export const useVillageViewHandler = (configuration) => new VillageViewHandler(configuration);