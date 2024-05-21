<template>
    <div>
        <ul v-if="Object.values($cartItems).length" class="product-list">
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
                        <select id="" aria-label="Выбрать размер">
                            <option v-for="size in cartItem.size" 
                                :key="size.size"
                                :value="size.size" 
                                :disabled="isOutOfStock(size.available, size.reserved)"
                            >
                                {{ size.size }}&thinsp;RU
                            </option>
                        </select> 
                        &emsp;
                        Цвет: 
                        <select id="" aria-label="Выбрать цвет">
                            <option v-for="color of cartItem.color" 
                                :key="color"
                                :value="color"
                            >
                                {{ colorMap[color] || color }}
                            </option>
                        </select>
                        <br>

                        Шнурок: 
                        <select aria-label="Выбрать шнурок">
                            <option v-for="lace of cartItem.lace" 
                                :key="lace"
                                :value="lace"
                            >
                                {{ lace }}
                            </option>
                        </select>
                        <br>

                        <!-- Утепление -->
                        <span v-for="insulation in cartItem.insulation" :key="insulation">
                            {{ insulation ? `${insulation}: да` : '' }} &emsp;
                        </span>
                        
                    </div>
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
        <p v-else>Корзина пуста</p>

        <h3>Таблица рамеров</h3>
        <p>Универсальная размерная сетка</p>
        <table>
            <template v-for="">
                <tr>
                    <td>Длина стопы, см</td>
                </tr>
                <tr>
                    <td>Длина стельки, см</td>
                </tr>
                <tr>
                    <td>Российский размер</td>
                </tr>
            </template>
        </table>
        
        

        <form action="">
            <fieldset>
                <legend>
                    1. Получатель
                </legend>
                <input type="text" aria-label="Номер телефона" placeholder="Номер телефона" v-model="formData.name" class="input">
                <input type="text" aria-label="Имя" placeholder="Имя" v-model="formData.email" class="input">
                <input type="text" aria-label="Фамилия" placeholder="Фамилия" v-model="formData.email" class="input">
                <input type="text" aria-label="E-mail" placeholder="E-mail" v-model="formData.email" class="input">
                <input type="text" aria-label="Почтовый адрес" placeholder="Почтовый адрес" v-model="formData.email" class="input">
            </fieldset>
            <fieldset>
                <legend>
                    2. Тип доставки
                </legend>
                <input 
                    type="radio" 
                    name="1"
                    value="Доставка по Москве до двери (бесплатно при заказе от 40 000)"
                >
                <input 
                    type="radio" 
                    name="2"
                    value="Доставка по России до пункта выдачи от 0 до 100 000 руб. в зависимости от зоны доставки (оплата доставки при получении)" 
                >
                <input 
                    type="radio" 
                    name="3"
                    value="Доставка по России до двери в зависимости от зоны доставки" 
                >
            </fieldset>
        </form>

        <button @click="buy" class="button button_size-large button_fullwidth">
            <!-- Оплатить --> {{priceWithRouble($totalPrice)}} 
        </button>
    </div>
</template>

<script setup>
    import { toRaw, ref } from 'vue';
    import { useStore } from '@nanostores/vue';
    import { cartItems, totalPrice } from './../../stores/shopCartStore';
    import { apiUrl } from './../../utils/routes';
    import { priceWithRouble } from './../../utils/format';
    import { colorMap } from './../../utils/product-list';

    const $cartItems = useStore(cartItems);
    const $totalPrice = useStore(totalPrice);

    const formData = {
      items: toRaw($cartItems.value),
      name: '',
      email: '',
      phone: '',
      address: '',
      deliveryType: '',
      totalPrice: `${toRaw($totalPrice.value)}₽`,
    };

    function removeItem(id) {
        cartItems.setKey(id, undefined);
    }

    function isOutOfStock(availabile =0, reserved = 0) {
        // ToDo вычитать добавленный в корзину размер
        return reserved >= availabile;
    }

    function buy() {
        // const fetchBody = {
        //     name: 'Кабан Кабаныч',
        //     email: 'kaban@kabami.ch',
        //     phone: '+70000000000',
        //     address: 'Страна, Горо, Улица, дом 10, кв.1',
        //     items: toRaw($cartItems.value),
        //     totalPrice: `${toRaw($totalPrice.value)}₽`,
        // }
        const fetchBody = formData.value;

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
                // actionMessage.innerHTML = `
                //     ❗ При отправке возникли проблемы.<br> Попробуйте позже
                // `;
                throw new Error('Network error');
            }
            return response.json();
        })
        .then((response) => {
            if (response.result === 'success') {
                // actionMessage.innerHTML = `
                //     ✅ Отправлено.
                // `;
                // formEl.reset();
            } else if (response.result === 'error') {
                // actionMessage.innerHTML = `
                //     ❗ При отправке возникли проблемы.<br> Попробуйте позже
                // `;
                throw new Error(response.error);
            }
        })
        .catch((error) => {
            // actionMessage.innerHTML = `
            //     ❗ При отправке возникли проблемы.<br> Попробуйте позже
            // `;
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
        font-size: var(--heading-3);
        font-weight: 600;
        color: var(--text-color)
    }
    .col {

    }
    .col_desc {
        flex-grow: 1;
        
    }
    .col_align-center {
        align-self: center;
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

    fieldset {
        background-color: #050611;
        border: none;
        border-left: calc(var(--2px) *2) solid var(--color-product);
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
</style>