const Vue = require('vue')
const server = require('express')()
const portfinder = require('portfinder')
const renderer = require('vue-server-renderer').createRenderer()

portfinder.getPortPromise()
	.then(port => {
		let context = {
			foo: 'hello data'
		}

		server.get('*', (req, res) => {
			console.log(req.url)
			let app = new Vue({
				data: {
					url: req.url,
					foo: context.foo
				},
				template: `<div>当前访问：{{ url }}</div>`
			})

			renderer.renderToString(app, context, (err, html) => {
				if(err) {
					res.status(500).end('500 Internal Server Error')
					return
				} else {
					console.log(html)
					res.end(html)
				}
			})
		})
		server.listen(port, () => {
			console.log(`server listen at http://localhost:${port}`)
		})
	})
	.catch(err => {
		throw err
	})