import { BaseItemModel } from '../base-item-model';
import { ItemContentType } from '../../commons/enums/item-content-type';

export class ProductItem extends BaseItemModel {
    constructor(args: ProductItem) {
        super(args);

        this.price = args.price;
        this.url = args.url;
    }

    url: string;
    price: number;
    description: string;
    thumbnailUrl: string;
    updatedDate: string;
    createdDate: string;
    contentType: ItemContentType;
}
