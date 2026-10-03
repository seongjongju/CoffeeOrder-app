import React from 'react';
import '../_styled/main.css';
import MainVisual from './MainVisual';
import Suggestion from './Suggestion';
import MenuTabItems from './MenuTabItems';
import LatelyOrder from './LatelyOrder';
import { getUser } from '@/features/serverApi/userApi';

const MainUI = async () => {
    const user = await getUser();

    return (
        <main className='main'>
            <MainVisual />
            
            <div className='inner'>
                <h2 className='main-title'>추천 메뉴!!</h2> 
            </div>
            <Suggestion />

            {
                user && 
                (
                    <LatelyOrder 
                        user={user}
                    />
                )
            }
            
            <div className='inner'>
                <h2 className='main-title'>주문 하기!!</h2>             
                <MenuTabItems />
            </div>
        </main>
    );
};

export default MainUI;