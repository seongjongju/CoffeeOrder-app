'use client';
import { formatPrice } from '@/app/util/format';
import { useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import { Item, paymentData } from '@/app/types/pay/pay';
import useConfilmShow from '@/features/hooks/confirm/useConfilmShow';
import Confirm from '@/shared/client/components/confirm/Confirm';
import useLoading from '@/features/hooks/loading/useLoading';
import LoadingSpiner from '@/shared/client/components/loading/LoadingSpiner';

interface paymentInterfaceProps {
    paymentData: paymentData;
};

const PayInterface = ({paymentData}: paymentInterfaceProps) => {
    const {isLoading, setIsLoading} = useLoading();
    const {confilmShow, setConfilmShow, confilmText, setConfilmText} = useConfilmShow();

    //결제
    const handlePay = async () => {
        try{
            setIsLoading(true);

            //제품이 2개 이상일 때 제품명 파라미터
            const payProductName = paymentData?.items.length > 1 ? 
                            `${paymentData.items[0].productName} 외 ${paymentData.items.length - 1}개` :
                            paymentData.items[0].productName;

            if(typeof window !== "undefined" ) {
                const pay_obj : any = window ;
                const { AUTHNICE } = pay_obj

                AUTHNICE.requestPay({
                    clientId: process.env.NEXT_PUBLIC_NICEPAY_CLIENT_ID,
                    method: 'card',
                    orderId: paymentData.orderId,
                    orderType: paymentData.orderType,
                    amount: paymentData.amount,
                    goodsName: payProductName,
                    notificationUrl: `${process.env.NEXT_PUBLIC_FRONT_API_URL}/api/pay/pay_webhook`,
                    returnUrl: `${process.env.NEXT_PUBLIC_FRONT_API_URL}/api/pay/pay_approve`, //API를 호출할 Endpoint 입력
                    fnError: function (result: any) {
                        alert('고객용메시지 : ' + result.errorMsg + '\n개발자확인용 : ' + result.msg);
                        setIsLoading(false);
                    }
                });
            }

            return;
        }catch(err: any) {
            console.error(err.response?.data?.message);
            setIsLoading(false);
            return;
        } 
    };

    //결제 취소
    const handlePayCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        setConfilmShow(true);
        setConfilmText("정말 결제를 취소하시겠습니까? 취소하시면 진행 중이던 주문이 초기화되어 처음부터 다시 결제를 진행하셔야 합니다.");
    };

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                minHeight: "calc(100vh - 100px)"
            }}
        >
            {
                paymentData.items.map((item: Item) => (
                    <div 
                        key={item._id}
                        className='order__item'
                    >
                        <p className='order__heading'>주문정보</p>
                        <div className='order__product'>
                            <p className='text-body'>{item.productName}</p>
                            <p className='text-body'>{item.price}원 x {item.totalCount}</p>
                        </div> {/* .order__product : end */}
                        
                        {
                            item.addPrice.find((option) => option.count > 0) || item.lightly ?
                            (
                                <>
                                    <p className='order__heading'>선택옵션</p>
                                    <ul className='order__list'>
                                        <li className='order__li'>
                                            <p className='text-body'>
                                                {
                                                    item.lightly ? "연하게" : ""
                                                }
                                            </p>
                                        </li> {/* .order__li : end */}
                                        {
                                            item.addPrice.map((option) => {
                                                if(option.count === 0) return;

                                                return(
                                                    <li 
                                                        key={option.id}
                                                        className='order__li'
                                                    >
                                                        <p className='text-body'>{option.label}</p>
                                                        <p className='text-body'>{`500 x ${option.count}`}</p>
                                                    </li> 
                                                )
                                            })
                                        }
                                    </ul> {/* .order__list : end */}
                                </>                                
                            ) : 
                            null
                        }
                        <div className='order__total'>
                            <p className='text-body'>총 금액</p>
                            <p className='order__total-price'>{formatPrice(item.totalPrice)}원</p>
                        </div> {/* .order__total : end */}
                    </div>
                ))
            }

            <div className='pay-btns'>
                <button 
                    className='common-button pay-btn'
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                        e.preventDefault();
                        handlePay()
                    }}
                >
                    <span>최종 결제 금액 : </span>{formatPrice(paymentData.amount)}원 <span>결제하기</span>
                </button>
                <button 
                    className='common-cancel-button'
                    onClick={handlePayCancel}
                >
                    취소
                </button>
            </div> {/* .pay-btns  :end */}

            {
                confilmShow &&
                (
                    <Confirm 
                        confilmShow={confilmShow}
                        setConfilmShow={setConfilmShow}
                        confilmText={confilmText}
                        setConfilmText={setConfilmText}
                        orderId={paymentData.orderId}
                    />
                )
            }

            {
                isLoading &&
                (
                    <LoadingSpiner 
                        isLoading={isLoading}
                    />
                )
            }
        </div>
    );
};

export default PayInterface;