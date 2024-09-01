
<script>
export default {
	data: function () {
		return {}
	},
	methods: {
		clickHandler() {
			alert(1)
		},
    },
	mounted() {},
}
</script>

<template>
    <form>
        <div style="background-color: rgba(0,0,0,.2); height: 300px"></div>
        <br>
        <button class="button button_size-large button_fullwidth">Войти</button>
    </form>
</template>

<style scoped>
    form {
        background-color: rgba(0,0,0,.3);
    }
</style>