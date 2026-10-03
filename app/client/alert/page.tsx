import React from 'react';
import './_styled/alert.css';
import { getUser } from '@/features/serverApi/userApi';
import AlertList from './_components/AlertList';

const AlertPage = async () => {
    const user = await getUser();

    return (
        <main className='main'>
            <nav className='inner'>
                {
                    user && 
                    (
                        <AlertList 
                            user={user}
                        />
                    )
                }
            </nav>
        </main>
    );
};

export default AlertPage;