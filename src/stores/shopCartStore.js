import {
    atom,
    map,
    computed
} from 'nanostores';

export const isCartOpen = atom(false);

export const cartItems = map({});

export function addCartItem({ id, name, imageSrc }) {
    const existingEntry = cartItems.get()[id];
    if (existingEntry) {
        cartItems.setKey(id, {
            ...existingEntry,
            quantity: existingEntry.quantity + 1,
        })
    } else {
        cartItems.setKey(
            id,
            { id, name, imageSrc, quantity: 1 }
        );
    }
}

export const counter = computed(cartItems, (items) => {
    let counter = 0;
    
    for (const item of Object.entries(items)) {

        if (item[1]?.quantity > 0) {
            counter = counter + item[1].quantity;
        }
    }

    return counter;
});