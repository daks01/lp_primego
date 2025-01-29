<template>
    <div>
        <template v-if="Object.values($cartItems).length">
            <ul class="product-list">
                <li v-for="cartItem in Object.values($cartItems)" :key="cartItem.id" class="product-list__item">
                    <div class="col col_1">
                        <img 
                            :src="cartItem?.img" 
                            :alt="cartItem.name" 
                            class="product-img" 
                            width="110"
                            onerror="this.src='/favicon.svg'"
                        />
                    </div>
                    <div class="col col_2 col_desc">
                        <span class="product-tag">
                            {{cartItem.type}}
                        </span>
                        <div :class="['font_star-trek product-title display-mobile-none', {
                            'empire': cartItem.sku === productOptMap.EM24.sku,
                            'royal': cartItem.sku === productOptMap.RL24.sku,
                        }]">
                            {{cartItem.name}}
                        </div>
                        <div class="product-desc">
                            <div class="product-desc__item">
                                Размер:
                                {{cartItem.size}}
                            </div>
                            <div class="product-desc__item">
                                Модель:
                                {{cartItem.sku}}
                            </div>
                            <div class="product-desc__item">
                                Цвет:
                                {{colorMap[cartItem.color]}}
                            </div>
                        </div>
                    </div>
                    <div class="col col_3 col_align-center">
                        <div class="font_star-trek product-title display-none display-mobile-block">
                            {{cartItem.name}}
                        </div>
                        <span class="product-price">
                            <template v-if="isEnglishVersion && $usdExchangeRate > 0">
                                {{ priceWithDollar(cartItem.price / $usdExchangeRate) }}
                            </template>
                            <template v-else>
                                {{ priceWithRouble(cartItem.price) }}
                            </template> 
                        </span>
                    </div>
                    <div class="col col_4 col_align-center">
                        <button type="button" class="button button_type-icon" aria-label="Удалить"
                            @click="removeItem(cartItem.id)">
                            <svg role="presentation" width="24" height="25" viewBox="0 0 24 25" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M12 22.5C17.5228 22.5 22 18.0228 22 12.5C22 6.97715 17.5228 2.5 12 2.5C6.47715 2.5 2 6.97715 2 12.5C2 18.0228 6.47715 22.5 12 22.5Z"
                                    stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M15 9.5L9 15.5" stroke="white" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round" />
                                <path d="M9 9.5L15 15.5" stroke="white" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round" />
                            </svg>
                        </button>
                    </div>
                </li>
            </ul>
            <div class="total">
                Всего<br>
                <span class="total-price">
                    <template v-if="isEnglishVersion && $usdExchangeRate > 0">
                       {{ priceWithDollar($totalPrice / $usdExchangeRate) }}
                    </template>
                    <template v-else>
                        {{ priceWithRouble($totalPrice) }}
                    </template> 
                </span>
            </div>
        </template>
        <p v-else>Корзина пуста</p>

        <form action="" @submit.prevent="buy()">
            <fieldset>
                <legend>
                    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="1" y="1" width="62" height="62" rx="31" stroke="#C9C8D3" stroke-width="2"/>
                        <path d="M30.744 40.5V24.9L32.112 26.316H27.192V23.7H33.864V40.5H30.744Z" fill="#C9C8D3"/>
                    </svg>
                    Получатель
                </legend>
                <input type="phone" aria-label="Номер телефона" placeholder="Номер телефона*" v-model="formData.phone"
                    class="input" required>
                <input type="text" aria-label="Имя" placeholder="Имя" v-model="formData.name" class="input">
                <input type="text" aria-label="Фамилия" placeholder="Фамилия" v-model="formData.surname" class="input">
                <input type="email" aria-label="E-mail" placeholder="E-mail" v-model="formData.email" class="input">
                <input type="text" aria-label="Почтовый адрес" placeholder="Почтовый адрес" v-model="formData.address"
                    class="input">
            </fieldset>
            <fieldset>
                <legend>
                    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="1" y="1" width="62" height="62" rx="31" stroke="#C9C8D3" stroke-width="2"/>
                        <path d="M25.84 40.5V38.412L32.512 32.076C33.072 31.548 33.488 31.084 33.76 30.684C34.032 30.284 34.208 29.916 34.288 29.58C34.384 29.228 34.432 28.9 34.432 28.596C34.432 27.828 34.168 27.236 33.64 26.82C33.112 26.388 32.336 26.172 31.312 26.172C30.496 26.172 29.752 26.316 29.08 26.604C28.424 26.892 27.856 27.332 27.376 27.924L25.192 26.244C25.848 25.364 26.728 24.684 27.832 24.204C28.952 23.708 30.2 23.46 31.576 23.46C32.792 23.46 33.848 23.66 34.744 24.06C35.656 24.444 36.352 24.996 36.832 25.716C37.328 26.436 37.576 27.292 37.576 28.284C37.576 28.828 37.504 29.372 37.36 29.916C37.216 30.444 36.944 31.004 36.544 31.596C36.144 32.188 35.56 32.852 34.792 33.588L29.056 39.036L28.408 37.86H38.224V40.5H25.84Z" fill="#C9C8D3"/>
                    </svg>
                    Тип доставки
                </legend>
                <label class="inputCheckbox">
                    <input
                        class="inputCheckbox__input"
                        type="radio" 
                        id="radio-1" 
                        v-model="formData.delivery" 
                        checked
                        value="Курьерская доставка до двери (Москва и Санкт Петербург)" 
                    />
                    <span class="inputCheckbox__radio-box"></span>
                    <span class="inputCheckbox__label">Курьерская доставка до&nbsp;двери (Москва и&nbsp;Санкт&nbsp;Петербург)</span>
                </label>
                <label class="inputCheckbox">
                    <input 
                        class="inputCheckbox__input"
                        type="radio" 
                        id="radio-2" 
                        v-model="formData.delivery"
                        value="СДЭК (доставка по России)" 
                    />
                    <span class="inputCheckbox__radio-box"></span>
                    <span class="inputCheckbox__label">СДЭК (доставка по&nbsp;России)</span>
                </label>
                <label class="inputCheckbox">
                    <input 
                        class="inputCheckbox__input"
                        type="radio" 
                        id="radio-3" 
                        v-model="formData.delivery"
                        value="БОКСБЕРРИ (Доставка по России)" 
                    />
                    <span class="inputCheckbox__radio-box"></span>
                    <span class="inputCheckbox__label">БОКСБЕРРИ (Доставка по&nbsp;России)</span>
                </label>
            </fieldset>
            <div class="form__footer">
                <button
                    type="submit" 
                    class="button button_size-large button_fullwidth"
                    :disabled="status === 'sending' || Object.values($cartItems).length === 0"
                >
                    Заказать
                </button>
                <p v-if="status === 'error'" class="submit-message">
                    ❗ При отправке заказа возникли проблемы. Попробуйте позже
                </p>
                <p v-if="status === 'success'" class="submit-message">
                    ✅ Заказ отправлен. Ожидайте звонка
                </p>
            </div>
        </form>
    </div>
