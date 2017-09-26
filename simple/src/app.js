import Vue from 'vue'
import App from './app.vue'

const createApp = function(context) {
	const app = new Vue({
		render: h => h(App)
	})
	return { app }
}

export default createApp
