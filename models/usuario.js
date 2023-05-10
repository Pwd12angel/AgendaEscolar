//Definimos el esquema de los datos de nuestros usuarios (como se veran nuestros datos en la base de datos)
//Validaciones y esquemas 

//modulo para encriptar las contrasenas 
const bcrypt = require('bcrypt-nodejs');

//Utilizaremos el esquema de mongoose 
const mongoose = require('mongoose');
const {Schema} = mongoose;
//Resibimos los parametros o estructura que tendra nuestra coleccion
const usuarioSchema = new Schema({
    nombre: String,
    apellido: String,
    contrasena: String,
    genero:String,
    email: String,
    telefono: Number,
    pregunta: String,
    respuesta: String,
    carrera: String,
    numerodecontrol:Number
});

//Metodo para encriptar la contrasena
usuarioSchema.methods.encriptar = (contrasena)=>{
    //Resicve la contrasena y le decimos cada cuanto ejectura el algoritmo para cifrar 
    return bcrypt.hashSync(contrasena,bcrypt.genSaltSync(10));
};

//Metodo para comprobar el  pasword al momneto de que el usuario quiera iniciar secion 
usuarioSchema.methods.compararPass = function (pasword){
    //comparamos los paswords me retornara un false o tu true si es igual o no a la contrasena que tenmos en la base de datos 
    return bcrypt.compareSync(pasword,this.contrasena);
};



//cremos el modelo , tomamos el esquema y los guardara en la base de datos 
const Usuario = mongoose.model('usuario',usuarioSchema);


//exportamos la funcionalidad para despues utilizarala en otras partes del proyecto 
module.exports = Usuario;