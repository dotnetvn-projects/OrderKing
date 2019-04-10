import { ItemContentType } from '../commons/enums/item-content-type';

export abstract class BaseItemModel {
    constructor(args) {
        this.id = args.id;
        this.name = args.name;
    }

    id: string;
    name: string;
}
