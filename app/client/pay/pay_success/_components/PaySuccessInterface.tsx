'use client';
import { addToAlert } from '@/store/alert/alertSlice';
import { useAppDispatch } from '@/store/hook';
import { useSearchParams, useRouter } from 'next/navigation';
import Button from '@/shared/client/components/button/Button';
import check from '@/public/icons/circle_check.svg';
import Image from 'next/image';
import CancelButton from '@/shared/client/components/button/CancelButton';
import React, { useEffect, useRef } from 'react';
import { UserProps } from '@/app/types/members/member';

const PaySuccessInterface = ({user}: UserProps) => {
    const router = useRouter();
    const dispatch = useAppDispatch();

    const searchParams = useSearchParams();
    const productName = searchParams.get('productName');
    const userId = searchParams.get('userId');
    const isNotificationSent = useRef(false);

    useEffect(() => {
        if(user.userId !== userId) return;
        
        // 중복 실행 방지
        if (isNotificationSent.current) return;

        if ('Notification' in window && Notification.permission === 'granted') {
            isNotificationSent.current = true;

            // 1차 알림: 즉시 실행
            new Notification('주문 완료', {
                body: `${productName} 주문이 완료되었습니다.`,
                icon: '/icons/icon-192.png',
            });

            //알람 내역에 추가
            dispatch(addToAlert({
                userId: userId,
                text: `${productName} 주문이 완료되었습니다.`,
            }));

            // 2차 알림: 5초 뒤 실행
            setTimeout(() => {
                new Notification('픽업 안내', {
                    body: `${productName} 준비되었습니다! 픽업해 주세요.`,
                    icon: '/icons/icon-192.png',
                });

                //알람 내역에 추가
                dispatch(addToAlert({
                    userId: userId,
                    text: `${productName} 준비되었습니다! 픽업해 주세요.`,
                }));
            }, 5000);
        }
    }, [user, userId, productName, dispatch]);

    const goToHome = (e:React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        router.push('/');
    };

    const goToOrderHistory = (e:React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        router.push('/client/order/order_history');
    };

    return (
        <div className='pay-success'>
            <div className='pay-success__wrap'>
                <p className='pay-success__text'>결제가 완료되었습니다!!</p>
                <Image src={check} alt="체크" />
            </div>
            <div className='pay-success__btns'>
                <Button 
                    buttonText="홈으로 이동"
                    onClick={goToHome}
                />
                <CancelButton 
                    buttonText="주문내역으로 이동"
                    onClick={goToOrderHistory}
                />
            </div>
        </div>
    );
};

export default PaySuccessInterface;