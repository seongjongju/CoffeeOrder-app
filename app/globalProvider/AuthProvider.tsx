'use client';
import { meApi } from '@/features/clientApi/authApi';
import { loginSuccess, logout } from '@/store/auth/authSlice';
import { usePathname } from 'next/navigation';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

const AuthProvider = ({children}: {children: React.ReactNode}) => {
    const dispatch = useDispatch();
    const pathName = usePathname();

    useEffect(() => {
        const userInfo = async () => {
            if(pathName.includes('/admin/')) return;

            try{
                const data = await meApi();
                                
                return;
            } catch(err: any) {
                console.error("유저 정보 로드 실패:", err);
                return;
            }
        };

        userInfo();
    }, []);

    return (
        <>
            {children}
        </>
    );
};

export default AuthProvider;