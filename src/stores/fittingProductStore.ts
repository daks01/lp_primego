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

    const { minLength, minWidth } = getSuitableInsoleSizes(product as { width: number; length: number });
    const isLengthFit = product.length && minLength <= sizeWithParameters.length;
    const isWidthFit = product.width && minWidth <= sizeWithParameters.width;
    return { size: sizeWithParameters, isFit: isLengthFit && isWidthFit };
});

export const getSuitableInsoleSizes = (foot: { width: number; length: number }) => {
    const minLength = foot.length + 3;
    const maxLength = foot.length + 12;
    const minWidth = foot.width;
    const maxWidth = foot.width + 5;
    return { minLength, maxLength, minWidth, maxWidth };
};
