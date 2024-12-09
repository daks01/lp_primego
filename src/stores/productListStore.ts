import { computed, map } from 'nanostores';
import { apiUrl } from '../utils/routes';
import { nanoquery } from '@nanostores/query';
import alphabeticCompare from '../utils/alphabeticCompare';

const [createFetcherStore, createMutatorStore] = nanoquery({
    fetcher: (...keys) => fetch(keys.join('')).then((r) => r.json()),
});

let storedProductList = JSON.parse(localStorage.getItem('productList')) || {};

const productsAvailability = createFetcherStore(apiUrl.availability);

productsAvailability.subscribe((data) => {
    if (!data?.data) {
        return;
    }

    productList.set(data);
    localStorage.setItem('productList', JSON.stringify(data));
});

export const productList = map(storedProductList);

export const $colors = computed(productList, ({ data: products }) => {
    if (!products) return undefined;
    return Object.fromEntries(Object.entries<{ colors: string[] }>(products).map(([sku, params]) => [sku, params.colors]));
});

export type Sizes = Record<string, { width: number; length: number; available: Record<string, number> }>;
export const $sizes = computed(productList, ({ data: products }) => {
    if (!products) return undefined;
    return Object.fromEntries(
        Object.entries<{ size: Sizes }>(products).map(([sku, params]) => {
            const sortedSizes = Object.fromEntries(
                Object.entries<Sizes[keyof Sizes]>(params.size).sort(([sizeA], [sizeB]) => alphabeticCompare(sizeA, sizeB)),
            );
            return [sku, sortedSizes];
        }),
    );
});

export const $availableSizesByColor = computed(productList, ({ data: products }) => {
    if (!products) return undefined;
    return Object.fromEntries(
        Object.entries<{ colors: string[]; size: Sizes }>(products).map(([sku, params]) => {
            const available = Object.fromEntries(params.colors.map((color) => [color, new Set<string>()]));
            for (const [size, rest] of Object.entries(params.size)) {
                for (const [color, count] of Object.entries(rest.available)) {
                    if (color in available && count !== 0) available[color].add(size);
                }
            }
            return [sku, available];
        }),
    );
});

export const $prices = computed(productList, ({ data: products }) => {
    if (!products) return undefined;
    return Object.fromEntries(Object.entries<{ price: number }>(products).map(([sku, params]) => [sku, params.price]));
});
