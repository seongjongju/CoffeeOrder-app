import { jwtVerify } from "jose";
import { cookies } from "next/headers";

type UserPayload = {
    id: string;
    phoneNumber: string;
    name: string;
    email: string;
};

const secret = new TextEncoder().encode(
    process.env.JWT_ACCESS_SECRET
);

export const getUser = async () => {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token')?.value;

    if(!accessToken) return;

    try {
        const { payload } = await jwtVerify<UserPayload>(
            accessToken,
            secret
        );

        return {
            userId: payload.id,
            phoneNumber: payload.phoneNumber,
            userName: payload.name,
            email: payload.email,
        };
    } catch(err: any) {
        console.error({error: err, message: "유저 정보 불러오기 실패"});
    }
};