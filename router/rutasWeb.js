
const express = require('express');
//Objeto rauter Definimos las rutas de nuestro navegador 
const router = express.Router();
const pass = require('passport');
const formodelo= require("../models/form");
const contactos = require("../models/contactos");
const clase = require("../models/clase");
const user = require("../models/usuario");

//render de nuestra pagina 
router.get("/",(req,res) =>{
    //renderizamos el archivo index
    res.render("index",{titulo: "Titulo del inicio"});
});

//ruta para registrarse 
router.get("/signin",(req,res) =>{
    res.render("signin",{titulo: "Titulo del singin"});
});

//Ruta para escuchar los datos 
router.post("/signin",pass.authenticate ('local-signup',{
    successRedirect: '/profile',
    failureRedirect: '/signin',
    passReqToCallback: true
}));

//Ruta para entrar 
router.get("/login",(req,res) =>{
    res.render("login",{titulo: "Titulo del login"});
});
//Ruta para escuchar los datos 
router.post("/login",pass.authenticate('local-login',{
    //En caso de que este bien lo datos de utenticasion lo madara a su perfil
    successRedirect: '/profile',
    //Si esta mal lo mandara a login para que ponga sus datos de nuevo 
    failureRedirect: '/login',
    passReqToCallback: true
}));

router.get('/logout',(req, res, next) =>{
    req.logOut(); //Funcion para salir 
    res.redirect("/");//No redirije al inicio 
})

//ruta de perfil 
router.get('/profile',autenticar,async(req,res,next) =>{
    //consulta a mongodb 
    const tareas = await formodelo.find({"creador":req.user._id});
    const contact = await contactos.find({"creador":req.user._id});
    const classe = await clase.find({"creador":req.user._id});
    console.log(contact);
    console.log(classe);

    //le pasamos el arreglo
    res.render('profile',{tareas:tareas,contactos:contact,clase:classe});
});
router.post('/profile',autenticar,function(req,res){
    //console.log(req.user._id);
        const infcontacto = {
            nombre : req.body.nombre,
            apellido : req.body.apellido,
            numero:req.body.numero,
            creador :req.user._id
        }
        var datoscon = new contactos(infcontacto);
        datoscon.save();
       
       //console.log(datoscon); 
    
        res.redirect("/profile");
    });

//Ruta para resivir los datos de organizar 
router.get('/organizar',autenticar,(req,res,next) =>{
    res.render('organizar');
});

//Ruta para organizar da uno de los perfiles 
router.post('/organizar',autenticar,function (req,res){
//console.log(req.user._id);
    const data = {
        tarea : req.body.tarea,
        descripcion : req.body.descripcion,
        fecha: req.body.fecha,
        url:req.body.url,
        creador :req.user._id
    }
    var datos = new formodelo(data);
    if(data){
        datos.save();
    }
    //const datosform = formodelo(req.body);
   // const datosguardados = await datosform.save();
    //console.log(datos);

    res.redirect("/profile");
});

//Ruta para organizar da uno de los perfiles 
router.post('/clase',autenticar,function (req,res){
    //console.log(req.user._id);
       
       const dataclase = {
        nombreclase : req.body.nombreclase,
        profesor : req.body.profesor,
        hora: req.body.hora,
        dia:req.body.dia,
        edificio:req.body.edificio,
        aula:req.body.aula,
        creador :req.user._id
    }
    console.log(dataclase);
        //const datosform = formodelo(req.body);
       // const datosguardados = await datosform.save();
        //console.log(datos);
        var datosclase= new clase(dataclase);
        datosclase.save();
        res.redirect("/profile");
    });

    //Editar clase 
router.get("/editarclase/:id",autenticar,async(req,res,next) => {
        try {
            //params id nos da el numero de la tarea
        console.log(req.params.id);
        //lean para que el fotn lo vea como un objero 
        //consulta a la base de datos
         const clasecon =  await clase.find({_id:Object(req.params.id)}).lean();
         console.log(clasecon);
        res.render("editarclase",{clase:clasecon});
        } catch (error) {
            console.log(error.message);
        }
    });

    //ruta para actualizar los datos de la clase
router.post('/editarclase/:id',autenticar,async (req,res,next) =>{
    // console.log(req.body);
     //console.log(req.params.id);
 
     //extraemos 
     const {id} = req.params;
     //actualizamos desde mongoose 
     await clase.findByIdAndUpdate(id, req.body);
     res.redirect("/profile");
 });

//ruta para eliminar una clase 
 router.get('/eliminarclase/:id',autenticar, async (req,res)=>{
    const {id} = req.params;
    //Accion para eliminar en la base de datos
    await clase.findByIdAndDelete(id);
    res.redirect("/profile");
});

router.get('/editar/:id',autenticar,async (req,res,next) =>{
    try {
        //params id nos da el numero de la tarea
    console.log(req.params.id);
    //lean para que el fotn lo vea como un objero 
    //consulta a la base de datos
     const tarea =  await formodelo.find({_id:Object(req.params.id)}).lean();
     console.log(tarea);
    res.render("editar",{tarea:tarea});
    } catch (error) {
        console.log(error.message);
    }
});
router.post('/editar/:id',autenticar,async (req,res,next) =>{
    //console.log(req.body);
    //console.log(req.params.id);

    //extraemos 
    const {id} = req.params;
    //actualizamos desde mongoose 
    await formodelo.findByIdAndUpdate(id, req.body);
    res.redirect("/profile");
});
//ruta para eliminar un registro 
router.get('/eliminar/:id',autenticar, async (req,res)=>{
    const {id} = req.params;
    //Accion para eliminar en la base de datos
    await formodelo.findByIdAndDelete(id);
    res.redirect("/profile");
});

router.get("/editarcontacto/:id",autenticar,async(req,res,next) => {
    try {
        //params id nos da el numero de la tarea
    console.log(req.params.id);
    //lean para que el fotn lo vea como un objero 
    //consulta a la base de datos
     const contacto =  await contactos.find({_id:Object(req.params.id)}).lean();
     console.log(contacto);
    res.render("editarcon",{contacto:contacto});
    } catch (error) {
        console.log(error.message);
    }
});
//ruta para actualizar los datos del contacto 
router.post('/editarcontacto/:id',autenticar,async (req,res,next) =>{
   // console.log(req.body);
    //console.log(req.params.id);

    //extraemos 
     const {id} = req.params;
    //actualizamos desde mongoose 
    await contactos.findByIdAndUpdate(id, req.body);
    res.redirect("/profile");
});

router.get('/eliminarcont/:id',autenticar, async (req,res)=>{
    const {id} = req.params;
    //Accion para eliminar en la base de datos
    await contactos.findByIdAndDelete(id);
    res.redirect("/profile");
});

//ruta para las tareas echas 
router.get('/echo/:id',autenticar,async (req , res)=>{
    const {id} = req.params;
    //me busca una tarea por el id
     const tarea = await formodelo.findById(id);
     //cambiamos de false a true 
     tarea.done = !tarea.done;
     //y guardamos una ves se alla echo el cambio 
     await tarea.save();

    console.log(tarea);

    res.redirect('/profile');
});
//metodo para poder autenticarnos y no regresar a otras rutas 
//lo ejecutara cualquier ruta que querramos autenticar 
function autenticar(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }else{
        res.redirect('/');
        next();
    }
}

//esportamos
module.exports = router;