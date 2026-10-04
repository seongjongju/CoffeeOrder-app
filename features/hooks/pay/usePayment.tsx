'use client';
import { Item } from '@/app/types/pay/pay';
import { payCreateApi } from '@/features/clientApi/payApy';
import { useRouter } from 'next/navigation';
import React, { useCallback } from 'react';

interface UsePaymentProps {
    items: Item[];
    orderType: string;
};

const usePayment = (
    items: UsePaymentProps['items'], 
    orderType: UsePaymentProps['orderType'], 
) => {
    const router = useRouter();

    const addPayment = useCallback(async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        try {
            const data = await payCreateApi(items, orderType);

            if (data.status === "fail") {
                console.log(data.message);
                return;
            }
            console.log(data.message);
            router.push(`/client/pay/payment?orderId=${data.orderId}`);
            return;
        } catch (err: any) {
            console.error(err.response?.data?.message);
            alert(`${err.response?.data?.message}`);
            return;
        }
    }, [items, orderType, router]);

    return {
        addPayment
    }
};

export default usePayment;