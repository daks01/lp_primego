<template>
    <div>
        <template v-if="Object.values($cartItems).length">
            <ul class="product-list">
                <li 
                    v-for="cartItem in Object.values($cartItems)" 
                    :key="cartItem.id"
                    class="product-list__item"
                >
                    <div class="col">
                        <img :src="cartItem.img" :alt="cartItem.name" class="product-img" width="110" />
                    </div>
                    <div class="col col_desc">
                        <span>{{cartItem.type}}</span>
                        <div 
                            class="font_star-trek product-title" 
                            :style="{color: cartItem.siteColor}"
                        >
                            {{cartItem.name}}
                        </div>

                        <div>
                            <br>
                            Модель: {{cartItem.sku}} 
                            &emsp;
                            <br>

                            Размер: 
                            <select aria-label="Выбрать размер"
                                @change="updatePrice($event, cartItem.id)"
                            >
                                <option value="---">
                                    ---
                                </option>
                                <option v-for="size in cartItem.size" 
                                    :key="size.size"
                                    :value="size.size" 
                                    :disabled="isOutOfStock(size.available)"
                                >
                                    {{ size.size }}&thinsp;RU
                                </option>
                            </select> 

                            <template v-if="'selected-size' in cartItem">
                                &emsp;
                                Цвет:
                                <select aria-label="Выбрать цвет"
                                    @change="updateColor($event, cartItem.id)"
                                >
                                    <option value="---">
                                        ---
                                    </option>
                                    <option v-for="(value, key) in cartItem.size?.[cartItem['selected-size']]?.available" 
                                        :key="cartItem['selected-size']+key"
                                        :value="key"
                                    >
                                        {{ colorMap[key] || key }}
                                    </option>
                                </select>
                            </template>

                            <br>
                            <br>
                        </div>
                        <details>
                            <summary>
                                Таблица рамеров
                            </summary>
                            <div>
                                <br>
                                <div>Универсальная размерная сетка</div>
                                <br>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Длина стопы</th>
                                            <th>Ширина стопы</th>
                                            <th>Российский размер</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <template v-for="size in cartItem.size" :key="size">
                                            <tr>
                                                <td>{{ size.length / 10 }}см </td>
                                                <td>{{ size.width / 10 }}см</td>
                                                <td>{{ size.size }}</td>
                                            </tr>
                                        </template>
                                    </tbody>
                                </table>
                            </div>
                        </details>
                    </div>
                    <div class="col col_align-center">
                        <span class="product-price">{{priceWithRouble(cartItem.price)}}</span>
                    </div>
                    <div class="col col_align-center">
                        <button type="button" class="button button_type-icon" aria-label="Удалить" @click="removeItem(cartItem.id)">
                            <svg role="presentation" width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 22.5C17.5228 22.5 22 18.0228 22 12.5C22 6.97715 17.5228 2.5 12 2.5C6.47715 2.5 2 6.97715 2 12.5C2 18.0228 6.47715 22.5 12 22.5Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M15 9.5L9 15.5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M9 9.5L15 15.5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>
                    </div>
                </li>
            </ul>
            <div class="total">
                Всего<br>
                <span class="total-price">{{priceWithRouble($totalPrice)}}</span>
            </div>
        </template>
        <p v-else>Корзина пуста</p>

        <form action="">
            <fieldset>
                <legend>
                    1. Получатель
                </legend>
                <input type="phone" aria-label="Номер телефона" placeholder="Номер телефона" v-model="formData.phone" class="input" required>
                <input type="text" aria-label="Имя" placeholder="Имя" v-model="formData.name" class="input" required>
                <input type="text" aria-label="Фамилия" placeholder="Фамилия" v-model="formData.surname" class="input">
                <input type="email" aria-label="E-mail" placeholder="E-mail" v-model="formData.email" class="input">
                <input type="text" aria-label="Почтовый адрес" placeholder="Почтовый адрес" v-model="formData.address" class="input">
            </fieldset>
            <fieldset>
                <legend>
                    2. Тип доставки
                </legend>
                <label>
                    <input 
                        type="radio" 
                        id="radio-1"
                        v-model="formData.delivery"
                        checked
                        value="Доставка по Москве до двери (бесплатно при заказе от 40 000)"
                    />
                    <span>&emsp;Доставка по Москве до двери (бесплатно при заказе от 40 000)</span>
                </label>
                <label>
                    <input 
                        type="radio" 
                        id="radio-2"
                        v-model="formData.delivery"
                        value="Доставка по России до пункта выдачи от 0 до 100 000 руб. в зависимости от зоны доставки (оплата доставки при получении)" 
                    />
                    <span>&emsp;Доставка по России до пункта выдачи от 0 до 100 000 руб. в зависимости от зоны доставки (оплата доставки при получении)</span>
                </label>
                <label>
                    <input 
                        type="radio" 
                        id="radio-3"
                        v-model="formData.delivery"
                        value="Доставка по России до двери в зависимости от зоны доставки" 
                    />
                    <span>&emsp;Доставка по России до двери в зависимости от зоны доставки</span>
                </label>
            </fieldset>
        </form>

        <button 
            @click="buy" 
            class="button button_size-large button_fullwidth" 
            :disabled="status === 'sending' || Object.values($cartItems).length === 0"
        >
            <!-- Оплатить -->{{priceWithRouble($totalPrice)}}
        </button>
    </div>
