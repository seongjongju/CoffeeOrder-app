import { getUser } from '@/features/serverApi/userApi';
import MypageInterface from './_components/MypageInterface';
import './_styled/mypage.css';


const Mypage = async () => {
    const user = await getUser();

    return (
        <main className='main'>
            {
                user && 
                (
                    <MypageInterface 
                        user={user}
                    />
                )
            }
        </main>
    );
};

export default Mypage;