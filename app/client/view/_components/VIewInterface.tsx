'use client';
import useProductQuery from '@/features/hooks/query/useProductQuery';
import { CldImage } from 'next-cloudinary';
import React, { useReducer, useState } from 'react';
import ViewDetail from './ViewDetail';
import plusIco from '@/public/icons/view_plus.svg';
import minusIco from '@/public/icons/view_minus.svg';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import OrderBar from './OrderBar';
import { OptionState } from '@/app/types/products/product';
import { User } from '@/app/types/members/member';

interface ViewProps {
    prdParams: string;
    user: User;
};

//옵션 초기값
const initialState: OptionState = [
    {id: "add_0", label: "샷 추가", count: 0, addPrice: 0, },
    {id: "add_1", label: "시럽 추가", count: 0, addPrice: 0, },
    {id: "add_2", label: "휘핑크림 추가", count: 0, addPrice: 0, },
];

//옵션 값 변경 리듀서
const reducer = (state: OptionState, action: {type: string, payload: any}): OptionState => {
    switch(action.type) {
        case "INCREMENT": {
            const id: string | undefined = action.payload?.id;
            if (!id) return state;
            return state.map(item => item.id === id ? {...item, count: item.count + 1, addPrice: item.addPrice + 500} : item);
        }
        case "DECREMENT": {
            const id: string | undefined = action.payload?.id;
            if (!id) return state;
            return state.map(item => item.id === id ? {...item, count: Math.max(0, item.count - 1), addPrice: Math.max(0, item.addPrice - 500)} : item);
        }
        case "RESET":
            return initialState;
        default:
            return state;
    }
};

const VIewInterface = ({prdParams, user}: ViewProps) => {
    const {products} = useProductQuery();
    const searchParams = useSearchParams();

    const [lightly, setLightly] = useState<boolean>(false); //연하기
    const [addState, dispatch] = useReducer(reducer, initialState);//추가 옵션

    //추가
    const increment = (id: string) => {
        dispatch({
            type: "INCREMENT",
            payload: {id: id},
        });
    };

    //감소
    const decrement = (id: string) => {
        dispatch({
            type: "DECREMENT",
            payload: {id: id},
        });
    };

    //해당 상세내용만 불러오기 위한 필터링
    const viewProduct = products?.find(prd => prd.productCode === prdParams);
    if(!viewProduct) return;

    //인풋에 보여지는 값
    const optionInputValue = (id: string) => {
        return addState.find(add => add.id === id)?.count;
    };

    return (
        <>
            <nav className='inner'>
                <figure className='view-thum'>
                    <CldImage
                        className='view-thum__image'
                        src={viewProduct.img.publicId}
                        width={500}
                        height={500}
                        alt={viewProduct.img.imgName}
                    />
                </figure>
                <p className='view-thum__title'>{viewProduct.productName}</p> 

                <p className='view-title'>옵션</p>
                <form className='view-form'>
                    {
                        searchParams.get("category") === "커피" &&
                        (
                            <div className='view-option__density'>
                                <p className='text-body'>
                                    연하게
                                </p>   
                                <label className='label'>
                                    <div className='all-checked-custom'>
                                        <input 
                                            className='checked-input' 
                                            type="checkbox"
                                            checked={lightly}
                                            onChange={() => {
                                                setLightly(prev => !prev);
                                            }}
                                        />
                                        <span className='checked-show-hide'></span>
                                    </div>
                                </label>
                            </div>
                        )
                    }
                    {
                        addState.map((op) => (
                            <div
                                key={op.id}
                                className='view-option'
                            >
                                <label className='text-body'>
                                    {op.label} <span>+500</span> 
                                </label>
                                <div className='view-option__quantity-wrap'>
                                    <button 
                                        className='view-option__button'
                                        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                                            e.preventDefault();
                                            decrement(op.id);
                                        }}
                                    >
                                        <Image src={minusIco} alt='마이너스버튼' />
                                    </button>
                                    <input 
                                        className='view-option__input'
                                        type="number" 
                                        readOnly
                                        min={0}
                                        value={optionInputValue(op.id)}
                                    />
                                    <button 
                                        className='view-option__button'
                                        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                                            e.preventDefault();
                                            increment(op.id);
                                        }}
                                    >
                                        <Image src={plusIco} alt='플러스버튼' />
                                    </button>
                                </div> {/* view-option__quantity-wrap */}
                            </div>
                        ))
                    }
                </form>

                <ViewDetail 
                    productInfos={viewProduct.productInfos}
                />
            </nav>

            <OrderBar
                user={user}
                viewProduct={viewProduct}
                lightly={lightly}
                addState={addState}
            />
        </>
    );
};

export default VIewInterface;