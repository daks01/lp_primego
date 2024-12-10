import {
    atom,
    map,
    computed
} from 'nanostores';
import { nanoid } from 'nanoid'
import { productList } from './productListStore';

export type CartItem = {
    id?: string;
    name: string; 
    type: string;
    sku: string; 
    size: string;
    price: string;
    color: string;
    img?: string;
}

type ItemDisplayInfo = Pick<CartItem, 'sku' | 'color' | 'size'>;

const storedCartItems = JSON.parse(localStorage.getItem('shopCart')) || {};

export const totalPrice = atom(0);

export const cartItems = map<Record<string, CartItem>>(storedCartItems);

export function addCartItem({ sku, color, size }: ItemDisplayInfo) {
    const id = nanoid();
    const shopIconsJson = document.querySelector('script[data-shop-image-json]')?.dataset.shopImageJson;

    const productData = {
        ...productList.get()?.data[sku],
        color,
        size,
        id,
        img: JSON.parse(shopIconsJson)?.[sku]?.[color],
    };
    cartItems.setKey(id, {...productData});
}

cartItems.subscribe(() => {
    let total = 0;

    for (let item in cartItems.get()) {
        total += +cartItems.get()[item].price;
    }

    totalPrice.set(total);
    
    localStorage.setItem('shopCart', JSON.stringify(cartItems.get()));
})

export const counter = computed(cartItems, (items) => {
    return Object.keys(items).length;
}); 
