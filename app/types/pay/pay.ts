export interface Item {
    _id: string;
    userId: string;
    userName: string;
    productName: string;
    productCode: string;
    price: string;
    lightly: boolean;
    addPrice: Array<{
        id: string;
        count: number;
        label: string;
    }>;
    totalPrice: number;
    totalCount: number;
    usedInventorys: Array<{
        _id: string;
        inventoryName: string;
        category: string;
        quantity: number;
    }>;
    img: {
        format: string;
        imgName: string;
        publicId: string;
    };
};

export type paymentData = {
    userId: string;
    userName: string;
    orderType: string;
    amount: number;
    productName: string;
    createAt: string;
    items: Item[];
    orderId: string;
    status: string;
    _id: string;
};