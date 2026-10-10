'use client';
import React from 'react';
import Image from 'next/image';
import mascot from '@/public/images/mascot.png';
import FindInput from '../../_components/FindInput';
import { useState } from 'react';
import { validations } from '@/app/util/client/Validation';
import useModalShow from '@/features/hooks/modal/useModalShow';
import Modal from '@/shared/client/components/modal/Modal';
import { useRouter } from 'next/navigation';
import { findIdApi } from '@/features/clientApi/authApi';
import useLoading from '@/features/hooks/loading/useLoading';
import SpinerButton from '@/shared/client/components/button/SpinerButton';

const IdFindForm = () => {
    const {isLoading, setIsLoading} = useLoading();
    const [findIdInput, setFindIdInput] = useState('');
    const {modalShow, setModalShow, modalText, setModalText} = useModalShow();
    const router = useRouter();

    const handleChangeFindId = (e:React.ChangeEvent<HTMLInputElement>) => {
        setFindIdInput(e.target.value)
    };

    const findIdSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if(findIdInput.trim() === '') {
            setModalText('이메일을 입력해 주세요.');
            setModalShow(true);
            return;
        }
        
        if(!validations.emailRegex.test(findIdInput.trim())) {
            setModalText('이메일 형식이 올바르지않습니다.');
            setModalShow(true);
            return;
        };

        try {
            setIsLoading(true);

            const data = await findIdApi(findIdInput);
            router.push(`/client/user_find/id_find_result?userId=${data.userId}`);
            return;
        } catch(err: any) {
            console.error(err);
            setModalText(err.response?.data?.message);
            setModalShow(true);
            return;
        }  finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className='auth-container'>
                <div className='auth-top'>
                    <Image src={mascot} alt='마스코트' />
                    <p className='auth-text'>
                        아이디 찾기를 위해 <br />
                        이메일을 입력해 주세요!!
                    </p>
                </div>
                <form onSubmit={findIdSubmit}>
                    <FindInput
                        placeholder='이메일을 입력해주세요.'
                        type='email'
                        name='email'
                        autoComplete='email'
                        label='이메일'
                        value={findIdInput}
                        onChange={handleChangeFindId}
                    />
                    <SpinerButton 
                        isLoading={isLoading}
                        buttonText='아이디 찾기'
                    />
                </form>
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
        </>
    );
};

export default IdFindForm;