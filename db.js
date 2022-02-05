const Sequelize = require('sequelize');

const FilmModel = require('./models/films');
const UserModel = require('./models/users');

// database connection
const sequelize = new Sequelize('moviesdb', 'movies', '12345', {
  host: 'localhost',
  dialect: 'mysql'
});

const Film = FilmModel(sequelize, Sequelize);
const User = UserModel(sequelize, Sequelize);

sequelize.sync({ force: false })
  .then(() => {
    console.log('Modelos listos');
  });

module.exports = {
  Film,
  User
};
