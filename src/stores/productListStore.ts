import { map } from 'nanostores';
import { apiUrl } from '../utils/routes';
import { nanoquery } from '@nanostores/query';

export const [createFetcherStore, createMutatorStore] = nanoquery({
    fetcher: (...keys) => fetch(keys.join('')).then((r) => r.json()),
});

let storedProductList = JSON.parse(localStorage.getItem('productList')) || {};

export const productsAvailability = createFetcherStore(apiUrl.availability);

productsAvailability.subscribe((data) => {   
    if(!data?.data) {
        return;
    }
    
    productList.set(data)
    localStorage.setItem('productList', JSON.stringify(data));
});

export const productList = map(storedProductList);