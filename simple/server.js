const fs = require('fs')
const Koa = require('koa')
const path = require('path')
const LRU = require('lru-cache')
const compress = require('koa-compress')
const staticServe = require('koa-static')
const resolve = file => path.resolve(__dirname, file)
const { createBundleRenderer } = require('vue-server-renderer')
// const clientManifest = require(path.resolve(__dirname, 'dist/vue-ssr-client-manifest.json'))

const isProd = process.env.NODE_ENV === 'production'
const useMicroCache = process.env.MICRO_CACHE !== 'false'

const serverInfo =
  `koa/${require('koa/package.json').version} ` +
  `vue-server-renderer/${require('vue-server-renderer/package.json').version}`

const app = new Koa()
const template = fs.readFileSync(resolve('./src/index.template.html'), 'utf-8')

const cerateRenderer = (bundle, options) => {
	return createBundleRenderer(bundle, Object.assign(options, {
		template,
		runInNewContext: false,
		asedir: resolve('./dist'),
    cache: LRU({
      max: 1000,
      maxAge: 1000 * 60 * 15
    }),		
	}))
}

let renderer
let readyPromise
if(isProd) {
	const bundle = require(resolve('./dist/vue-ssr-server-bundle.json'))
	const clientManifest = require(resolve('./dist/vue-ssr-client-manifest.json'))
	renderer = cerateRenderer(bundle, { clientManifest })
} else {
	readyPromise = require(resolve('./build/setup-dev-server'))(app, (bundle, options) => {
		renderer = cerateRenderer(bundle, options)
	})
}

app.use( compress({threshold: 0}) )
app.use( staticServe(resolve('./dist'), { gzip: true }) )
app.use(async (ctx, next) => {
	ctx.vueRender = function(context) {
		if(isProd) {
			return render(ctx, context)
		} else {
			return readyPromise.then(() => render(ctx, context) )
		}
	}

	await next()
})

app.use(async (ctx, next) => {
	if(ctx.url == '/') {
		console.log('heheheheh')
		try {
			let { html, err } = await ctx.vueRender({ title: '233', foo: 'from main process', url: ctx.url })
			if(html) ctx.body = html
			if(err) {
				console.log(err)
			}
		} catch(e) {
			console.log(e)
		}
	}
	await next()
})


function render (ctx, context) {
  const s = Date.now()

  ctx.set("Content-Type", "text/html")
  ctx.set("Server", serverInfo)

  // const handleError = err => {
  //   if (err.url) {
  //     ctx.redirect(err.url)
  //   } else if(err.code === 404) {
  //     ctx.status(404).send('404 | Page Not Found')
  //   } else {
  //     // Render Error Page or Redirect
  //     ctx.status(500).send('500 | Internal Server Error')
  //     console.error(`error during render : ${ctx.url}`)
  //     console.error(err.stack)
  //   }
  // }

  return new Promise((resolve, reject) => {
	  renderer.renderToString(context, (err, html) => {
	    if (!isProd) {
	      console.log(`whole request: ${Date.now() - s}ms`)
	    }

			if(err) {
				reject({ err })
			}
			else {
				resolve({ html })
			}
	  })
  })
}

app
	.listen(3001, () => {
		console.log('ok')
	})
