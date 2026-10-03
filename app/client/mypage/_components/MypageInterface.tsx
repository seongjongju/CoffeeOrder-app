'use client';
import Image from 'next/image';
import Link from 'next/link';
import logo from '@/public/images/logo.svg';
import linkArrow from '@/public/icons/mypage_link_arrow.png';
import React from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hook';
import useModalShow from '@/features/hooks/modal/useModalShow';
import Modal from '@/shared/client/components/modal/Modal';
import { logoutApi } from '@/features/clientApi/authApi';
import { logout } from '@/store/auth/authSlice';
import { formatPhoneNumber } from '@/app/util/format';
import { allDeleteAlert } from '@/store/alert/alertSlice';
import { UserProps } from '@/app/types/members/member';

const MypageInterface = ({user}: UserProps) => {
    const {modalShow, setModalShow, modalText, setModalText} = useModalShow();
    const dispatch = useAppDispatch();

    const handleClickLogout = async () => {
        try{
            const data = await logoutApi();
            
            setModalShow(true);
            if(!data.success) {
                setModalText(data.message);
                return;
            };

            setModalText(data.message);   
            dispatch(allDeleteAlert());
            return;
        } catch(error: any) {
            console.error(error.response?.data?.message);
            setModalText(`${error.response?.data?.message}`);
            setModalShow(true);
            return;
        }
    };

    return (
        <section className='section'>
            <div className='mypage-user'>
                <Image src={logo} alt='로고' />
                <p className='mypage-name'>{user?.userName} 님</p>
            </div>
            <div className='inner'>
                <p className='mypage-link'>ID. {user?.userId}</p>
                <p className='mypage-link'>TEL. {formatPhoneNumber(user?.phoneNumber)}</p>
                <p className='mypage-link'>EMAIL. {user?.email}</p>
                <Link
                    className='mypage-link'
                    href={'/client/user_find/password_find'}
                >
                    비밀번호 재설정
                    <Image src={linkArrow} alt="링크 이동 화살표" />
                </Link>
                <button
                    className='mypage-link'
                    onClick={handleClickLogout}
                >
                    로그아웃
                    <Image src={linkArrow} alt="링크 이동 화살표" />
                </button>
            </div>

            {
                modalShow && 
                <Modal 
                    modalShow={modalShow}
                    setModalShow={setModalShow}
                    modalText={modalText}
                    setModalText={setModalText}
                />
            }
        </section>
    );
};

export default MypageInterface;