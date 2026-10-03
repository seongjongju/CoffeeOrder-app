'use client';
import Image from 'next/image';
import BackIco from '@/public/icons/back_ico.png';
import logo from '@/public/images/logo.svg';
import cart from '@/public/images/cart.svg';
import alertIcon from '@/public/images/alert.svg';
import menu from '@/public/images/menu.svg';
import React, { useState } from 'react';
import "../_styled/inc.css";
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { getTitle } from '@/app/util/client/get.header.title';
import Link from 'next/link';
import CategorySideGnb from '@/shared/client/components/side/CategorySideGnb';
import useCartQuery from '@/features/hooks/query/useCartQuery';
import { useAppSelector } from '@/store/hook';
import { UserProps } from '@/app/types/members/member';

const Header = ({user}: UserProps) => {
    const [categorySideOn, setCategorySideOn] = useState<boolean>(false); //사이드 gnb (카테고리)
    const {carts} = useCartQuery() // 장바구니 리액트쿼리 커스텀 훅
    
    const alert = useAppSelector(state => state.alert.items); //알람 내역
    const userAlerts = alert.filter(al => al.userId === user?.userId); //해당 유저의 알림만 불러옴

    const pathName = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();

    const userCarts = user ? carts.filter(cart => cart.userId === user.userId) : undefined; //로그인 된 유저의 장바구니 목록

    return (
        <>
            <header
                className={
                    pathName === "/client/intro" || 
                    pathName === "/client/auth/sign_up_success" ||
                    pathName === "/client/pay/pay_fail" ||
                    pathName === "/client/pay/pay_success" ? 
                    "none" : ""
                }
            >
                {
                    pathName === "/" ? 
                    (
                        <div 
                            className='app-bar-container'
                            style={{
                                justifyContent: "space-between"
                            }}
                        >
                            <Link href={'/'} >
                                <img src={logo.src} alt='로고' />
                            </Link>
                            <div className='header-util'>
                                <Link href={'/client/cart'} style={{ position: "relative" }}>
                                    <span className='quantity'>{userCarts?.length}</span>
                                    <Image src={cart} alt='장바구니' />
                                </Link>
                                <Link
                                    style={{ position: "relative" }}
                                    href={'/client/alert'}
                                >
                                    <span 
                                        style={{ background: "#ff0000" }}
                                        className='quantity'
                                    >
                                        {userAlerts.length}
                                    </span>
                                    <img src={alertIcon.src} alt='알림' />
                                </Link>
                                <button
                                    onClick={(e:React.MouseEvent<HTMLButtonElement>) => {
                                        e.preventDefault();
                                        setCategorySideOn(true);
                                    }}
                                >
                                    <img src={menu.src} alt='메뉴'/>
                                </button>
                            </div>
                        </div>
                    ) : 
                    (
                        <div className='app-bar-container'
                            style={{
                                justifyContent: "space-between"
                            }}
                        >   
                            {
                                pathName.includes('/payment') ? 
                                (
                                    <div></div>
                                ) :
                                (
                                    <button 
                                        className='back-button'
                                        onClick={() => {
                                            if(pathName === '/client/order/order_history') {
                                                router.push('/');
                                            } else {
                                                router.back();
                                            }
                                        }}
                                    >
                                        <Image src={BackIco} alt='뒤로가기' />
                                    </button>
                                )
                            }
                            <h2 className='app-bar-title'>
                                {getTitle(pathName, searchParams)}
                            </h2>
                            {
                                !pathName.includes('/auth') &&
                                !pathName.includes('/user_find') &&
                                !pathName.includes('/payment') ?
                                (
                                    <div className='header-util'>
                                        <Link href={'/client/cart'} style={{ position: "relative" }}>
                                            <span className='quantity'>{userCarts?.length}</span>
                                            <img src={cart.src} alt='장바구니' />
                                        </Link>
                                        <Link
                                            href={'/client/alert'}
                                            style={{ position: "relative" }}
                                        >
                                            <span 
                                                style={{ background: "#ff0000" }}
                                                className='quantity'
                                            >
                                                {userAlerts.length}
                                            </span>
                                            <img src={alertIcon.src} alt='알림' />
                                        </Link>
                                        <button
                                            onClick={(e:React.MouseEvent<HTMLButtonElement>) => {
                                                e.preventDefault();
                                                setCategorySideOn(true);
                                            }}
                                        >
                                            <img src={menu.src} alt='메뉴'/>
                                        </button>
                                    </div>
                                ) :
                                null
                            }
                        </div>
                    )
                }
            </header>
            {
                categorySideOn ? <div className='dim'></div> : null
            }
            <CategorySideGnb 
                categorySideOn={categorySideOn}
                setCategorySideOn={setCategorySideOn}
            />
        </>
    );
};

export default Header;