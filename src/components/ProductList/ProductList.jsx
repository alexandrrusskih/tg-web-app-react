import React, { useCallback, useEffect, useState } from 'react'
import { useTelegram } from "../../hooks/useTelegram"
import ProductItem from "../ProductItem/ProductItem"
import './ProductList.css'

const products = [
    {id: '1', title: 'dfdf', price: 500000, description: 'efdggdfg dfgdfg, прямые', image: '../../Images/image_1.webp'},
    {id: '2', title: 'Куртка', price: 1200, description: 'dfgdfg, теплая', image: '../../Images/image_2.webp'},
    {id: '3', title: 'Джинсы 2', price: 500, description: 'dgdfgc vrty, прямые', image:'../../Images/image_3.webp'},
    {id: '4', title: 'Куртка 8', price: 122, description: 'jkdhgfkdjghdfkl, теплая', image:'../../Images/image_4.webp'},
    {id: '5', title: 'Джинсы 3', price: 500, description: 'Синего цвета, прямые', image: '../../Images/image_5.webp'},
    {id: '6', title: 'Куртка 7', price: 60, description: 'Зеленого цвета, теплая', image: '../../Images/image_1.webp'},
    {id: '7', title: 'Джинсы 4', price: 550, description: 'Синего цвета, прямые', image: '../../Images/image_2.webp'},
    {id: '8', title: 'Куртка 5', price: 1200, description: 'Зеленого цвета, теплая', image: '../../Images/image_3.webp'},
]

const getTotalPrice = (items = []) => {
    return items.reduce((acc, item) => {
        return acc += item.price
    }, 0)
}

const ProductList = () => {
    const [addedItems, setAddedItems] = useState([]);
    const {tg, queryId} = useTelegram();

    const onSendData = useCallback(() => {
        const data = {
            products: addedItems,
            totalPrice: getTotalPrice(addedItems),
            queryId,
        }
        fetch('http://85.119.146.179:8000/web-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
    }, [addedItems])

    useEffect(() => {
        tg.onEvent('mainButtonClicked', onSendData)
        return () => {
            tg.offEvent('mainButtonClicked', onSendData)
        }
    }, [onSendData])

    const onAdd = (product) => {
        const alreadyAdded = addedItems.find(item => item.id === product.id);
        let newItems = [];

        if(alreadyAdded) {
            newItems = addedItems.filter(item => item.id !== product.id);
        } else {
            newItems = [...addedItems, product];
        }

        setAddedItems(newItems)

        if(newItems.length === 0) {
            tg.MainButton.hide();
        } else {
            tg.MainButton.show();
            tg.MainButton.setParams({
                text: `Купить ${getTotalPrice(newItems)}`
            })
        }
    }

    return (
        <div className={'list'}>
            {products.map(item => (
                <ProductItem
                    product={item}
                    onAdd={onAdd}
                    className={'item'}
                />
            ))}
        </div>
    );
};

export default ProductList;
