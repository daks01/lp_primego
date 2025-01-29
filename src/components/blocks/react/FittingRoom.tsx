import React, { useEffect, useMemo, useState } from 'react';
import Tooltip from '../../ui/react/Tooltip';
import styles from './FittingRoom.module.scss';
import cn from 'classnames';
import { $availableSizesByColor, $colors, $prices, $sizes, type Sizes } from '../../../stores/productListStore';
import { colorMap, productOptMap } from '../../../utils/product-list';
import { useStore } from '@nanostores/react';
import { $selectedProduct, updateProduct } from '../../../stores/fittingProductStore';
import { addCartItem } from '../../../stores/shopCartStore';
import MeasurementsIllustration from '../../content/react/MeasurementsIllustration.tsx';
import { useTranslations } from '../../../i18n/utils';

const lang = document.documentElement.lang;
const t = useTranslations(lang);

export default function FittingRoom({ sku, howToMeasureButton, sizeWarning }) {
    const { colors, sizes, available, lengths, widths, price } = useAvailableProperties(sku);
    const [measurementsApproval, setMeasurementsApproval] = useState<boolean>(false);
    const store = useStore($selectedProduct);
    useEffect(() => updateProduct({ sku }), []);

    const isAvailableSize = (size: string) => !store.color || available?.[store.color].has(size);
    const onColorSelect = (color: string) => {
        const recommendedIsAvailable = store.recommended && available?.[color].has(store.recommended);
        if (!store.size && recommendedIsAvailable) {
            updateProduct({ size: store.recommended, color });
            return;
        }
        const sizeIsAvailable = store.size && available?.[color].has(store.size);
        if (!sizeIsAvailable) {
            updateProduct({ size: undefined, color });
            return;
        }
        updateProduct({ color });
    };
    const onWidthSelect: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
        const value = parseFloat(e.target.value);
        const width = !isNaN(value) ? value * 10 : undefined;
        updateProduct({ width, recommended: undefined, size: undefined });
        setMeasurementsApproval(false);
    };
    const onLengthSelect: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
        const value = parseFloat(e.target.value);
        const length = !isNaN(value) ? value * 10 : undefined;
        updateProduct({ length, recommended: undefined, size: undefined });
        setMeasurementsApproval(false);
    };
    const onMeasurementsApprove: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        const checked = e.target.checked;
        const recommended =
            checked && sizes ? getRecommendedSize(sizes, { width: store.width, length: store.length }) : undefined;
        const size = checked ? (recommended && isAvailableSize(recommended) ? recommended : undefined) : undefined;
        updateProduct({ recommended, size });
        setMeasurementsApproval(checked);
    };
    const onSizeSelect = (size: string) => updateProduct({ size, selectedSizeApproval: false });
    const onSizeApprove: React.ChangeEventHandler<HTMLInputElement> = (e) =>
        updateProduct({ selectedSizeApproval: e.target.checked });
    useEffect(() => {
        if (colors && !store.color) onColorSelect(colors[0]);
    }, [colors]);
    const isSubmitEnabled =
        (store.recommended && store.recommended === store.size) ||
        (store.recommended && store.recommended !== store.size && store.selectedSizeApproval);
    const onFormSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        const { color, size } = store;

        addCartItem({
            sku,
            color: color || '',
            size: size || '',
        });
        window['dialog-shopcart']?.showModal();
    };
    return (
        <form className={cn(styles.productForm, styles[productOptMap[sku].altName])} onSubmit={onFormSubmit}>
            <fieldset className={styles.productFieldset}>
                <legend className={styles.productFieldset__legend}>Выбери цвет модели</legend>
                <div className={styles.colourSelect}>
                    {colors?.map((color) => (
                        <label
                            className={styles.colourSelect__option}
                            aria-label={colorMap[color]}
                            key={color}
                            title={colorMap[color]}
                        >
                            <input
                                type="radio"
                                name="colour"
                                checked={store.color === color}
                                onChange={() => onColorSelect(color)}
                            />
                            <span className={cn(styles.colourSelect__pic, styles[color.replace(/\s/g, '-')])} />
                        </label>
                    ))}
                </div>
            </fieldset>
            <MeasurementsIllustration withoutSole showOn="mobile" className={styles.measurementsDemo} warning={sizeWarning} />
            <fieldset className={cn([styles.productFieldset, styles.measureStep])}>
                <legend className={styles.productFieldset__legend}>Определи свой размер</legend>
                <>{howToMeasureButton}</>
                <span className={styles.productFieldset__description}>Параметры стопы</span>
                <div className={styles.measuring}>
                    <label className={styles.measuring__label}>
                        Длина (см):
                        <select
                            aria-label="Выбрать длину"
                            className={styles.measuring__select}
                            onChange={onLengthSelect}
                            value={store.length ? store.length / 10 : undefined}
                        >
                            <option>–</option>
                            {lengths?.map((l) => <option key={l}>{l / 10}</option>)}
                        </select>
                    </label>
                    <label className={styles.measuring__label}>
                        Ширина
                        <br />
                        в широкой части (см):
                        <select
                            aria-label="Выбрать ширину"
                            className={styles.measuring__select}
                            onChange={onWidthSelect}
                            value={store.width ? store.width / 10 : undefined}
                        >
                            <option>–</option>
                            {widths?.map((w) => <option key={w}>{w / 10}</option>)}
                        </select>
                    </label>
                </div>
                {store.length && store.width ? (
                    <label className={styles.productFieldset__approval}>
                        <input type="checkbox" checked={measurementsApproval} onChange={onMeasurementsApprove} />
                        Подтвердите указанные размеры
                    </label>
                ) : null}
            </fieldset>
            <MeasurementsIllustration showOn="mobile" className={styles.measurementsDemo} warning={sizeWarning} />
            <fieldset className={styles.productFieldset} disabled={!store.length || !store.width || !measurementsApproval}>
                <legend className={styles.productFieldset__legend}>Выбери размер</legend>
                {!sizes ? null : (
                    <div className={styles.sizes}>
                        {Object.keys(sizes)?.map((size) => {
                            const disabled = !isAvailableSize(size);
                            const recommended = store.recommended === size;
                            const checked = store.size === size;
                            const tooltip = getTooltipContent({ disabled, checked, recommended });
                            return tooltip ? (
                                <Tooltip content={tooltip} key={size}>
                                    <SizeButton
                                        recommended={recommended}
                                        disabled={disabled}
                                        checked={checked}
                                        onChange={() => onSizeSelect(size)}
                                    >
                                        {size}
                                    </SizeButton>
                                </Tooltip>
                            ) : (
                                <SizeButton
                                    key={size}
                                    recommended={recommended}
                                    disabled={disabled}
                                    checked={checked}
                                    onChange={() => onSizeSelect(size)}
                                >
                                    {size}
                                </SizeButton>
                            );
                        })}
                    </div>
                )}
                <span className={styles.productFieldset__description}>Параметры модели</span>
                <div className={styles.measuring}>
                    <span className={styles.measuring__label}>
                        Длина по стельке (см):
                        <span className={styles.measuring__value}>
                            {store.size && sizes ? sizes[store.size].length / 10 : '-'}
                        </span>
                    </span>
                    <span className={styles.measuring__label}>
                        Ширина по стельке
                        <br />
                        в широкой части (см):
                        <span className={styles.measuring__value}>
                            {store.size && sizes ? sizes[store.size].width / 10 : '-'}
                        </span>
                    </span>
                </div>
                {store.recommended && store.size && store.recommended !== store.size ? (
                    <label className={styles.productFieldset__approval}>
                        <input type="checkbox" checked={store.selectedSizeApproval} onChange={onSizeApprove} />
                        {t("fitting.Внимание! Выбранный размер не совпадает с рекомендованным, продолжить?")}
                    </label>
                ) : null}
            </fieldset>
            <div className={styles.productForm__footer}>
                {/* <div className={styles.productPrice}>{price ? priceWithRouble(price) : '-'}</div> */}
                <button type="submit" className={cn('button', styles.buyProductButton)} disabled={!isSubmitEnabled}>
                    {t("fitting.Оформить заказ")}
                </button>
            </div>
        </form>
    );
}

