import { BaseItemModel } from '../base-item-model';

export class ProductItem extends BaseItemModel {
    constructor(args: ProductItem) {
        super(args);

        this.price = args.price;
        this.url = args.url;
        this.thumbnailUrl = args.thumbnailUrl;
        this.updatedDate = args.updatedDate;
        this.createdDate= args.createdDate;
        this.description=args.description;
    }

    url: string;
    price: number;
    description: string;
    thumbnailUrl: string;
    updatedDate: string;
    createdDate: string;
}