</template>

<script setup>
import { ref, toRaw } from 'vue';
import { useStore } from '@nanostores/vue';
import { cartItems, totalPrice, usdExchangeRate } from './../../stores/shopCartStore';
import { apiUrl } from './../../utils/routes';
import { priceWithRouble, priceWithDollar } from './../../utils/format';
import { colorMap } from './../../utils/product-list';
import { productOptMap } from "../../utils/product-list";
import { getLangFromUrl, useTranslatedPath } from "../../i18n/utils";

const lang = getLangFromUrl(window.location);
const translatePath = useTranslatedPath(lang);

const isEnglishVersion = lang === 'en';

const $cartItems = useStore(cartItems);
const $totalPrice = useStore(totalPrice);
const $usdExchangeRate = useStore(usdExchangeRate);
let status = ref('idle');

const formData = ref({
    name: '',
    surname: '',
    email: '',
    phone: '',
    address: '',
    delivery: '',
});

function removeItem(id) {
    cartItems.setKey(id, undefined);
}

function buy() {
    status.value = 'sending';

    const {
        name,
        surname,
        email,
        phone,
        address,
        delivery,
    } = toRaw(formData.value);

    let items = {};
    for (const key in toRaw($cartItems.value)) {
        const item = toRaw($cartItems.value)[key];
        items = {
            ...items,
            [key]: {
                sku: item.sku,
                name: item.name,
                price: `${toRaw(item.price)}₽`,
                size: item.size,
                color: item.color,
            }
        };
    }

    const fetchBody = {
        name,
        surname,
        email,
        phone,
        address,
        delivery,
        items,
        totalPrice: `${toRaw($totalPrice.value)}₽`,
        usd: isEnglishVersion ? `${$usdExchangeRate.value}₽` : "",
    }

    fetch(apiUrl.buy, {
        redirect: "follow",
        method: "POST",
        headers: {
            "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify(fetchBody)
    }).then(response => {
        if (!response.ok) {
            status.value = 'error';
            throw new Error('Network error');
        }
        return response.json();
    })
    .then((response) => {
        if (response.result === 'success') {
            status.value = 'success';
            setTimeout(() => {
                // window["dialog-shopcart"]?.close();
                window.location = translatePath(productOptMap[Object.values($cartItems.value)[0].sku].altName, lang);
                cartItems.set({});
                status.value = 'idle';
            }, 2500);
        } else if (response.result === 'error') {
            status.value = 'error';
            throw new Error(response.error);
        }
    })
    .catch((error) => {
        status.value = 'error';
        throw new Error(error);
    });
}
</script>

<style lang="scss" scoped>
.product-list {
    list-style-type: none;
    margin: 0;
    padding: 0;
    margin-bottom: var(--30px);
    width: 100%;
}

.product-list__item {
    border-bottom: var(--1px) solid var(--color-product);
    display: flex;
    gap: var(--15px);
    padding: 0 0 var(--15px);
}

.product-img {
    width: calc(var(--1px) * 110);
}

.product-tag {
    margin-top: -0.3em;
    display: block;
}

.product-title {
    margin: calc(var(--1px) * 5) 0 var(--15px);
    font-size: calc(var(--1px) * 80);

    &.empire {
        color: var(--color-product-empire);
    }

    &.royal {
        color: var(--color-product-royal);
    }
}

.product-price {
    font-size: var(--heading-4);
    font-weight: 600;
    color: var(--text-color);
    margin-top: var(--15px);
    display: block;
    white-space: nowrap;
}

.product-desc {
    font-size: var(--small-font-size);
}

.product-desc__item {
    margin-right: var(--15px);
    display: inline-block;
}

.col:last-child {
    padding-left: var(--15px);
}

.col_desc {
    flex-grow: 1;

}

.col_align-center {
    padding-top: var(--45px);
}

select {
    border: none;
    padding: var(--1px) var(--4px);
    color: var(--color-product);
    font-weight: 600;
    font-size: var(--text-font-size);
    background: rgba(255, 255, 255, .1);
    border-radius: var(--4px);
    /* tmp */
    margin-top: -0.3em;
}

/* tmp */
.size-table {
    border-collapse: collapse;
    margin: var(--15px) 0 var(--4px);
    width: min-content;
    background: rgba(255, 255, 255, .05);
}
.size-table th {
    font-weight: normal;
}
.size-table thead tr {
    color: var(--color-product)
}
.size-table tr {
    border-bottom: var(--1px) solid var(--color-black);
}
.size-table tbody tr:last-child {
    border-bottom: none;
}
.size-table td,
.size-table th {
    padding: var(--1px) var(--15px);
    text-align: right;
}
.size-table td:first-child,
.size-table th:first-child {
    padding-left: var(--30px);
}
.size-table td:last-child,
.size-table th:last-child {
    padding-right: var(--30px);
}

.form {
    margin: 0;
}
.form__footer {
    margin-top: var(--45px);
}
fieldset {
    background-color: var(--color-bg-black);
    border: none;
    border-left: calc(var(--4px) /2) solid var(--color-product);
    padding: var(--30px) var(--30px) var(--60px);
    margin-bottom: var(--15px);
}
fieldset:last-child {
    margin-bottom: 0;
}
legend {
    font-size: var(--text-font-size);
    font-weight: 600;
    float: left;
    display: flex;
    align-items: center;
    margin: 0 0 var(--30px);
    padding: 0;
    width: 100%;
}
legend + * {
    clear: both;
}
legend svg {
    margin-right: var(--15px);
    width: var(--60px);
}
input {
    background: var(--color-bg-disabled);
    padding: var(--15px) calc(var(--1px) * 20);
    border: none;
    color: var(--color-white);
    width: 100%;
    margin-bottom: var(--30px);
    border-radius: var(--4px);
}
input:last-child {
    margin-bottom: 0;
}
input::placeholder {
    color: var(--text-color);
}

.inputCheckbox {
    display: flex;
    align-items: center;
    gap: var(--15px);
    cursor: pointer;
    margin-bottom: var(--30px);
    padding: var(--15px) calc(var(--1px) * 20);
    border-radius: var(--4px);
    background: #25282B;
}
.inputCheckbox:last-child {
    margin-bottom: 0;
}

.inputCheckbox__label {
    line-height: 1.3;
}
.inputCheckbox__input {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
}
.inputCheckbox__radio-box {
    flex-shrink: 0;
    position: relative;
    width: calc(var(--1px) * 24);
    height: calc(var(--1px) * 24);
    background-color: var(--color-bg-black);
    border: var(--1px) solid var(--color-stroke-grey);
    border-radius: var(--30px);
    color: transparent;
}
.inputCheckbox__radio-box::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: calc(var(--1px) * 10);
    height: calc(var(--1px) * 10);
    border-radius: var(--15px);
    background-color: currentColor;
}
/* Checked */
.inputCheckbox__input:checked + .inputCheckbox__radio-box {
    background-color: transparent;
    color: var(--color-product);
    border-color: currentColor;
}
/* Focused */
.inputCheckbox__input:focus-visible + .inputCheckbox__radio-box {
    box-shadow: 0 0 0 var(--1px) var(--color-white);
}
/* Disabled */
.inputCheckbox__input:disabled + .inputCheckbox__radio-box {
    background-color: var(--color-bg-disabled);
}
.inputCheckbox__input:checked:disabled + .inputCheckbox__radio-box {
    background-color: var(--color-bg-disabled);
}

