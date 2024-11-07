import React, { Fragment, useEffect, useMemo, useState } from 'react';
import Tooltip from '../../ui/react/Tooltip';
import styles from './FittingRoom.module.scss';
import cn from 'classnames';
import { productList } from '../../../stores/productListStore';
import { colorMap } from '../../../utils/product-list';
import { priceWithRouble } from '../../../utils/format';

interface LocalState {
    color?: string;
    width?: number;
    length?: number;
    measurementsApproval?: boolean;
    recommended?: string;
    size?: string;
    selectedSizeApproval?: boolean;
}
type Sizes = Record<string, { width: number; length: number }>;

export default function FittingRoom({ sku, howToMeasureButton }) {
    const { colors, sizes, available, lengths, widths, price } = useAvailableProperties(sku);
    const [state, setState] = useState<LocalState>({});
    const isAvailableSize = (size: string) => !state.color || available[state.color].has(size);
    const onColorSelect = (color: string) =>
        setState((prev) => {
            const recommendedIsAvailable = prev.recommended && available[color].has(prev.recommended);
            if (!prev.size && recommendedIsAvailable) return { ...prev, color, size: prev.recommended };
            const sizeIsAvailable = prev.size && available[color].has(prev.size);
            if (!sizeIsAvailable) return { ...prev, color, size: undefined };
            return { ...prev, color };
        });
    const onWidthSelect: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
        const value = parseFloat(e.target.value);
        setState((prev) => ({
            ...prev,
            width: !isNaN(value) ? value * 10 : undefined,
            measurementsApproval: false,
            recommended: undefined,
            size: undefined,
        }));
    };
    const onLengthSelect: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
        const value = parseFloat(e.target.value);
        setState((prev) => ({
            ...prev,
            length: !isNaN(value) ? value * 10 : undefined,
            measurementsApproval: false,
            recommended: undefined,
            size: undefined,
        }));
    };
    const onMeasurementsApprove: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        const checked = e.target.checked;
        setState((prev) => {
            const recommended = checked ? getRecommendedSize(sizes, { width: prev.width, length: prev.length }) : undefined;
            const size = checked ? (recommended && isAvailableSize(recommended) ? recommended : undefined) : undefined;
            return { ...prev, measurementsApproval: checked, recommended, size };
        });
    };
    const onSizeSelect = (size: string) => setState((prev) => ({ ...prev, size, selectedSizeApproval: false }));
    const onSizeApprove: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        setState((prev) => ({ ...prev, selectedSizeApproval: e.target.checked }));
    };
    useEffect(() => {
        if (!state.color) onColorSelect(colors[0]);
    }, [colors]);
    const isSubmitEnabled =
        (state.recommended && state.recommended === state.size) ||
        (state.recommended && state.recommended !== state.size && state.selectedSizeApproval);
    return (
        <form className={cn(styles.productForm, { [styles.empire]: sku === 'EM24', [styles.royal]: sku === 'RL24' })}>
            <fieldset className={styles.productFieldset}>
                <legend className={styles.productFieldset__legend}>Выбери цвет модели</legend>
                <div className={styles.colourSelect}>
                    {colors.map((color) => (
                        <label
                            className={styles.colourSelect__option}
                            aria-label={colorMap[color]}
                            key={color}
                            title={colorMap[color]}
                        >
                            <input
                                type="radio"
                                name="colour"
                                checked={state.color === color}
                                onChange={() => onColorSelect(color)}
                            />
                            <span className={cn(styles.colourSelect__pic, styles[color.replace(/\s/g, '-')])} />
                        </label>
                    ))}
                </div>
            </fieldset>
            <fieldset className={cn([styles.productFieldset, styles.measureStep])}>
                <legend className={styles.productFieldset__legend}>Определи свой размер</legend>
                <>{howToMeasureButton}</>
                <span className={styles.productFieldset__description}>Параметры стопы</span>
                <div className={styles.measuring}>
                    <label className={styles.measuring__label}>
                        Длина (см):
                        <select aria-label="Выбрать длину" className={styles.measuring__select} onChange={onLengthSelect}>
                            <option>–</option>
                            {lengths.map((length) => (
                                <option key={length}>{length / 10}</option>
                            ))}
                        </select>
                    </label>
                    <label className={styles.measuring__label}>
                        Ширина
                        <br />
                        в широкой части (см):
                        <select aria-label="Выбрать ширину" className={styles.measuring__select} onChange={onWidthSelect}>
                            <option>–</option>
                            {widths.map((width) => (
                                <option key={width}>{width / 10}</option>
                            ))}
                        </select>
                    </label>
                </div>
                {state?.length && state.width ? (
                    <label className={styles.productFieldset__approval}>
                        <input type="checkbox" checked={state.measurementsApproval} onChange={onMeasurementsApprove} />
                        Подтвердите указанные размеры
                    </label>
                ) : null}
            </fieldset>
            <fieldset className={styles.productFieldset}>
                <legend className={styles.productFieldset__legend}>Выбери размер</legend>
                <div className={styles.sizes}>
                    {Object.keys(sizes)?.map((size) => {
                        const disabled = !isAvailableSize(size);
                        const recommended = state.recommended === size;
                        const checked = state.size === size;
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
                <span className={styles.productFieldset__description}>Параметры модели</span>
                <div className={styles.measuring}>
                    <span className={styles.measuring__label}>
                        Длина по стельке (см):
                        <span className={styles.measuring__value}>{state.size ? sizes[state.size].length / 10 : '-'}</span>
                    </span>
                    <span className={styles.measuring__label}>
                        Ширина по стельке
                        <br />
                        в широкой части (см):
                        <span className={styles.measuring__value}>{state.size ? sizes[state.size].width / 10 : '-'}</span>
                    </span>
                </div>
                {state.recommended && state.size && state.recommended !== state.size ? (
                    <label className={styles.productFieldset__approval}>
                        <input type="checkbox" checked={state.selectedSizeApproval} onChange={onSizeApprove} />
                        Внимание! Выбранный размер не совпадает с рекомендованным, продолжить?
                    </label>
                ) : null}
            </fieldset>
            <div className={styles.productForm__footer}>
                <div className={styles.productPrice}>
                    <span className={styles.productPrice__label}>Цена</span>
                    {price ? priceWithRouble(price) : '-'}
                </div>
                <button type="submit" className={cn('button', styles.buyProductButton)} disabled={!isSubmitEnabled}>
                    Оформить заказ
                </button>
            </div>
        </form>
    );
}

const useAvailableProperties = (sku: string) => {
    const [colors, setColors] = useState<string[]>([]);
    const [sizes, setSizes] = useState<Sizes>({});
    const [available, setAvailable] = useState<Record<string, Set<string>>>({});
    const [price, setPrice] = useState<number | null>(null);
    useEffect(() => {
        productList.subscribe((data) => {
            if (!data?.data) return;
            const currentProduct = sku ? data.data[sku] : null;
            setPrice(currentProduct.price);
            setColors(currentProduct.colors);
            const sortedSizes = Object.fromEntries(
                Object.entries<Sizes[keyof Sizes]>(currentProduct.size).sort(([sizeA], [sizeB]) =>
                    alphabeticCompare(sizeA, sizeB),
                ),
            );
            setSizes(sortedSizes);

            const available: Record<string, Set<string>> = Object.fromEntries(
                currentProduct.colors.map((color) => [color, new Set()]),
            );
            for (const [size, rest] of Object.entries<{ available: Record<string, number> }>(currentProduct.size)) {
                for (const [color, count] of Object.entries(rest.available)) {
                    if (count !== 0) available[color].add(size);
                }
            }
            setAvailable(available);
        });
    }, [sku]);
    const widths = useMemo(() => Array.from(getRange(Object.values<Sizes[keyof Sizes]>(sizes), 'width')), [sizes]);
    const lengths = useMemo(() => Array.from(getRange(Object.values<Sizes[keyof Sizes]>(sizes), 'length', 5)), [sizes]);
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

const alphabeticCompare = (a: string, b: string) => {
    if (a > b) return 1;
    if (a < b) return -1;
    return 0;
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
