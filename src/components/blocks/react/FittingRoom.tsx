import React, { useEffect, useMemo, useState } from 'react';
import Tooltip from '../../ui/react/Tooltip';
import styles from './FittingRoom.module.scss';
import cn from 'classnames';
import { $availableSizesByColor, $colors, $prices, $sizes, type Sizes } from '../../../stores/productListStore';
import { colorMap, productOptMap } from '../../../utils/product-list';
import { useStore } from '@nanostores/react';
import { $selectedProduct, getSuitableInsoleSizes, updateProduct } from '../../../stores/fittingProductStore';
import { addCartItem, usdExchangeRate } from '../../../stores/shopCartStore';
import MeasurementsIllustration from '../../content/react/MeasurementsIllustration.tsx';
import { useTranslations } from '../../../i18n/utils';
import { priceWithRouble, priceWithDollar } from '../../../utils/format.js';

const lang = document.documentElement.lang as 'en' | 'ru';
const isEnglishVersion = lang === 'en';
const t = useTranslations(lang);

const getShoeWidthFor = (sku: string) => {
    switch (sku) {
        case 'EM24':
            return 'wide';
        case 'RL24':
            return 'standard';
        default:
            return null;
    }
};

export default function FittingRoom({ sku, howToMeasureButton, widthWarning, sizeWarning }) {
    const { colors, sizes, available, lengths, widths, price } = useAvailableProperties(sku);
    const [measurementsApproval, setMeasurementsApproval] = useState<boolean>(false);
    const [showWidthWarning, setShowWidthWarning] = useState<boolean>(false);
    const store = useStore($selectedProduct);
    const usdExchangeValue = useStore(usdExchangeRate);
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
    const widthFor = getShoeWidthFor(sku);
    const onMeasurementsApprove: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        const checked = e.target.checked;
        const recommendations = sizes
            ? getRecommendations(sizes, widthFor, { width: store.width, length: store.length })
            : undefined;
        const recommendedSize = recommendations?.size;
        const recommended = checked ? recommendedSize : undefined;
        const size = checked ? (recommended && isAvailableSize(recommended) ? recommended : undefined) : undefined;
        updateProduct({ recommended, size });
        setShowWidthWarning(Boolean(recommendations?.warning));
        setMeasurementsApproval(checked);
    };
    const onSizeSelect = (size: string) => updateProduct({ size, selectedSizeApproval: false });
    const onSizeApprove: React.ChangeEventHandler<HTMLInputElement> = (e) =>
        updateProduct({ selectedSizeApproval: e.target.checked });
    useEffect(() => {
        if (colors && !store.color) onColorSelect(colors[0]);
    }, [colors]);
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
    const isStep2Completed = store.length && store.width && measurementsApproval;
    const isStep3Completed =
        (store.recommended && store.recommended === store.size) ||
        (store.recommended && store.recommended !== store.size && store.selectedSizeApproval);
    return (
        <form className={cn(styles.productForm, styles[productOptMap[sku].altName])} onSubmit={onFormSubmit}>
            <fieldset className={styles.productFieldset}>
                <legend className={styles.productFieldset__legend}>
                    {t("fitting.Выбери цвет модели")}</legend>
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
            <MeasurementsIllustration
                sku={sku}
                withoutSole
                showOn="mobile"
                className={styles.measurementsDemo}
                warning={sizeWarning}
            />
            <fieldset className={cn([styles.productFieldset, styles.measureStep])}>
                <legend className={styles.productFieldset__legend}>
                    {t("fitting.Определи свой размер")}</legend>
                <>{howToMeasureButton}</>
                <span className={styles.productFieldset__description}>
                    {t("fitting.Параметры стопы")}</span>
                <div className={styles.measuring}>
                    <label className={styles.measuring__label}>
                        {t("fitting.Длина (см)")}:
                        <select
                            aria-label={t("fitting.Выбрать длину")}
                            className={styles.measuring__select}
                            onChange={onLengthSelect}
                            value={store.length ? store.length / 10 : undefined}
                        >
                            <option>–</option>
                            {lengths?.map((l) => <option key={l}>{l / 10}</option>)}
                        </select>
                    </label>
                    <label className={styles.measuring__label}>
                        <span dangerouslySetInnerHTML={{ __html: t("fitting.Ширина <br /> в широкой части (см)")}}></span>
                        <select
                            aria-label={t("fitting.Выбрать ширину")}
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
                    <>
                        <label className={styles.productFieldset__approval}>
                            <input type="checkbox" checked={measurementsApproval} onChange={onMeasurementsApprove} />
                            {t("fitting.Подтвердите указанные размеры")}
                        </label>
                        {measurementsApproval && showWidthWarning ? (
                            <div className={styles.productFieldset__warning}>{widthWarning}</div>
                        ) : null}
                    </>
                ) : null}
            </fieldset>
            <MeasurementsIllustration sku={sku} showOn="mobile" className={styles.measurementsDemo} warning={sizeWarning} />
            <fieldset className={styles.productFieldset} disabled={!isStep2Completed}>
                <legend className={styles.productFieldset__legend}>
                    {t("fitting.Выбери размер")}
                </legend>
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
                <span className={styles.productFieldset__description}>
                    {t("fitting.Параметры модели")}
                </span>
                <div className={styles.measuring}>
                    <span className={styles.measuring__label}>
                        {t("fitting.Длина по стельке (см)")}:
                        <span className={styles.measuring__value}>
                            {store.size && sizes ? sizes[store.size].length / 10 : '-'}
                        </span>
                    </span>
                    <span className={styles.measuring__label}>
                        <span dangerouslySetInnerHTML={{ __html: t("fitting.Ширина по стельке <br /> в широкой части (см)")}}></span>:
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
            {!isStep3Completed ? null : (
                <div className={styles.productFieldset}>
                    <span className={styles.productFieldset__description}>{t('fitting.Ваша стопа')}</span>
                    <div className={styles.measuring}>
                        <span className={styles.measuring__label}>
                            {t('fitting.Длина (см)')}:
                            <span className={styles.measuring__value}>{store.length ? store.length / 10 : undefined}</span>
                        </span>
                        <span className={styles.measuring__label}>
                            <span dangerouslySetInnerHTML={{ __html: t('fitting.Ширина <br /> в широкой части (см)') }}></span>:
                            <span className={styles.measuring__value}>
                                <span className={styles.measuring__value}>{store.width ? store.width / 10 : undefined}</span>
                            </span>
                        </span>
                    </div>
                    <span className={styles.productFieldset__description}>{t('fitting.Выбранная модель (размеры по стельке)')}</span>
                    <div className={styles.measuring}>
                        <span className={styles.measuring__label}>
                            {t('fitting.Длина (см)')}:
                            <span className={styles.measuring__value}>
                                {store.size && sizes ? sizes[store.size].length / 10 : '-'}
                            </span>
                        </span>
                        <span className={styles.measuring__label}>
                            <span
                                dangerouslySetInnerHTML={{ __html: t('fitting.Ширина <br /> в широкой части (см)') }}
                            />
                            :
                            <span className={styles.measuring__value}>
                                {store.size && sizes ? sizes[store.size].width / 10 : '-'}
                            </span>
                        </span>
                    </div>
                </div>
            )}
            <div className={styles.productForm__footer}>
                <div className={styles.productPrice}>
                    <div className={styles.productPrice__title}>
                        {t("fitting.Цена")}
                    </div>
                    { (isEnglishVersion && usdExchangeValue > 1) && priceWithDollar(price / usdExchangeValue)}
                    { (isEnglishVersion && usdExchangeValue === 1) && "$"}
                    { !isEnglishVersion && priceWithRouble(price) }
                </div>
                <button type="submit" className={cn('button', styles.buyProductButton)} disabled={!isStep3Completed}>
                    {t("fitting.Заказать")}
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
    const widths = useMemo(
        () => (sizes ? Array.from(getRange(Object.values(sizes), 'width', 1, { left: 3 })) : undefined),
        [sizes],
    );
    const lengths = useMemo(
        () => (sizes ? Array.from(getRange(Object.values(sizes), 'length', 5, { left: 10, right: -5 })) : undefined),
        [sizes],
    );
    return { colors, sizes, available, widths, lengths, price };
};

