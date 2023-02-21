const express = require("express");
const axios = require("axios");
const { Pokemon } = require("./db");

const app = express();

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
app.listen(3000);

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
