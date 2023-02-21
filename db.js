const Sequelize = require("sequelize");

const db = new Sequelize("postgres://localhost/pokemon_db");

const Pokemon = db.define("pokemon", {
  name: {
    type: Sequelize.STRING,
  },
  img: {
    type: Sequelize.STRING,
  },
});

module.exports = {
  db,
  Pokemon,
};