function* getRange(
    sizes: Array<Sizes[keyof Sizes]>,
    measure: 'width' | 'length',
    step = 1,
    margins?: { left?: number; right?: number },
) {
    const values = sizes.map((s) => s[measure]);
    const min = Math.min(...values) - (margins?.left ?? 0);
    const max = Math.max(...values) + (margins?.right ?? 0);
    for (let i = min; i <= max; i = i + step) {
        yield i;
    }
}

const getRecommendations = (
    sizes: Sizes,
    widthShoe: ReturnType<typeof getShoeWidthFor>,
    { width, length }: { width?: number; length?: number },
): { size: string; warning?: 'narrower' | 'wider' } | undefined => {
    if (!width || !length) return undefined;
    const { minLength, maxLength, minWidth, maxWidth } = getSuitableInsoleSizes({ width, length });
    let warning: 'narrower' | 'wider' | undefined = undefined;
    for (const [size, { width, length }] of Object.entries(sizes)) {
        const fitByLength = minLength <= length && length <= maxLength;
        const fitByWidth = minWidth <= width && width <= maxWidth;
        if (fitByLength && !fitByWidth) {
            if (minWidth < width && widthShoe === 'wide') {
                warning = 'narrower';
            } else if (width < maxWidth && widthShoe === 'standard') {
                warning = 'wider';
            }
        }
        if (minLength <= length && minWidth <= width) {
            return { size, warning };
        }
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
    if (checked) return t("fitting.Выбранный размер");
    if (recommended) return t("fitting.Ваш рекомендованный размер");
    if (disabled) return t("fitting.Размер временно отсутствует");
    return null;
};
