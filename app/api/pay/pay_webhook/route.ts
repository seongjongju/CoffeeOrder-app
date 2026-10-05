import { connectDB } from "@/app/lib/database";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

const dbName = process.env.DB_NAME;

export async function POST(request: NextRequest) {
    console.log("=== 웹훅 API 요청 수신 시작 ===");

    try {
        const rawText = await request.text();

        // 웹 훅 등록 테스트 문자열
        if (!rawText || !rawText.trim().startsWith("{")) {
            console.log("나이스페이먼츠 웹훅 URL 정합성 테스트 요청 수신 성공");
            return NextResponse.json({ result: "SUCCESS" }, { status: 200 });
        }

        const body = JSON.parse(rawText);
        const { status, amount, tid, resultCode, mallReserved } = body;
        const orderId = body.orderId || body.moid;

        console.log("orderId:", orderId);
        
        let orderType = null;
        if (mallReserved) {
            try {
                if (typeof mallReserved === "string" && mallReserved.trim().startsWith("{")) {
                    const parsed = JSON.parse(mallReserved);
                    orderType = parsed.orderType;
                } else if (typeof mallReserved === "object") {
                    orderType = mallReserved.orderType;
                }
            } catch (e) {
                console.warn("mallReserved 파싱 예외 발생:", e);
            }
        }

        const db = (await connectDB).db(dbName);

        // 이미 처리된 결제인지 확인
        const alreadyPaid = await db.collection('payments').findOne({ orderId: orderId });
        if (alreadyPaid) {
            return NextResponse.json({ result: "SUCCESS" }, { status: 200 });
        }

        // 임시 대기방에서 주문 조회
        const selectAmount = await db.collection('payments_temp').findOne({ orderId: orderId });

        if (!selectAmount) {
            console.log("❌ [400 원인]: payments_temp 컬렉션에서 orderId를 못 찾음 ->", orderId);
            return NextResponse.json({ result: "FAIL", message: "유효한 결제 대기 내역을 찾을 수 없습니다." }, { status: 400 });
        }

        if (selectAmount.status === 'paid' || selectAmount.status === 'fail') {
            return NextResponse.json({ result: "SUCCESS" }, { status: 200 });
        }

        // 금액 검증
        if (Number(selectAmount.amount) !== Number(amount)) {
            console.log("❌ [400 원인]: 금액 불일치! DB금액:", selectAmount.amount, "/ PG금액:", amount);
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
                            console.log("❌ [400 원인]: 재고 부족! 현재재고:", realInv?.quantity, "/ 요청수량:", totalCount);
                            await db.collection('payments_temp').updateOne(
                                { orderId: orderId },
                                {
                                    $set: { 
                                        status: "fail",
                                        createdAt: new Date()
                                    } 
                                }
                            );

                            return NextResponse.json({ result: "FAIL", message: "재고 부족" }, { status: 400 });
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
                orderType: orderType,
                userId: selectAmount.userId,
                userName: selectAmount.userName,
                items: selectAmount.items,
                amount: amount,
                productName: selectAmount.productName,
                tid: tid,
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