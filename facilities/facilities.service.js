// Initializes the `facilities` service on path `/facilities`
import createModel from './facilities.model'
import Facility from './facilities.class'
import hooks from './facilities.hooks'

export default app => {
  const options = {
    Model: createModel(app),
    paginate: false,
    id: 'id',
    whitelist: ['$geometry']
  }

  // Initialize our service with any options it requires
  app.use('/facilities', new Facility(options, app))

  // Get our initialized service so that we can register hooks
  const service = app.service('facilities')
  app.use('/facility', app.service('/facilities'))

  service.hooks(hooks)
}