.total {
    text-align: right;
    font-size: var(--text-font-size);
    color: var(--color-gray);
    margin-bottom: var(--45px);
}

.total-price {
    font-size: var(--heading-3);
    font-weight: 600;
    color: var(--text-color)
}
.submit-message {
    text-align: center;
    margin: var(--15px) 0 0;
}

@media screen and (max-width: 1023px) {
    .product-list {
        margin-bottom: var(--15px);
    }
    .product-list__item {
        /* flex-direction: column; */
        flex-wrap: wrap;
    }
    .col_align-center {
        padding-top: 0;
    }
    .col_1 {
        order: 1;
    }
    .col_2 {
        order: 4;
    }
    .col_3 {
        order: 2;
        flex-grow: 1;
    }
    .col_4 {
        order: 3;
    }
    .product-img {
        width: var(--60px);
    }
    .product-title {
        font-size: calc(var(--1px) * 40);
        margin: 0;
    }
    .product-price {
        margin-top: calc(var(--1px) * 10);
        font-size: calc(var(--1px) * 18);
    }
    .product-tag {
        margin-bottom: var(--15px);
        font-size: calc(var(--1px) * 14);
    }
    .button_type-icon {
        padding: calc(var(--1px)* 12);
    }
    .button_type-icon svg {
        width: calc(var(--1px) * 24);
    }
    .size-table td:first-child,
    .size-table th:first-child {
        padding-left: var(--15px);
    }
    .size-table td:last-child,
    .size-table th:last-child {
        padding-right: var(--15px);
    }
    .total {
        margin-bottom: var(--30px);
    }
    .total-price{
        font-size: var(--heading-4);
    }
    fieldset {
        padding: var(--30px) var(--15px) var(--30px);
    }
    legend svg {
        width: var(--30px);
    }
    input {
        margin-bottom: var(--15px);
        padding: calc(var(--1px)* 9) var(--15px) ;
        font-size: calc(var(--1px) * 12);
    }
    .inputCheckbox {
        margin-bottom: var(--15px);
        padding: var(--15px);
        font-size: calc(var(--1px) * 12);
    }
    .form__footer {
        margin-top: var(--30px);
    }
}
</style>