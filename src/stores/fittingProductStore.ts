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

    const isFit = isSuitableSize(sizeWithParameters, product as { width: number; length: number });
    return { size: sizeWithParameters, isFit };
});

export const getSuitableInsoleSizes = (foot: { width: number; length: number }) => {
    const minLength = foot.length + 3;
    const maxLength = foot.length + 12;
    const minWidth = foot.width - 2;
    const maxWidth = foot.width + 5;
    return { minLength, maxLength, minWidth, maxWidth };
};

export const isSuitableSize = (size: { width: number; length: number }, foot: { width: number; length: number }) => {
    const { minLength, maxLength, minWidth, maxWidth } = getSuitableInsoleSizes(foot);
    const fitByLength = minLength <= size.length && size.length <= maxLength;
    const fitByWidth = minWidth <= size.width && size.width <= maxWidth;
    return fitByLength && fitByWidth;
};
