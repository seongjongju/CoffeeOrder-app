//*************************회원가입
import { api, api_1 } from "./base";

//아이디 중복확인
export const idReduplicationApi = async (id: string) => {
    const res = await api.post('/auth/id_reduplication',
        { id }
    );

    const data = await res.data;
    return data;
};

//이메일 중복확인 및 인증번호 발송
export const sendEmailApi = async (email: string) => {
    const res = await api.post('/auth/send_authentication', 
        { email }
    );

    const data = await res.data;
    return data;
};

//인증번호 확인
export const authCodeReduplicationApi = async (email: string, authCode: string) => {
    const res = await api.post('/auth/check_authentication',
        { email, authCode }
    );

    const data = await res.data;
    return data;
};


//회원가입
export const memberResisterApi = async (
    id: string, 
    password: string,
    name: string,
    phoneNumber: string,
    email: string,
    birth: string
) => {
    const res = await api.post('/auth/join_member',
        { 
            id,
            password,
            name,
            phoneNumber,
            email,
            birth
        }
    );

    const data = await res.data;
    return data;
};

//************************* 아이디 찾기 및 패스워드 재 설정
export const findIdApi = async (email: string) => {
    const res = await api.post('/auth/find_id',
        { email }
    );

    const data = await res.data;
    return data;
};

export const resetPasswordApi = async (
    userId: string,
    phoneNumber: string,
    newPassword: string
) => {
    const res = await api.patch('/auth/password_reset',
        { userId, phoneNumber, newPassword }
    );

    const data = await res.data;
    return data;
};

//************************* 로그인
export const loginApi = async (
    id: string, 
    password: string,
) => {
    const res = await api.post('/auth/login',
        { id, password,}
    );

    const data = await res.data;
    return data;
};

// 유저 정보
export const meApi = async () => {
    const res = await api_1.get('/auth/me', {});

    const data = await res.data;
    return data;
};

//************************* 로그아웃
export const logoutApi = async () => {
    const res = await api.post('/auth/logout');

    const data = await res.data;
    return data;
};
