import React, { Suspense } from 'react';
import '../_styled/view.css';
import '../../auth/_styled/policyStyle.css';
import VIewInterface from '../_components/VIewInterface';
import LoadingUi from '@/shared/client/components/loading/LoadingUi';
import { getUser } from '@/features/serverApi/userApi';

const Viewpage = async ({ params }: {params : Promise<{ prd: string; }>}) => {
    const {prd} = await params;
    const user = await getUser();

    return (
        <main 
            className='main' 
            style={{ paddingBottom: "0" }}
        >
            <Suspense fallback={<LoadingUi />}>
                {
                    user &&
                    (
                        <VIewInterface 
                            prdParams={prd}
                            user={user}
                        />
                    )
                }
            </Suspense>
        </main>
    );
};

export default Viewpage;