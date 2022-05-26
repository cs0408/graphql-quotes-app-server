const Users = require('../models/User')
const Quotes = require('../models/Quote')

const queryResolver = {
  Query: {
    // Get all users
    users: async () => {
      try {
        return await Users.find({})
      } catch (error) {
        console.error(error)
      }
    },

    // Get user by Id
    user: async (_, { _id }) => {
      try {
        return await Users.findOne({ _id })
      } catch (error) {
        console.error(error)
      }
    },

    // Get All Quotes
    quotes: async () => {
      try {
        return await Quotes.find({}).populate('by', '_id firstName email')
      } catch (error) {
        console.error(error)
      }
    },

    // Get User All Quotes
    userQuotes: async (_, { by }) => {
      try {
        return await Quotes.find({ by })
      } catch (error) {
        console.error(error)
      }
    },

    // my profile
    myprofile: async (_, args, { userId }) => {
      if (!userId) throw new Error('You must be logged in')
      return await Users.findOne({ _id: userId })
    },
  },
}

module.exports = queryResolver
