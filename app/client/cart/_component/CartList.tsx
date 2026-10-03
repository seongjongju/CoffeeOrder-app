'use client';
import useCartQuery from '@/features/hooks/query/useCartQuery';
import React, { useCallback, useMemo, useState } from 'react';
import CartItem from './CartItem';
import { useQueryClient } from '@tanstack/react-query';
import { allDeleteCartApi } from '@/features/clientApi/cartApi';
import useModalShow from '@/features/hooks/modal/useModalShow';
import Modal from '@/shared/client/components/modal/Modal';
import CartItemNone from './CartItemNone';
import { useAppSelector } from '@/store/hook';
import { formatPrice } from '@/app/util/format';
import usePayment from '@/features/hooks/pay/usePayment';
import useLoading from '@/features/hooks/loading/useLoading';
import { UserProps } from '@/app/types/members/member';

const CartList = ({user}: UserProps) => {
    const {isLoading, setIsLoading} = useLoading();
    const { modalShow, setModalShow, modalText, setModalText } = useModalShow();
    const { carts } = useCartQuery(); //카트 전체 조회
    const userCarts = carts.filter(cart => cart.userId === user?.userId); //로그인 된 유저의 장바구니 목록

    //결제 커스텀 훅
    const {addPayment} = usePayment(userCarts, "cart");

    //장바구니 전체 삭제 핸들러
    const queryClient = useQueryClient();
    const allDeleteCartItem = useCallback(async (e:React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        try {
            setIsLoading(true);

            await allDeleteCartApi(user.userId);
            queryClient.invalidateQueries({ queryKey: ['carts'] });
            return;
        } catch(err: any) {
            console.error(err.response?.data?.message);
            setModalShow(true);
            setModalText(err.response?.data?.message);
            return;
        } finally {
            setIsLoading(false);
        }
    }, [userCarts, queryClient]);

    //총 결제 금액
    const {count, price} = useMemo(() => {
        const count = userCarts.map(item => item.totalCount).reduce((acc, cur) => acc + cur, 0);
        const price = userCarts.map(item => item.totalPrice).reduce((acc, cur) => acc + cur, 0);

        return {count, price}
    }, [userCarts, queryClient]);
    
    return (
        <div className={`inner cart-inner ${userCarts.length === 0 ? "cart-null" : ""}`}>
            {
                userCarts.length === 0 ?
                (
                    <CartItemNone />
                ) :
                (
                    <>
                        <button 
                            className='cart-reset'
                            onClick={allDeleteCartItem}
                        >
                            장바구니 비우기
                        </button>

                        <div className='cart'>
                            {
                                userCarts.map((item) => (
                                    <CartItem 
                                        key={item._id}
                                        cartItem={item}
                                        setIsLoading={setIsLoading}
                                    />
                                ))
                            }
                        </div>
                        
                        <button 
                            style={{
                                cursor: isLoading ? "not-allowed" : "pointer",
                                pointerEvents: isLoading ? "none" : "auto", 
                                marginTop: "10px"
                            }} 
                            className='common-button' 
                            onClick={addPayment}
                        >
                            {
                                isLoading ? 
                                (
                                    <div className='dots'>
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </div>  
                                ) :
                                (
                                    <>
                                        주문하기 <span className='totla-length'>총 {count}개 {formatPrice(price)}원</span>
                                    </>
                                )
                            }
                        </button>
                    </>
                )
            }
            
            {
                modalShow &&
                <Modal 
                    modalText={modalText}
                    modalShow={modalShow}
                    setModalText={setModalText}
                    setModalShow={setModalShow}
                />
            }
        </div>
    );
};

export default CartList;