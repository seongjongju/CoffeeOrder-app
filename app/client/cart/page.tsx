import React from 'react';
import './_styled/cart.css';
import CartList from './_component/CartList';
import { getUser } from '@/features/serverApi/userApi';

const CartPage = async () => {
    const user = await getUser();

    return (
        <main 
            className='main cart-main'
        >
            {
                user &&
                (
                    <CartList 
                        user={user}
                    />
                )
            }
        </main>
    );
};

export default CartPage;