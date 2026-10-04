'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import mascot from '@/public/images/mascot.png';
import FormField from '@/shared/client/components/formField/FormField';
import Link from 'next/link';
import { validations } from '@/app/util/client/Validation';
import useModalShow from '@/features/hooks/modal/useModalShow';
import Modal from '@/shared/client/components/modal/Modal';
import { loginApi, meApi } from '@/features/clientApi/authApi';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '@/store/auth/authSlice';
import useLoading from '@/features/hooks/loading/useLoading';
import SpinerButton from '@/shared/client/components/button/SpinerButton';

const LoginForm = () => {
    const {modalShow, setModalShow, modalText, setModalText} = useModalShow();
    const {isLoading, setIsLoading} = useLoading();
    const dispatch = useDispatch();
    const [userId, setUserId] = useState('');
    const [userPwd, setUserPwd] = useState('');
    const [loginErrorMsg, setLoginErrorMsg] = useState({
        idErrorMsg: '',
        passwordErrorMsg: ''
    });

    const loginUserId = (e:React.ChangeEvent<HTMLInputElement>) => {
        setUserId(e.target.value);
    };

    const loginUserPassword = (e:React.ChangeEvent<HTMLInputElement>) => {
        setUserPwd(e.target.value);
    };

    const loginUserIdRegex = () => {
        if(!validations.idRegex.test(userId.trim())) {
            setLoginErrorMsg(prev => ({...prev, idErrorMsg: '유효하지 않은 아이디입니다.' }));
            return false;
        } else {
            setLoginErrorMsg(prev => ({...prev, idErrorMsg: '' }));
            return true;
        }
    };

    const passwordUserIdRegex = () => {
        if(!validations.passwordRegex.test(userPwd.trim())) {
            setLoginErrorMsg(prev => ({...prev, passwordErrorMsg: '유효하지 않은 비밀번호입니다.' }));
            return false;
        } else {
            setLoginErrorMsg(prev => ({...prev, passwordErrorMsg: '' }));
            return true;
        }
    };

    const loginSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if(!userId.trim() || !userPwd.trim()) {
            setModalText('아이디와 비밀번호를 모두 입력해주세요.');
            setModalShow(true);
            return;
        }

        try{
            setIsLoading(true);

            const data = await loginApi(userId, userPwd);
            if(!data.success) {
                setModalText(`${data.message}`);
                setModalShow(true);
                return;
            }; 

            //알림 허용 여부
            if ('Notification' in window) {
                await Notification.requestPermission();
            }

            window.location.href = '/'; 
            return;
        } catch(err: any) {
            console.error(err);
            setModalText(err.response?.data?.message);
            setModalShow(true);
            return;
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className='auth-container'>
                <div className='auth-top'>
                    <Image src={mascot} alt='마스코트' />
                    <p className='auth-text'>
                        서비스 이용을 위해 <br />
                        로그인 해주세요!!
                    </p>
                </div>
                <form onSubmit={loginSubmit}>
                    <FormField 
                        label='아이디'
                        type='text'
                        autoComplete='off'
                        placeholder='아이디 입력'
                        value={userId}
                        onChange={loginUserId}
                        onBlur={loginUserIdRegex}
                        errMessage={loginErrorMsg.idErrorMsg}
                    />
                    <FormField 
                        label='비밀번호'
                        type='password'
                        autoComplete='current-password'
                        placeholder='비밀번호 입력'
                        value={userPwd}
                        onChange={loginUserPassword}
                        onBlur={passwordUserIdRegex} 
                        errMessage={loginErrorMsg.passwordErrorMsg}
                    />

                    <SpinerButton 
                        isLoading={isLoading}
                        buttonText='로그인'
                    />

                    <div className='auth-links'>
                        <Link 
                            style={{
                                pointerEvents: isLoading ? "none" : "auto"
                            }}
                            href={'/client/user_find/id_find'} 
                        >
                            아이디 찾기 및 비밀번호 재설정
                        </Link>
                        <span>/</span>
                        <Link 
                            style={{
                                pointerEvents: isLoading ? "none" : "auto"
                            }}
                            href={'/client/auth/policy'} 
                        >
                            회원가입
                        </Link>
                    </div>
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

export default LoginForm;