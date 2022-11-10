export class VillageNoteTemplate {
    constructor(name, content) {
        this.id = Date.now();
        this.name = name;
        this.content = content;
    }
}