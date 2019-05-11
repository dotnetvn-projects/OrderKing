export class OrderItem {
    constructor(args: OrderItem) {
        this.price = args.price;
        this.productId = args.productId;
        this.productName = args.productName;
        this.totalPrice = args.totalPrice;
        this.quantity = args.quantity;
        this.productImageUrl = args.productImageUrl;
    }

    productId: String;
    productName: String;
    productImageUrl: String;
    price: number;
    totalPrice: number;
    quantity: number;
}
