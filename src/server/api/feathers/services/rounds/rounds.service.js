import createModel from './rounds.model'
import Rounds from './rounds.class'
import hooks from './rounds.hooks'

export default app => {
  const options = {
    Model: createModel(app),
    paginate: false,
    id: 'id'
  }

  // Initialize our service with any options it requires
  app.use('/rounds', new Rounds(options, app))

  // Get our initialized service so that we can register hooks
  const service = app.service('rounds')
  app.use('/round', app.service('/rounds'))

  service.hooks(hooks)
}
