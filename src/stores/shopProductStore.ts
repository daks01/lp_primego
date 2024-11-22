import { map } from 'nanostores';

interface FittingProduct {
    color?: string;
    length?: number;
    width?: number;
}
export const $selectedProduct = map<FittingProduct>({});

export function updateProductParameters<K extends keyof FittingProduct>(key: K, value: FittingProduct[K]) {
    $selectedProduct.setKey(key, value);
}
