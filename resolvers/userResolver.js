const Quotes = require('../models/Quote')

const userResolver = {
  // resolve User - quotes
  User: {
    // get All Quotes of User by Id
    quotes: async (ur) => {
      try {
        return Quotes.find({ by: ur._id })
      } catch (error) {
        console.error(error)
      }
    },
  },
}

module.exports = userResolver