</template>

<script setup>
    import { ref, toRaw } from 'vue';
    import { useStore } from '@nanostores/vue';
    import { cartItems, totalPrice } from './../../stores/shopCartStore';
    import { apiUrl } from './../../utils/routes';
    import { priceWithRouble } from './../../utils/format';
    import { colorMap } from './../../utils/product-list';

    const $cartItems = useStore(cartItems);
    const $totalPrice = useStore(totalPrice);
    let status = ref('idle');

    const formData = ref({
      name: '',
      surname: '',
      email: '',
      phone: '',
      address: '',
      delivery: '',
      totalPrice: `${toRaw($totalPrice.value)}₽`,
    });

    function removeItem(id) {
        cartItems.setKey(id, undefined);
    }

    function isOutOfStock(available = {}) {
        return Object.keys(available).length === 0;
    }

    function updateColor(e, id) {
        cartItems.setKey(id, {
            ...toRaw($cartItems.value)[id],
            ['selected-color']: e.target.value
        });
    }

    function updatePrice(e, id) {
        cartItems.setKey(id, {
            ...toRaw($cartItems.value)[id],
            ['selected-size']: e.target.value === '---' ? undefined : e.target.value,
            ['selected-color']: undefined,
        });
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
                    price: item.price,
                    size: item['selected-size'],
                    color: item['selected-color'],
                }
            };
        }

        const fetchBody = {
            name,
            email,
            surname,
            phone,
            address,
            delivery,
            items,
            totalPrice: `${toRaw($totalPrice.value)}₽`,
        }

        console.log(fetchBody)

        fetch(apiUrl.buy, { 
            redirect: "follow",
            method: "POST",
            headers: {
                "Content-Type": "text/plain;charset=utf-8",
            },
            body: JSON.stringify(fetchBody)
        })
        .then(response => {
            if (!response.ok) {
                status.value = 'error';
                alert("❗ При отправке заказа возникли проблемы. Попробуйте позже");
                throw new Error('Network error');
            }
            return response.json();
        })
        .then((response) => {
            if (response.result === 'success') {
                status.value = 'success';
                alert("✅ Заказ отправлен. Ожидайте звонка");
                cartItems.set({});
                window["dialog-shopcart"]?.close();
                status.value = 'idle';
            } else if (response.result === 'error') {
                status.value = 'error';
                alert("❗ При отправке заказа возникли проблемы. Попробуйте позже");
                throw new Error(response.error);
            }
        })
        .catch((error) => {
            status.value = 'error';
            alert("❗ При отправке заказа возникли проблемы. Попробуйте позже");
            console.error(error);
        });
    }
</script>

<style scoped>
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
        padding: var(--15px) 0;
    }
    .product-img {
        width: calc(var(--1px) * 110);
    }
    .product-title {
        margin: var(--15px) 0;
        font-size: calc(var(--1px) * 80);
    }
    .product-price {
        font-size: var(--heading-4);
        font-weight: 600;
        color: var(--text-color);
        margin-top: var(--15px);
        display: block;
    }
    .col {
        
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
        background: rgba(255,255,255,.1);
        border-radius: var(--4px);
        margin-top: var(--4px);
    }

    form {
        margin-bottom: var(--45px);
    }
    fieldset {
        background-color: #050611;
        border: none;
        border-left: calc(var(--4px) /2) solid var(--color-product);
        padding: var(--30px) var(--30px) var(--60px);
        margin-bottom: var(--15px);
    }
    legend {
        font-size: var(--text-font-size);
        font-weight: 600;
        display: table;
        float: left;
        margin: 0 0 var(--30px);
        padding: 0;
        width: 100%;
    }
    legend+ * {
        clear: both;
    }
    input {
        background: var(--color-bg-disabled);
        padding: var(--15px) calc(var(--1px) * 20);
        border: none;
        color: var(--color-white);
        width: 100%;
        margin-bottom: var(--30px);
    }
    input::placeholder {
        color: var(--text-color);
    }
    input[type=radio] {
        width: auto;
        margin: 0;
        padding: 0;
        vertical-align: middle;
    }
    label {
        display: block;
        margin-bottom: var(--30px);
        padding: var(--15px) calc(var(--1px) * 20);
        background: #25282B;
        line-height: 1.4;
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

    @media screen and (max-width: 1023px) {
        .product-list__item {
            flex-direction: column;
        }
        .col_align-center {
            padding-top: 0;
        }
    }
</style>