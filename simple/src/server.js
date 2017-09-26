import createApplication from './app'

export default function(context) {
	const { app } = createApplication(context)
	return app
}