const useAvailableProperties = (sku: string) => {
    const sizes = useStore($sizes)?.[sku];
    const colors = useStore($colors)?.[sku];
    const price = useStore($prices)?.[sku];
    const available = useStore($availableSizesByColor)?.[sku];
    const widths = useMemo(() => (sizes ? Array.from(getRange(Object.values(sizes), 'width')) : undefined), [sizes]);
    const lengths = useMemo(() => (sizes ? Array.from(getRange(Object.values(sizes), 'length', 5)) : undefined), [sizes]);
    return { colors, sizes, available, widths, lengths, price };
};

function* getRange(sizes: Array<Sizes[keyof Sizes]>, measure: 'width' | 'length', step = 1) {
    const values = sizes.map((s) => s[measure]);
    const min = Math.min(...values);
    const max = Math.max(...values);
    for (let i = min; i <= max; i = i + step) {
        yield i;
    }
}

const getRecommendedSize = (sizes: Sizes, { width, length }: { width?: number; length?: number }) => {
    if (!width || !length) return undefined;
    for (const [size, params] of Object.entries(sizes)) {
        if (params.length >= length && params.width >= width) return size;
    }
};

interface SizeButtonProps extends Omit<React.ComponentProps<'input'>, 'type' | 'name'> {
    children: string;
    recommended: boolean;
}
const SizeButton = React.forwardRef<HTMLLabelElement, SizeButtonProps>(
    ({ children: size, recommended, checked, disabled, ...inputProps }, ref) => (
        <label className={styles.sizes__label} ref={ref}>
            <input {...inputProps} type="radio" name="size" checked={checked} disabled={disabled} />
            <span
                className={cn('button', 'button_type-secondary', styles.sizes__label__content, {
                    [styles.sizes__recomended]: recommended,
                })}
            >
                {size}
            </span>
        </label>
    ),
);

const getTooltipContent = ({
    checked,
    disabled,
    recommended,
}: Pick<SizeButtonProps, 'recommended' | 'disabled' | 'checked'>) => {
    if (checked) return 'Выбранный размер';
    if (recommended) return 'Ваш рекомендованный размер';
    if (disabled) return 'Размер временно отсутствует';
    return null;
};
