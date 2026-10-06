'use client';
import { Item } from '@/app/types/pay/pay';
import { payCreateApi } from '@/features/clientApi/payApy';
import { useRouter } from 'next/navigation';
import React from 'react';

interface UsePaymentProps {
    items: Item[];
    orderType: string;
};

const usePayment = (
    items: UsePaymentProps['items'], 
    orderType: UsePaymentProps['orderType'], 
) => {
    const router = useRouter();

    const addPayment = async (e: React.MouseEvent<HTMLButtonElement>) => {
        console.log("주문서생성 시작");

        e.preventDefault();
        try {
            const data = await payCreateApi(items, orderType);

            console.log(
                "items:", items,
                "orderType:", orderType
            );

            if (data.status === "fail") {
                return;
            }
            router.push(`/client/pay/payment?orderId=${data.orderId}`);
            return;
        } catch (err: any) {
            console.error(err.response?.data?.message);
            alert(`${err.response?.data?.message}`);
            return;
        }
    };

    return {
        addPayment
    }
};

export default usePayment;