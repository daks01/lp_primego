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
                        :style="{color: cartItem.color}"
                    >
                        {{cartItem.name}}
                    </div>
                    <div>
                        Размер: 42&thinsp;RU &emsp;
                        Модель: {{cartItem.sku}} &emsp;
                        <br>
                        Меховой язык: {{cartItem.fur_tongue}} &emsp;
                        Шнурок: {{cartItem.lace}} &emsp;
                    </div>
                    </div>
                <div class="col col_align-center">
                    <span class="product-price">{{separateThousands(cartItem.price)}}&thinsp;₽</span>
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

        <div style="background-color: rgba(0,0,0,.2); height: 150px"></div>
        <br>

        <div style="background-color: rgba(0,0,0,.2); height: 150px"></div>
        <br>

        <button class="button button_size-large button_fullwidth">
            Оплатить {{separateThousands($totalPrice)}}&thinsp;₽
        </button>
    </div>
</template>

<script setup>
    import { onMounted, computed } from 'vue';
    import { useStore } from '@nanostores/vue';
    import { cartItems, totalPrice } from '/src/stores/shopCartStore';
  
    const $cartItems = useStore(cartItems);
    const $totalPrice = useStore(totalPrice);

    function removeItem(id) {
        cartItems.setKey(id, undefined);
    }

    function separateThousands(number) {
        return number.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ' ');
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
</style>