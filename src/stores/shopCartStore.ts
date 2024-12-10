import {
    atom,
    map,
    computed
} from 'nanostores';
import {productList} from './productListStore';
import { nanoid } from 'nanoid'

export type CartItem = {
    id?: string;
    name: string; 
    type: string;
    sku: string; 
    size: string;
    price: string;
    img: string;
    color: string;
    siteColor: string;
}

type ItemDisplayInfo = Pick<CartItem, 'sku' | 'img' | 'siteColor' | 'color' | 'size'>;

const storedCartItems = JSON.parse(localStorage.getItem('shopCart')) || {};

export const totalPrice = atom(0);

export const cartItems = map<Record<string, CartItem>>(storedCartItems);

export function addCartItem({ sku, img, siteColor, color, size }: ItemDisplayInfo) {
    const id = nanoid();
    const productData = {
        ...productList.get()?.data[sku],
        siteColor: color,
        color,
        img,
        size,
        id,
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
