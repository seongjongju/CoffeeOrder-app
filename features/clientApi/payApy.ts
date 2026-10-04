import { Item } from "@/app/types/pay/pay";
import { api, api_1 } from "./base";

//주문서 생성
export const payCreateApi = async (orderItems: Item[], orderType: string) => {
    const res = await api.post('/pay/pay_create',
        {
            orderItems,
            orderType
        }
    );

    const data = await res.data;
    return data;
};

//주문서 불러오기
export const payGetApi = async (orderId: string) => {
    const res = await api_1.get(`/pay/get_pay?orderId=${orderId}`);

    const data = await res.data;
    return data;
};

//결제 취소
export const payCancelApi = async (orderId: string) => {
    const res = await api.patch('/pay/cancel_pay',
        {
            orderId
        }
    );

    const data = await res.data;
    return data;
};