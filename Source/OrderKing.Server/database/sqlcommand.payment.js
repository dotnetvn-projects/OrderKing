var defineProperty = function define(name, value) {
    Object.defineProperty(exports, name, {
        value: value,
        enumerable: true
    });
};

//get payment method list
defineProperty('getPaymentMethods', `SELECT Id, PaymentMethod FROM PaymentMethod`);