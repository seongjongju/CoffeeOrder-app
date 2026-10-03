'use client';
import { usePathname } from 'next/navigation';
import React, { Suspense, useEffect } from 'react';
import { Provider } from "react-redux";
import { persistor, store } from "../store/store";
import { PersistGate } from 'redux-persist/integration/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Header from './client/inc/header/Header';
import AdminHeader from './admin/inc/admin_header/AdminHeader';
import LoadingUi from '@/shared/client/components/loading/LoadingUi';
import { User } from './types/members/member';

interface ClientLayoutProps {
    children: React.ReactNode;
    initialHasSeen?: boolean; 
    user: User;
}

const queryClient = new QueryClient();

const ClientLayout = ({
    children,
    initialHasSeen,
    user
}:ClientLayoutProps) => {
    const pathName = usePathname();

    useEffect(() => {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                .then(reg => console.log('서비스 워커 등록 성공', reg))
                .catch(err => console.log('서비스 워커 등록 실패', err));
            });
        }
    }, []);

    const isAdminPage = pathName.includes("admin");

    return (
            <>
                {
                    isAdminPage ? 
                    ( 
                        <QueryClientProvider client={queryClient}>
                            <Provider store={store}>
                                <PersistGate persistor={persistor}>
                                    <AdminHeader /> 
                                    {children}
                                </PersistGate>
                            </Provider>
                        </QueryClientProvider>
                    ) :
                    (
                        <Suspense fallback={<LoadingUi />}>
                            <QueryClientProvider client={queryClient}>
                                <Provider store={store}>
                                    <PersistGate persistor={persistor}>
                                        <Header user={user}/>
                                        {children}
                                    </PersistGate>
                                </Provider>
                            </QueryClientProvider>
                        </Suspense>
                    )
                }
            </>
        
    );
};

export default ClientLayout;