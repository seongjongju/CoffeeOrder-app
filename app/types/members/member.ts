//회원 리스트 타입
export type Members = {
    members: Array<{
        _id: string;
        id: string;
        name: string;
        phoneNumber: string;
        email: string;
        birth: string;
        role: string;
        createdAt: string;
    }>;
};

export type User = {
    email: string,
    phoneNumber: string,
    userId: string,
    userName: string,
}

export interface UserProps {
    user: User;
}
