//Requerimos el modulo 
const passport = require('passport');
//Requerimos el siguiente modulo (estrategias para autenticar)
const Localstategy = require('passport-local').Strategy;
//Requerimos el esquema que esta en la carpeta models
const User = require('../models/usuario');
const bodyParser = require('body-parser');

let areglo = [];
//Su contraseña y correro lo guaradaremos en un documento del navegador con passport 
//cerializando y deserializando 
passport.serializeUser((User,done) => {
    done(null,User.id);
});

//Procesos de deserializado proceso inverso 
passport.deserializeUser(async (id,done) => {
    //Buscamos en la base de datos el id 
    const user = await User.findById(id);
    //Terminamos el colbak sin nigun error 
    done(null,user);
});


//funcion para saber que vamos hacer con los datos del cliente
//resivimos objeto que vamos a resivir desde el cliente , funcion para saber que vamos hacer con esos datos  
passport.use('local-signup', new Localstategy({
    //lo que vamos a resivir del cliente 
    usernameField : 'email',
    passwordField : 'contrasena',
    //Pasamos los datos que faltan 
    passReqToCallback: true
    
} ,async (req,correo,pass,done) =>{
    const newuser = new User();
    areglo[0] = req.body.nombre;
    areglo[1] = req.body.apellido;
    areglo[2] = req.body.genero;
    areglo[3] = req.body.telefono;
    areglo[4] = req.body.respuesta;
    areglo[5] = req.body.pregunta;
    areglo[6] = req.body.carrera;
    areglo[7] = req.body.numerodecontrol;

   // for(let i = 0; i <= areglo.length ; i++){
      //  console.log("Respuestas en el arreglo "+areglo[i]);
   // }

    //Buscamos un correro igual al que ta tenemos
     const emailUser = await User.findOne({email: req.body.email});
     //Condicional para saber si ya existe un usuario
         if(emailUser !== null) {
                return done(null,false,req.flash('singnupMessage','El email ya existe. '));
        }else{      

        //Definimos el usuario 
        const newuser = new User();
        newuser.email = correo;
        newuser.nombre = areglo[0];
        newuser.apellido = areglo[1];
        newuser.genero = areglo[2];
        newuser.telefono = areglo[3];
        newuser.respuesta = areglo[4];
        newuser.pregunta = areglo[5];
        newuser.carrera = areglo[6];
        newuser.numerodecontrol = areglo[7];
    
        
        newuser.contrasena = newuser.encriptar(pass);
        
        //Guardamos el usuario 
        await newuser.save((err,document)=>{
            if(err)
            console.log("Este es el error"+err);
            //console.log("Este es el documento"+document);
        });
        
        //devolvemos la respuesta a traves de done
        done(null,newuser);
     }
}));


//autenticasion al momento de iniciar secion 
passport.use('local-login',new Localstategy({
     //lo que vamos a resivir del cliente 
     usernameField : 'email',
     passwordField : 'contrasena',
     //Pasamos los datos que faltan 
     passReqToCallback: true

}, async (req,email,pasword,done) => {

    const emailUser = await User.findOne({email: req.body.email});
    console.log(emailUser);
    //Condicional para saber si ya existe un usuario
        if(!emailUser) {
               return done(null,false,req.flash('singnupMessage','El email es incorrecto. '));
       }

      //si no coincide la contrasena 
      if(!emailUser.compararPass(pasword)){
         return done(null,false,req.flash('singnupMessage','La contraseña no es correcta o no coincide'));
      }

     done(null,emailUser);
}));