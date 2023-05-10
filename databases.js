//Pedimos las propiedades de los modulos 
const mongoose = require('mongoose');
//importamos de la clase keys
const {mongodb} = require('./keys');

//Conectamos la base de datos 
mongoose.connect(mongodb.URI,{})
    //Muestra un mensaje si ocurrer un error 
    .then(db => console.log('Databases is conected'))
    //Si ocurre un error 
    .catch(err => console.log(err))