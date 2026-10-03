import { connectDB } from "@/app/lib/database";
import { Item } from "@/app/types/pay/pay";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

const dbName = process.env.DB_NAME;

//나이스페이먼츠
const clientId = process.env.NEXT_PUBLIC_NICEPAY_CLIENT_ID;
const secretKey = process.env.NEXT_PUBLIC_NICEPAY_SECRET_KEY;

export async function POST(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.nextUrl);
        const orderType = searchParams.get('orderType');

        const formData = await request.formData();

        const authResultCode = formData.get("authResultCode") as string;
        const authToken = formData.get("authToken") as string;
        const paymentKey = formData.get("paymentKey") as string;
        const tid = formData.get("tid") as string;
        const amount = formData.get("amount") as string;
        const orderId = formData.get("orderId") as string; 

        const db = (await connectDB).db(dbName);

        //pending 상태의 결제 데이터 조회
        const selectAmount = await db.collection('payments_temp').findOne({ 
            orderId: orderId, 
            status: 'pending' 
        });

        if (!selectAmount) {
            return NextResponse.redirect(new URL(`/client/pay/pay_fail?error=${encodeURIComponent('주문조회실패')}&status=fail&message=${encodeURIComponent('유효한 결제 대기 내역을 찾을 수 없습니다.')}`, request.nextUrl), 303);
        }

        // 금액 비교 검증
        if (Number(selectAmount.amount) !== Number(amount)) {
            await db.collection('payments_temp').updateOne(
                { orderId: orderId },
                {
                    $set: { 
                        status: "fail",
                        createdAt: new Date()
                    } 
                }
            );
            return NextResponse.redirect(new URL(`/client/pay/pay_fail?error=${encodeURIComponent('금액 불일치')}&status=fail&message=${encodeURIComponent('결제 금액이 일치하지 않아 처리가 취소되었습니다.')}`, request.nextUrl), 303);
        }

        //인증 결과 코드 확인
        if (authResultCode !== "0000") {
            await db.collection('payments_temp').updateOne(
                { orderId: orderId },
                {
                    $set: { 
                        status: "fail",
                        createdAt: new Date()
                    } 
                }
            );
            return NextResponse.redirect(new URL(`/client/pay/pay_fail?error=${encodeURIComponent('결제실패')}&status=fail&message=${encodeURIComponent('오류로 인해 결제에 실패하였습니다.')}`, request.nextUrl), 303);
        }

        //나이스페이먼츠 승인 API 호출
        const response = await fetch(`${process.env.NEXT_PUBLIC_NICEPAY_URL}/${tid}`, {
            method: "POST",
            headers: {
                Authorization: "Basic " + Buffer.from(clientId + ":" + secretKey).toString("base64"), 
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ amount: Number(amount) }),
        });

        const resultData = await response.json();

        //최종 결제 승인 실패 시 처리
        if (!response.ok || resultData.resultCode !== "0000") {
            await db.collection('payments_temp').updateOne(
                { orderId: orderId },
                {
                    $set: { 
                        status: "fail",
                        createdAt: new Date()
                    } 
                }
            );
            return NextResponse.redirect(new URL(`/client/pay/pay_fail?error=${encodeURIComponent('결제실패')}&status=fail&message=${encodeURIComponent(resultData.resultMsg)}`, request.nextUrl), 303);
        }

        //결제 성공 시 사용재고를 차감한다.
        const bulkOps = [];

        for (const item of selectAmount.items) {
            const totalCount = Number(item.totalCount); 
            
            if (item.usedInventorys) {
                for (const inventory of item.usedInventorys) {
                    //재고 수량이 부족할 시
                    const realInv = await db.collection('inventory').findOne({ 
                        _id: new ObjectId(inventory._id) 
                    });

                    if(realInv?.quantity <= 0 || realInv?.quantity < totalCount) {
                        await db.collection('payments_temp').updateOne(
                            { orderId: orderId },
                            {
                                $set: { 
                                    status: "fail",
                                    createdAt: new Date()
                                } 
                            }
                        );
                        return NextResponse.redirect(new URL(`/client/pay/pay_fail?error=${encodeURIComponent('결제실패')}&status=fail&message=${encodeURIComponent(realInv?.inventoryName + '의 재고 부족으로 인해 결제에 실패하였습니다. 관리자에게 문의해주세요.')}`, request.nextUrl), 303);
                    }

                    bulkOps.push({
                        updateOne: {
                            filter: { _id: new ObjectId(inventory._id) }, 
                            update: { $inc: { quantity: -totalCount } } 
                        }
                    });
                }
            }
        }

        if (bulkOps.length > 0) {
            await db.collection('inventory').bulkWrite(bulkOps);
        }

        //결제 성공 완료 처리
        await db.collection('payments').insertOne({
            orderId: orderId,
            userId: selectAmount.userId,
            userName: selectAmount.userName,
            items: selectAmount.items,
            amount: amount,
            productName: selectAmount.productName,
            tid: tid,
            orderType: orderType,
            status: "paid",
            createdAt: new Date()
        });

        //결제 성공 시 대기방 콜렉션의 주문서를 지워준다.
        await db.collection('payments_temp').deleteOne({ orderId: orderId });

        //장바구니 결제 시, 장바구니를 비워준다.
        if(orderType === "cart") {
            await db.collection('carts').deleteMany({userId: selectAmount.userId});
        }
        
        return NextResponse.redirect(new URL(`/client/pay/pay_success?userId=${encodeURIComponent(selectAmount.userId)}&productName=${encodeURIComponent(selectAmount.productName)}`, request.nextUrl), 303);
    } catch (err) {
        console.error("POST 데이터 처리 중 에러:", err);
        return NextResponse.json({ status: "fail", message: "에러 발생", error: err }, { status: 500 });
    }
};