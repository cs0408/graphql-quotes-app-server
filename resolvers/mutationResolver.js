const Users = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Quotes = require('../models/Quote')

const mutationResolver = {
  Mutation: {
    // Create New User
    signupUser: async (_, { userNew }) => {
      try {
        // find user
        const user = await Users.findOne({ email: userNew.email })

        // check user exits
        if (user) {
          throw new Error('User already exits!!')
        }

        // if not exits - hashed password
        const hashedPassword = await bcrypt.hash(userNew.password, 12)

        // create new user
        const newUser = new Users({
          ...userNew,
          password: hashedPassword,
        })

        // save new user
        return await newUser.save()
      } catch (error) {
        // if get error
        console.error(error)
      }
    },

    // Login User
    signinUser: async (_, { userSignin }) => {
      try {
        // find user - select password
        const user = await Users.findOne({ email: userSignin.email }).select(
          '+password'
        )

        // check user exits
        if (!user) {
          throw new Error("User doesn't exits!!")
        }

        // if exits - match password
        const matchPassword = await bcrypt.compare(
          userSignin.password,
          user.password
        )

        // check password matched
        if (!matchPassword) {
          throw new Error(`Password doesn't matched!!`)
        }

        // create token
        const JWT_KEY = process.env.JWT_SECRET_KEY
        const token = await jwt.sign({ userId: user._id }, JWT_KEY)

        return { token }
      } catch (error) {
        // if get error
        console.error(error)
      }
    },

    // Create Quote -- 1st argument (for parent) -- 2nd argument (for resolver body data) -- 3rd argument (context for middleware)
    createQuote: async (_, { name }, { userId }) => {
      try {
        // if userId not present from middleware
        if (!userId) {
          throw new Error('User not logged In!!')
        }

        // create quote
        const newQuote = await new Quotes({
          name,
          by: userId,
        })

        await newQuote.save()

        return 'Quote saved Successfully!!'
      } catch (error) {
        console.error(error)
      }
    },
  },
}

module.exports = mutationResolver
