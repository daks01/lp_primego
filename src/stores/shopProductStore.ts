import { map } from 'nanostores';

interface FittingProduct {
    color?: string;
    length?: number;
    width?: number;
    recommended?: string;
    size?: string;
}
export const $selectedProduct = map<FittingProduct>({});

export function updateProduct(product: FittingProduct) {
    for (const [key, value] of Object.entries(product)) {
        $selectedProduct.setKey(key as keyof FittingProduct, value);
    }
}
