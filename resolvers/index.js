const mutationResolver = require('./mutationResolver')
const queryResolver = require('./queryResolver')
const userResolver = require('./userResolver')

const resolvers = {
  // all resolvers destructure here using ...
  ...queryResolver,
  ...userResolver,
  ...mutationResolver,
}

module.exports = resolvers
