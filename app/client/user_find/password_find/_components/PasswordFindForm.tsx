'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import mascot from '@/public/images/mascot.png';
import FindInput from '../../_components/FindInput';
import useModalShow from '@/features/hooks/modal/useModalShow';
import Modal from '@/shared/client/components/modal/Modal';
import { validations } from '@/app/util/client/Validation';
import { logoutApi, resetPasswordApi } from '@/features/clientApi/authApi';
import { formatPhoneNumber } from '@/app/util/format';
import useLoading from '@/features/hooks/loading/useLoading';
import SpinerButton from '@/shared/client/components/button/SpinerButton';

interface resetPwdInputs {
    userId: string;
    userPhoneNumber: string;
    newPwd: string;
    newPwdCheck: string;
};

const PasswordFindForm = () => {
    const {isLoading, setIsLoading} = useLoading();
    const {modalShow, setModalShow, modalText, setModalText} = useModalShow();

    const [resetPwdInputs, setResetPwdInputs] = useState<resetPwdInputs>({
        userId: "",
        userPhoneNumber: "",
        newPwd: "",
        newPwdCheck: "",
    });

    //인풋 입력
    const handleChangeInputs = (e: React.ChangeEvent<HTMLInputElement>) => {
        const target = e.target.name;

        setResetPwdInputs((prev) => ({
            ...prev,
            [target]: target === "userPhoneNumber" ? e.target.value.replace(/\D/g, '').slice(0, 11) : e.target.value
        }));
    };

    //유저 정보 인증 submit
    const handleCertificationSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setModalShow(true);

        //아무것도 안적었을 시
        if(resetPwdInputs.userId.trim() === '' || resetPwdInputs.userPhoneNumber.trim() === '' || resetPwdInputs.newPwd.trim() === '') {
            setModalText('아이디, 휴대폰 번호, 새 비밀번호를 입력해주세요.');
            return;
        }

        //아이디 형식 오류
        if(!validations.idRegex.test(resetPwdInputs.userId.trim())) {
            setModalText('아이디 형식이 올바르지 않습니다.');
            return;
        }

        //휴대폰 번호 형식 오류
        if(!validations.phoneNumberRegex.test(resetPwdInputs.userPhoneNumber.trim())) {
            setModalText('휴대폰 번호 형식이 올바르지 않습니다.');
            return;
        }

        //비밀번호 형식 오류
        if(!validations.passwordRegex.test(resetPwdInputs.newPwd.trim())) {
            setModalText(`비밀번호 형식이 올바르지 않습니다.
영문 + 숫자 + 기호 총 8자리 
사용 가능 기호(!@#$%^&*()_+=-)`
            );
            return;
        };

        //새 비밀번호가 일치 하지 않을 때
        if(resetPwdInputs.newPwd !== resetPwdInputs.newPwdCheck) {
            setModalText('새 비밀번호가 일치하지 않습니다.');
            return;
        }

        setModalShow(false);

        //유저 인증정보를 서버로 전송
        try {
            setIsLoading(true);

            //비밀번호 변경 API
            const data = await resetPasswordApi(
                resetPwdInputs.userId, 
                resetPwdInputs.userPhoneNumber,
                resetPwdInputs.newPwd
            );  

            if(!data.success) {
                setModalText(`${data.message}`);
                setModalShow(true);
                return;
            }

            //로그아웃 API
            const logOutData = await logoutApi();

            if(!logOutData.success) {
                setModalText(`${logOutData.message}`);
                setModalShow(true);
                return;
            }

            setModalText(`${data.message}`);
            setModalShow(true);
            
            return; 
        } catch(err: any) {
            console.error(err.response?.data?.message);
            setModalShow(true);
            setModalText(err.response?.data?.message);
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
                        비밀번호 재설정을 위해 <br />
                        아이디와 연락처를 입력해 주세요!!
                    </p>
                </div>
                <form onSubmit={handleCertificationSubmit}>
                    <FindInput 
                        placeholder='아이디 입력 abc123'
                        type='text'
                        name='userId'
                        autoComplete='off'
                        label='아이디'
                        value={resetPwdInputs.userId}
                        onChange={handleChangeInputs}
                    />
                    <FindInput 
                        placeholder="'-'구분없이 입력"
                        type='tel'
                        name='userPhoneNumber'
                        autoComplete='tel'
                        label="휴대폰 번호"
                        value={formatPhoneNumber(resetPwdInputs.userPhoneNumber)}
                        onChange={handleChangeInputs}
                    />
                    <FindInput 
                        label='새 비밀번호'
                        type='password'
                        name='newPwd'
                        autoComplete='new-password'
                        placeholder='새 비밀번호 입력 영문 + 숫자 + 기호 총 8자리'
                        value={resetPwdInputs.newPwd}
                        onChange={handleChangeInputs}
                    />
                    <FindInput 
                        label='새 비밀번호 확인'
                        type='password'
                        name='newPwdCheck'
                        autoComplete='new-password'
                        placeholder='새 비밀번호 재입력'
                        value={resetPwdInputs.newPwdCheck}
                        onChange={handleChangeInputs}
                    />
                    <SpinerButton 
                        isLoading={isLoading}
                        buttonText='비밀번호 재설정'
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

export default PasswordFindForm;