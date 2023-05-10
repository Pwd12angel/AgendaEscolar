//constante de nuestro servidor 
//framework para iniciar el servidor 
const express = require("express");
const bodyParser = require('body-parser');
//Devuelve el objeto 
const app = express();
const port = 8080;
const morgan = require("morgan");
const passport = require('passport');
const session = require('express-session');
const req = require("express/lib/request");
const flash = require('connect-flash');

//iniciamos la conexion a base de datos 
require('./databases');
require('./passport/local-aut');


//Middelwares
//configuracion de session 
app.use(session({ //Espacio en memoria que podemos compartir en multiples paguinas 
    //Nos aseguramos que el archivo no sea vulnerable 
    secret:'myscretsession',//Cada seccion sea guardada de manera unica
    resave: false, //Evitamos que se vuelva a guardar 
    saveUninitialized: false//Evitar que sea enicializado 
}));


//resivimos los datos desde el cliente 
app.use(bodyParser.urlencoded({extended: false})); //Entiende los datos de un formulario 
app.use(morgan('dev'));
app.use(flash()); //comunicasion entre paguinas 
app.use(passport.initialize());
//Obtenemos el archivo del navegador 
app.use(passport.session());
//para devolver el mensaje para toda nuestra aplicasion de que ya existe un usuario 
app.use((req, res ,next) =>{
    app.locals.singnupMessage = req.flash('singnupMessage');
    app.locals.loginMessage = req.flash('loginMessage');
    app.locals.user = req.user;
    //continua con el resto
    next();
});

//Motor de plantillas 
app.set('view engine','ejs'); //Motor de las vistas que vamos a utilizar 
app.set('views',__dirname + '/view');//Nos dice donde estan nuestras vistas 

//middleware estatico 
app.use(express.static(__dirname + "/public"));

// Utiliza esta rutas (rutas Web) 
app.use('/',require('./router/rutasWeb')); //Decimos donde tenemos nuestras rutas 
app.use('/usuarios',require('./router/usuarios'));

app.use((req,res,next) =>{
  res.status(404).sendFile(__dirname + "/public/404.html");
});
app.listen(port,()=>{
    console.log(`El servidor esta listo localhost ${port}`);
});