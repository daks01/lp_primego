import {
    atom,
    map,
    computed
} from 'nanostores';
import { nanoid } from 'nanoid'
import { productList } from './productListStore';
import { nanoquery } from '@nanostores/query';
import { apiUrl } from '../utils/routes';

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

const [createFetcherStore, createMutatorStore] = nanoquery({
    fetcher: (...keys) => fetch(keys.join('')).then((r) => r.json()),
});

const daylyCurrencyList = createFetcherStore(apiUrl.currency);

daylyCurrencyList.subscribe((data) => {
    if (!data?.data) {
        return;
    }
    const usd = data.data?.['USD'];
    
    usdExchangeRate.set(parseFloat(usd.replace(/,/, '.')));
});

export const usdExchangeRate = atom(0);

const storedCartItems = JSON.parse(localStorage.getItem('shoppingCart')) || {};

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
    
    localStorage.setItem('shoppingCart', JSON.stringify(cartItems.get()));
})

export const counter = computed(cartItems, (items) => {
    return Object.keys(items).length;
}); 
