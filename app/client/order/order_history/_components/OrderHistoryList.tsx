'use client';
import useOrderQuery from '@/features/hooks/query/useOrderQuery';
import React from 'react';
import OrderHistoryItem from './OrderHistoryItem';
import OrderItemNone from './OrderItemNone';
import { UserProps } from '@/app/types/members/member';

const OrderHistoryList = ({user}: UserProps) => {
    const {orders} = useOrderQuery();
    const userOrders = orders.filter(order => order.userId === user?.userId);

    return (
        <div className={`inner ${userOrders.length === 0 ? "order-null" : ""}`}>
            {
                userOrders.length > 0 ?
                (
                    <ul style={{paddingBottom: "20px"}}>
                        {
                            userOrders.map((item) => {
                                return (
                                    <OrderHistoryItem 
                                        key={item._id}
                                        item={item}
                                    />
                                )
                            })
                        }
                    </ul>
                ) : 
                (
                    <OrderItemNone />
                )
            }
        </div>
    );
};

export default OrderHistoryList;