import {
    atom,
    map,
    computed
} from 'nanostores';
import { nanoid } from 'nanoid'
import { apiUrl } from '../utils/routes';
import { nanoquery } from '@nanostores/query';

export const totalPrice = atom(0);

export type CartItem = {
    id?: string;
    name: string; 
    type: string;
    sku: string; 
    size?: number;
    lace?: string; 
    fur_tongue?: boolean;
    fur_edge?: boolean;
    price: string;
    img: string;
    color: string;
}

const defaultCartItem = { 
    size: 42,
    lace: 'стандарт', 
    fur_tongue: false,
    fur_edge: false,
}
const storedCartItems = JSON.parse(localStorage.getItem('shopCart')) || {};

export const cartItems = map<Record<string, CartItem>>(storedCartItems);

type ItemDisplayInfo = Pick<CartItem, 'name' | 'sku' | 'type' | 'img' | 'price' | 'color'>;

export function addCartItem({ name, sku, type, img, price, color }: ItemDisplayInfo) {
    const id = nanoid();
    const productData = {
        ...defaultCartItem,
        id,
        name, 
        sku,
        type,
        price,
        color,
        img,
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

export const [createFetcherStore, createMutatorStore] = nanoquery({
    fetcher: (...keys) => fetch(keys.join('')).then((r) => r.json()),
});

export const productsAvailability = createFetcherStore(apiUrl.availability);
