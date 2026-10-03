import React from 'react';
import '@/shared/client/styled/order/order.css';
import OrderHistoryList from './_components/OrderHistoryList';
import { getUser } from '@/features/serverApi/userApi';

const OrderHistoryPage = async () => {
    const user = await getUser();

    return (
        <main className='main order-main'>
            {
                user &&
                (
                    <OrderHistoryList 
                        user={user}
                    />
                )
            }
        </main>
    );
};

export default OrderHistoryPage;