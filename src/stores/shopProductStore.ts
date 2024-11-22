import { map } from 'nanostores';

interface FittingProduct {
    color?: string;
}
export const $selectedProduct = map<FittingProduct>({});

export function updateColor(value: string) {
    $selectedProduct.setKey('color', value);
}
