import React from 'react';
import '../_styled/pay.css';
import { getUser } from '@/features/serverApi/userApi';
import PaySuccessInterface from './_components/PaySuccessInterface';

const PaySuccess = async () => {
    const user = await getUser();

    return (
        <div className='pay-main'>
            <nav className='inner'>
                {
                    user &&
                    (
                        <PaySuccessInterface 
                            user={user}
                        />
                    )
                }
            </nav>
        </div>
    );
};

export default PaySuccess;