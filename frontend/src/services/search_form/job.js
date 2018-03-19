export class Job {
    constructor(rome, label, slug, searchTerm) {
        this.rome = rome;
        this.label = label;
        this.slug = slug;
        this.searchTerm = searchTerm;
    }

    isValid() {
        return this.rome !== undefined && this.label !== undefined && this.slug !== undefined;
    }
}