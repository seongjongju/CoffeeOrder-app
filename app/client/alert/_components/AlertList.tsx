'use client';
import { UserProps } from '@/app/types/members/member';
import { useAppSelector } from '@/store/hook';
import mascot from '@/public/images/mascot.png';
import React from 'react';

const AlertList = ({user}: UserProps) => {
    const alert = useAppSelector(state => state.alert.items); //알람 내역
    const userAlerts = alert.filter(al => al.userId === user?.userId); //해당 유저의 알림만 불러옴

    return (
        <>
            {
                userAlerts.length > 0 ? 
                (
                    <ul className='alert'>
                        {
                            userAlerts?.map((al) => (
                                <li 
                                    key={al.id}
                                    className='alert__li'
                                >
                                    <img
                                        className='alert__icon' 
                                        src={mascot.src} 
                                        alt="마스코트"
                                    />
                                    {al.text}
                                </li>      
                            ))
                        }
                    </ul>
                ) :
                (
                    <p className='alert-none-text'>알림 내역 없음</p>
                )
            }
        </>
    );
};

export default AlertList;