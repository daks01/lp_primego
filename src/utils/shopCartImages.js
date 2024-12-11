import { getImage } from 'astro:assets';
import { productOptMap } from './product-list';

export async function optimizedImagesMap() {
    let imageMap = {}
    await Promise.all(Object.keys(productOptMap).map(async (sku) => {
        const result = {};
        result[sku] = {};
        await Promise.all(Object.keys(productOptMap[sku].images).map(async (colorName) => {
            const importedImage = productOptMap[sku].images[colorName];
            const optimizedImage = await getImage({
                src: importedImage,
                width: 220,
                height: 220,
                format: "webp",
            });
            const imageUrl = optimizedImage.src;
            result[sku][colorName] = imageUrl;
        }));
        imageMap = {
            ...imageMap,
            ...result,
        }
    }));

    return imageMap;
};