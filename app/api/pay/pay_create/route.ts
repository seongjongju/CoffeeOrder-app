import { connectDB } from "@/app/lib/database";
import { Item } from "@/app/types/pay/pay";
import { NextRequest, NextResponse } from "next/server";

const dbName = process.env.DB_NAME;

export async function POST(request:NextRequest) {
    const body = await request.json();
    const orderItems: Item[] = body.orderItems;
    const orderType = body.orderType;

    /* 디버깅 콘솔 */
    console.log("주문서생성-------------------------");
    console.log("json body : ", body);
    console.log("orderItems : ", orderItems);
    console.log("orderType : ", orderType);
    console.log("주문서생성-------------------------");

    try{
        if(!orderItems) {
            return NextResponse.json({error: "요청 값 불일치 또는 잘못된 값", message: "주문 오류! 관리자에게 문의해주세요."}, {status: 401});
        }

        //amount 
        const amount = orderItems.map(mount => mount.totalPrice).reduce((acc, current) => acc + current, 0);

        const db = (await connectDB).db(dbName);
        //주문 아이디를 위한 자동 카운팅
        let counter = await db.collection('payments_counter').findOneAndUpdate(
            { name: "totalPost" },
            { $inc: { total: 1 } },
            { returnDocument: 'after' }
        );

        let newOrderId = counter?.total; 

        //userId, userName, productName 상위에 저장
        const userId = orderItems[0].userId;
        const userName = orderItems[0].userName;
        const productName = orderItems.length > 1 ?
                            `${orderItems[0].productName} 외 ${orderItems.length - 1}개` : 
                            orderItems[0].productName;

        //결제 상태 = pending
        await db.collection('payments_temp').insertOne({
            orderId: `ORD${newOrderId}`,
            orderType: orderType,
            userId: userId,
            userName: userName,
            status: 'pending',
            productName: productName,
            amount: amount,
            items: orderItems,
            createAt: new Date()
        });

        return NextResponse.json({ status: "pending", message: "주문서 생성", orderId: `ORD-${newOrderId}`, orderType: orderType, items: orderItems });
    }catch(err) {
        console.error(err);
        return NextResponse.json({ status: "fail", error: "주문서 생성 오류", message: "결제 준비 오류" }, {status: 500});
    }
};