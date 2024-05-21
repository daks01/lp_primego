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
    size?: object;
    lace?: string; 
    fur_tongue?: boolean;
    fur_edge?: boolean;
    price: string;
    img: string;
    siteColor: string;
    color: any,
}

type ItemDisplayInfo = Pick<CartItem, 'sku' | 'img' | 'color'>;

const storedCartItems = JSON.parse(localStorage.getItem('shopCart')) || {};

export const totalPrice = atom(0);

export const cartItems = map<Record<string, CartItem>>(storedCartItems);

export function addCartItem({ sku, img, color }: ItemDisplayInfo) {
    const id = nanoid();
    const productData = {
        ...productList.get()?.data[sku],
        siteColor: color,
        img,
        //     lace: 'стандарт', 
        //     fur_tongue: false,
        //     fur_edge: false,
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
