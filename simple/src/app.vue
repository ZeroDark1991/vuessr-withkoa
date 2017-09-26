<template>
	<div>
		<h1>HELLO ssr WORLD {{ foo }}</h1>
		<h2 @click="handleClick()">click me</h2>
		<h2>{{ foo }}</h2>
		<div style="width: 1rem; height: 1rem; background-color: purple"></div>
	</div>
</template>
<script>
export default {
	data() {
		return {
			foo: 0,
			context: {}
		}
	},
	methods: {
		handleClick() {
			console.log('clicked')
			this.foo += 1
		}
	},
	created() {
		console.log('appCreated:', this.$ssrContext)
	},
	mounted() {
		console.log(123123123)
	}
}
</script>
<style lang="stylus">
h1
	color skyblue
	font-size .18rem
h2
	cursor pointer
</style>