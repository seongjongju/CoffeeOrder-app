import { connectDB } from "@/app/lib/database";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

const dbName = process.env.DB_NAME;

// 1. 나이스페이 관리자 등록 검증용 GET 요청 처리
export async function GET() {
    return NextResponse.json({ status: "OK" }, { status: 200 });
}

export async function POST(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.nextUrl);
        const orderType = searchParams.get('orderType');

        // 2. 관리자 등록 Ping 및 빈 데이터 수신 시 에러 방지
        const body = await request.json().catch(() => null);

        if (!body || !body.orderId) {
            return NextResponse.json({ result: "SUCCESS" }, { status: 200 });
        }

        const { status, orderId, amount, tid, resultCode } = body;

        /* 디버깅 콘솔 */
        console.log("웹훅-------------------------");
        console.log("status : ", status);
        console.log("orderId : ", orderId);
        console.log("amount : ", amount);
        console.log("tid : ", tid);
        console.log("resultCode : ", resultCode);
        console.log("웹훅-------------------------");

        const db = (await connectDB).db(dbName);

        // 이미 처리된 결제인지 확인
        const alreadyPaid = await db.collection('payments').findOne({ orderId: orderId });
        if (alreadyPaid) {
            return NextResponse.json({ result: "SUCCESS" }, { status: 200 });
        }

        // 임시 대기방에서 주문 조회
        const selectAmount = await db.collection('payments_temp').findOne({ orderId: orderId });

        if (!selectAmount) {
            return NextResponse.json({ result: "FAIL", message: "유효한 결제 대기 내역을 찾을 수 없습니다." }, { status: 400 });
        }

        if (selectAmount.status === 'paid' || selectAmount.status === 'fail') {
            return NextResponse.json({ result: "SUCCESS" }, { status: 200 });
        }

        // 금액 검증
        if (Number(selectAmount.amount) !== Number(amount)) {
            await db.collection('payments_temp').updateOne(
                { orderId: orderId },
                { $set: { status: "fail", createdAt: new Date() } }
            );
            return NextResponse.json({ result: "FAIL", message: "결제 금액이 일치하지 않아 처리가 취소되었습니다." }, { status: 400 });
        }

        if (resultCode === "0000") {
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

            // payments 컬렉션으로 이관
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

            // 임시 데이터 삭제
            await db.collection('payments_temp').deleteOne({ orderId: orderId });

            //장바구니 결제 시, 장바구니를 비워준다.
            if(orderType === "cart") {
                await db.collection('carts').deleteMany({userId: selectAmount.userId});
            }

            
        } else {
            await db.collection('payments_temp').updateOne(
                { orderId: orderId },
                { $set: { status: "fail", createdAt: new Date() } }
            );
            return NextResponse.json({ result: "FAIL", message: "오류로 인해 결제에 실패하였습니다." }, { status: 400 });
        }

        return NextResponse.json({ result: "SUCCESS" }, { status: 200 });

    } catch (err) {
        console.error("Webhook 처리 중 치명적 에러 발생:", err);
        return NextResponse.json({ result: "FAIL", message: "Internal Server Error", error: err }, { status: 500 });
    }
}