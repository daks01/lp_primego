import { computed, map } from 'nanostores';
import { $sizes } from './productListStore';

interface FittingProduct {
    sku?: string;
    color?: string;
    length?: number;
    width?: number;
    recommended?: string;
    size?: string;
    selectedSizeApproval?: boolean;
}
export const $selectedProduct = map<FittingProduct>({});

export function updateProduct(product: FittingProduct) {
    for (const [key, value] of Object.entries(product)) {
        $selectedProduct.setKey(key as keyof FittingProduct, value);
    }
}

export const $selectedOrOnlyRecommendedSize = computed([$selectedProduct, $sizes], (product, sizes) => {
    const size = product.size ?? product.recommended;
    if (!sizes || !product.sku || !size) return;
    const sizeWithParameters = sizes[product.sku][size];
    if (!product.length || !product.width) return { size: sizeWithParameters, isFit: false };

    const { minLength, maxLength, minWidth, maxWidth } = getSuitableInsoleSizes(product as { width: number; length: number });
    const fitByLength = minLength <= sizeWithParameters.length && sizeWithParameters.length <= maxLength;
    const fitByWidth = minWidth <= sizeWithParameters.width && sizeWithParameters.width <= maxWidth;
    return { size: sizeWithParameters, isFit: fitByLength && fitByWidth };
});

export const getSuitableInsoleSizes = (foot: { width: number; length: number }) => {
    const minLength = foot.length + 3;
    const maxLength = foot.length + 12;
    const minWidth = foot.width - 2;
    const maxWidth = foot.width + 5;
    return { minLength, maxLength, minWidth, maxWidth };
};
