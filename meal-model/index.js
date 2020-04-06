const http = require('http')
const fortune = require('fortune')
const fortuneHTTP = require('fortune-http')
const jsonApiSerializer = require('fortune-json-api')
const mongodbAdapter = require('fortune-mongodb')

const {rawmaterial} = require("./models/rawmaterial")
const {recipe, ingredient} = require("./models/recipe")

const user = {
  name: String,

  // Following and followers are inversely related (many-to-many).
  following: [ Array('user'), 'followers' ],
  followers: [ Array('user'), 'following' ],

  // Many-to-one relationship of user posts to post author.
  posts: [ Array('post'), 'author' ]
}

const post = {
  message: String,

  // One-to-many relationship of post author to user posts.
  author: [ 'user', 'posts' ]
}

const fortuneInstance = fortune(
  {
    user: user,
    post: post,
    rawmaterial: rawmaterial,
    recipe: recipe,
    ingredient: ingredient
  }, 
  {
    adapter: [
      mongodbAdapter,
      {
        // TODO config + secret
        url: 'mongodb://root:rootpassword@localhost:27017/meal?authSource=admin'
      }
    ]
  }
)

const listener = fortuneHTTP(fortuneInstance, {
  serializers: [
    [ jsonApiSerializer ]
  ]
})

// The listener function may be used as a standalone server, or
// may be composed as part of a framework.
const server = http.createServer((request, response) =>
  listener(request, response)
  .catch(error => { 
    /* TODO error logging */
    console.error(error)
  }))

// TODO make it configurable
server.listen(8080)
