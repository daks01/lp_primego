import { getImage } from 'astro:assets';
import { addProductImg } from '../stores/productListStore';
import { productOptMap } from './product-list';

// generate small prewiew 4 shop cart
export function optimizeImagesAndSaveInStore() {
    Object.keys(productOptMap).map((sku) => {
        Object.keys(productOptMap[sku].images).map(async (color) => {
            const importedImage = productOptMap[sku].images[color];

            await getImage({
                src: importedImage,
                width: 220,
                height: 220,
                format: "webp",
            }).then((optimizedImage) => {
                const imageUrl = optimizedImage.src;
                
                addProductImg(sku, color, imageUrl)
            });
        });
    });
};