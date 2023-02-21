const express = require("express");
const axios = require("axios");
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

const app = express();

const getFirst10Pokemon = async () => {
  const pokemon = [];

  try {
    for (let id = 1; id < 100; id++) {
      const response = axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);

      pokemon.push(response);
    }

    return (await Promise.all(pokemon)).map((response) => response.data);
  } catch (error) {
    throw error;
  }
};

// this will display the first 10 pokemon
app.get("/", async (req, res) => {
  const pokemon = await Pokemon.findAll();

  res.send(`
    <html>
      <body>
          <ul>
            ${pokemon
              .map(
                (pokemon) => `<li>
                <a href="/pokemon/${pokemon.id}">${pokemon.name}</a>
                <img src="${pokemon.img}" />
                </li>`
              )
              .join("")}
          </ul>
      </body>
    </html>
  `);
});

app.get("/pokemon/:id", async (req, res, next) => {
  const id = req.params.id;
  try {
    // const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);

    // const pokemon = response.data;

    const pokemon = await Pokemon.findByPk(id);

    res.send(`
      <html>
        <body>
          <a href="/">Back</a>
          <h1>${pokemon.name}</h1>
          <img src="${pokemon.img}" />
        </body>
      </html>
    `);
  } catch (error) {
    next(error);
  }
});

// we have the seed function here
// that means whenever we run the app, this function will rerun and recreate our database

// instead of doing all this whenever our app runs, i want to do it on command
app.listen(3000, async () => {
  // seed our own database with the pokemon data

  try {
    await db.sync({ force: true }); // drop all the tables and recreate it

    // lets get all 100 pokemon here and put it into our own database
    const pokemons = await getFirst10Pokemon();
    await Promise.all(
      pokemons.map((pokemon) =>
        Pokemon.create({
          name: pokemon.name,
          img: pokemon.sprites.front_shiny,
        })
      )
    );
  } catch (error) {
    console.log(error);
  }
});

/**
 *
 * what does RESTful mean?!
 *
 * it means "when you have a url and a request method, you should know exactly what that route does"
 *
 * // this is gonna get all the pokemon
 * app.get('/pokemon'
 *
 *
 * // this is gonna get the pokemon with that id
 * app.get('/pokemon/:id'
 *
 * // yeah
 * app.delete('/pokemon/:id'
 *
 */
