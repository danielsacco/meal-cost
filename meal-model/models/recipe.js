const {rawmaterial} = require("./rawmaterial")

const ingredient = {
  material: 'rawmaterial',
  quantity: Number,
  unit: String
}

const recipe = {
  name: String,
  servings: String,
  ingredients: Array('ingredient'),
  preparation: String
};

module.exports = {
  recipe,
  ingredient
};