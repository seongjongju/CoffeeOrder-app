'use client';
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import '@/shared/client/styled/order/order.css';
import useOrderQuery from '@/features/hooks/query/useOrderQuery';
import OrderHistoryItem from '../../order/order_history/_components/OrderHistoryItem';
import { UserProps } from '@/app/types/members/member';

const LatelyOrder = ({user}: UserProps) => {
    const {orders} = useOrderQuery();
    const userOrders = orders.filter(order => order.userId === user?.userId);
    const directOrder = userOrders.filter(order => order.items.length === 1); //단일상품만

    //중복 처리
    const uniqueOrders: (typeof userOrders[0])[] = [];

    directOrder.forEach(order => {
        const item = order.items[0];

        const currentOptions = JSON.stringify(item.addPrice || []);

        const isExist = uniqueOrders.some(addedOrder => {
            const addedItem = addedOrder.items[0];
            const addedOptions = JSON.stringify(addedItem.addPrice || []);

            return (
            addedItem.productCode === item.productCode &&
            addedOptions === currentOptions
            );
        });

        if (!isExist) {
            uniqueOrders.push(order);
        }
    });

    return (
        <>
            {
                uniqueOrders.length > 0 &&
                (
                    <div className='inner'>
                        <h2 className='main-title'>최근 주문한 메뉴!!</h2> 
                    </div>
                )   
            }
            <Swiper
                spaceBetween={12}
                slidesPerView={1.3}
                speed={1200}
                style={{
                    marginBottom: '20px'
                }}
            >
                {
                    uniqueOrders.slice(0, 9).map((item) => {
                        return (
                            <SwiperSlide
                                key={item.orderId}
                            >
                                <OrderHistoryItem 
                                    key={item._id}
                                    item={item}
                                />
                            </SwiperSlide>
                        )
                    })
                }
            </Swiper>
        </>
    );
};

export default LatelyOrder;