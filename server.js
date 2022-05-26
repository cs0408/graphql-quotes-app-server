require('dotenv').config({ path: '.env' })
require('dotenv').config({ path: '.env.development' })
require('dotenv').config({ path: '.env.production' })
const { ApolloServer, gql } = require('apollo-server')
const {
  ApolloServerPluginLandingPageGraphQLPlayground,
  // used to enable Playground like postman
} = require('apollo-server-core')
const jwt = require('jsonwebtoken')

// require database
const { connectDatabase } = require('./db/db')

// Schema
const typeDefs = require('./schema/schemaGraphQL')
// resolvers
const resolvers = require('./resolvers')

// choose server port nad db uri ============================== on the basis of env file
const db_host =
  (process.env.NODE_ENV === 'production' &&
    `${process.env.DB_URI}GrapghqlQuotesProduction`) ||
  (process.env.NODE_ENV === 'development' &&
    `${process.env.DB_URI}GrapghqlQuotesDevelopment`)

connectDatabase(db_host)

// Context - this is middleware
const context = async ({ req }) => {
  // we pass authorization from headers - from playground
  const { authorization } = req.headers

  if (authorization) {
    const JWT_KEY = process.env.JWT_SECRET_KEY
    const { userId } = await jwt.verify(authorization, JWT_KEY)

    return { userId }
  }
}

const server = new ApolloServer({
  // Schema
  typeDefs,
  // all resolvers
  resolvers,
  // context - for middleware (will go here before going into any resolver's)
  context,
  //   plugin is not mandatory
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
})

const port =
  process.env.NODE_ENV === 'development'
    ? process.env.DEVELOPMENT_SERVER_PORT
    : process.env.PRODUCTION_SERVER_PORT

server.listen({ port }).then((configDetails) => {
  console.log(`Server is run at:- ${configDetails.url}`)
})
