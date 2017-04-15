export class Todo {
    editing: Boolean;

    constructor(public rowId: number, public ordinal?: number, public name?: string, public done?: boolean) {
        this.editing = false;
    }
}
