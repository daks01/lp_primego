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
    const isLengthFit = product.length && product.length <= sizeWithParameters.length;
    const isWidthFit = product.width && product.width <= sizeWithParameters.width;
    return { size: sizeWithParameters, isFit: isLengthFit && isWidthFit };
});
