/*****************************
Autor:Jose Carlos Ruiz
Fecha Modificacion: 07/07/2018
Archivo JS
******************************/
var $$ = Dom7;

var app7 = new Framework7({
  // App root element
  root: '#app',
  // App Name
  name: 'My App',
  // App id
  id: 'com.myapp.test',
  // Enable swipe panel
  /*panel: {
    swipe: 'left',
  },*/
  // Add default routes
  routes: routes
  // ... other parameters
});


var mainView = app7.views.create('.view-main'); 


var app = {
    
    autenticado: false, //Esta propiedad nos va a permitir mantener la sesion, guardando datos en el dispositivo
    usuario:"",
    password:"",
    nombre:"",
    password2:"",
    usuario_profile: "",
    hostname: "http://www.oronoticias.org",
    urlVideo: "",
    tituloVideo: "",

    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'

    onDeviceReady: function() { //Esta es la primera funcion que se ejecuta en el dispositivo
        app.receivedEvent('deviceready');

        //console.log("VARIABLE AUTENTICADO:"+window.localStorage.getItem("autenticado"));
        
        //Validamos la Sesion
        if (window.localStorage.getItem("autenticado")=="true")
        {
            mainView.router.navigate('/home/',{animate:false});
        }

    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
       /* var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);*/
    },

    //++++++++ FUNCION PARA VERIFICAR USER Y PASSWORD Y LOGUEARSE A LA BD +++++++++++++++
    loginAccess:function(){

      this.usuario = $$('#usuario').val();
      this.password = $$('#password').val();

      if(this.usuario == "" || this.password == ""){        
         app7.dialog.alert('Debes de ingresar usuario y/o contraseña');     
      }else{

        app7.preloader.show();
        
        app7.request({
          url: this.hostname+'/mplay/api/login.php',
          data: {username:this.usuario,password:this.password},
          method:'POST',

          crossDomain: true,

          success: function(data){
            app7.preloader.hide(); //Si responde bien ocultamos el cargador
            
            var objson = JSON.parse(data);
            if (objson.data == "AUTENTICADO"){

              window.localStorage.setItem("autenticado","true"); //Para el manejo de la sesion tipo cookies
              this.autenticado = window.localStorage.getItem("autenticado"); //Lo asignamos a la variable

              mainView.router.navigate('/home/',{animate:true});

            }else {
              app7.dialog.alert("Usuario o password incorrecto");
            }
            console.log(objson.data);
          },

          error:function(error) {
            app7.preloader.hide(); //Si responde bien ocultamos el cargador
            app7.dialog.alert('Hubo un error por favor intenta nuevamente'); 
            console.log(data);
          }
        });//Fin del App7   
          
      }//Fin del Else

    }, //Fin de la funcion loginAccess
    
    //++++++++ FUNCION PARA ENTRAR A LA VISTA DE REGISTGRO +++++++++++++++
    RegisterAccess:function(){
      app7.panel.close(); //Cerrar el panel
      mainView.router.navigate('/register/',{animate:true});
    },//Fin de la funcion RegisterAccess

    //++++++++ FUNCION PARA REGISTRAR LOS DATOS DEL USUARIO +++++++++++++++
    RegisterUser:function(){
      this.usuario = $$('#frm_username').val();
      this.password = $$('#frm_password').val();
      this.nombre = $$('#frm_name').val();
      this.password2 = $$('#frm_password2').val();

      if(this.usuario == "" || this.password == "" || this.nombre == "" || this.password2 == ""){        
         app7.dialog.alert('Debes de ingresar todos los datos');
      }else{

        app7.preloader.show();
        
        app7.request({
          url: this.hostname+'/mplay/api/users.php',
          data: {username:this.usuario,password:this.password,nombre:this.nombre},
          method:'POST',

          crossDomain: true,

          success: function(data){
            app7.preloader.hide(); //Si responde bien ocultamos el cargador
            
            var objson = JSON.parse(data);
            console.log(data);

            if (objson.data == "CORRECTO"){
               app7.dialog.alert("Usuario registrado correctamente","Registro");
               mainView.router.navigate('/login/',{animate:true});
            }else {
              app7.dialog.alert("Usuario no registrado");
            }
            
          },//FIn del Sucess

          error:function(error) {
            app7.preloader.hide(); //Si existe error ocultamos el cargador
            app7.dialog.alert('Hubo un error por favor intenta nuevamente'); 
            console.log(data);
          }
        });//Fin del App7 

      }//Fin del Else si no existen datos

    }, //Fin de la Funcion RegisterUser
    
    //++++++++ FUNCION PARA ACCESAR A LA VISTA CONTACTO +++++++++++++++
    ContactAccess:function(){
      app7.panel.close(); //Cerrar el panel
      mainView.router.navigate('/contacto/',{animate:true});
    },

    //++++++++ FUNCION GUARDAR MENSAJES DE CONTACTO ++++++++++++
    GuardarContacto:function(){ //Con esta funcion guardamos en la BD a traves de la appi contacto.php
      var v_nombre = $$('#frm_nombre').val();
      var v_correo = $$('#frm_correo').val();
      var v_asunto = $$('#frm_asunto').val();
      var v_mensaje = $$('#frm_mensaje').val();

      if(v_nombre == "" || v_correo == "" || v_asunto == "" || v_mensaje == ""){        
         app7.dialog.alert('Debes de ingresar todos los datos');
      }else{

        app7.preloader.show(); //Poner cargador para simular que esta mandando datos
        
        app7.request({
          url:this.hostname+'/mplay/api/contacto.php',
          data:{nombre_php:v_nombre, correo_php:v_correo, asunto_php:v_asunto, mensaje_php:v_mensaje},
          method:'POST',

          crossDomain: true,

          success: function(data){
            app7.preloader.hide(); //Si responde bien ocultamos el cargador
            
            var objson = JSON.parse(data);
            //console.log(data);

            if (objson.data == "MSGCORRECTO"){
               app7.dialog.alert("Hemos recibido su mensaje correctamente","Contacto");
               mainView.router.navigate('/home/',{animate:true});
            }else {
              app7.dialog.alert("Hubo un error al guardar la información: Intente nuevamente");
            }
            
          },//FIn del success

          error:function(error) {
            app7.preloader.hide(); //Si existe error ocultamos el cargador
            app7.dialog.alert('Hubo un error por favor intenta nuevamente'); 
            console.log(data);
          }
        });//Fin del Request 

      }//Fin del Else si no existen datos

    },//Fin de al Funcion de GuardarContacto

    //++++++++ FUNCION PARA SALIR DE LA APP ++++++++++++++
    loginClose:function(){
     
        app7.panel.close();
        app7.dialog.confirm('¿Seguro, deseas salir de la aplicación?', function () {     
        window.localStorage.setItem("autenticado", "false");
        mainView.router.navigate('/login/',{animate:true});
      });

    }//Fin de la Funcion LoginClose
}; //+++++++++++++++++FIN DE var app +++++++++++++++++++++

//+++++++++++ ESTA FUNCION MUESTRA EL MENU DE LA IZQ. ++++++++++++++++
function showMenu(){
   app7.panel.open('left', true);
}//Fin de la funcion ShowMenu

//+++++++++++ ESTA FUNCION SE EJECUTA CUANDO ENTRA A LA VISTA DE HOME ++++++++++++++++
$$(document).on('page:init', '.page[data-name="home"]', function (e) { 
      //console.log('View Home load Init!');
      app7.panel.allowOpen = true;
      app7.panel.enableSwipe('left');
      //alert("Init home");

      var $ptrContent = app7.ptr.create('.ptr-content'); //Variable Func para refresh videos

      $ptrContent.on('refresh',function(e){ //Mandar a llamar la funcion refreshVideos despues de recargar jalar pantalla
        refreshVideos(); //Refresh de los Videos
        getSlider(); //Cargamos el slider nuevamente si hace el jalado para recarga
      });
      
      getSlider(); //Llamar a la Funcion para obtener el Slider
      getVideos(); //Llamar a la Funcion para obtener los videos
      
}); //FIn de $$document init_home

//+++++++++++ ESTA FUNCION SE EJECUTA CUANDO ENTRA A LA VISTA DE SEARCH ++++++++++++++++
//Este tipo de funciones se van a ejecutar cada vez que entremos a una vista
$$(document).on('page:init', '.page[data-name="search"]', function (e) { 
     //buscar("Apple");

    $$('#search').on('keyup', function (e) {

      var keyCode = e.keyCode || e.which;

      if (keyCode === 13){
        buscar($$('#search').val());
        e.preventDefault();
      return false;
      }else {

      }//Fin del Else

      //alert("presionamos boton");

    }); //Fin del keyup keydown

}); //FIn de $$document init_search

//+++++++++++ FUNCION buscar para BUSQUEDA DE DATOS++++++++++++++++
function buscar(buscar) {

        var buscar = buscar;

        $$('#list-search').html(""); //Para limpiar y traer los nuevos datos

        app7.preloader.show(); //Poner cargador para simular que esta mandando datos
        
        app7.request({
          url:app.hostname+'/mplay/api/search.php?buscar='+buscar,
          method:'GET',

          crossDomain: true,

          success: function(data){
            app7.preloader.hide(); //Si responde bien ocultamos el cargador
            
            var objson = JSON.parse(data);
            var video = "";

            if (objson.data == "NO_ENCONTRADOS"){
              video = "<li>NO SE ENCONTRARON RESULTADOS</li>";
              $$('#list-search').append(video);
              //app7.dialog.alert("No se encontraron resultados");
            }else {

            for (f in objson.data){
                console.log(objson.data[f].titulo);

                video = '<li><a href="#" class="item-link item-content"><div class="item-media"><img src="img/'+objson.data[f].imagen+'" width="80"/></div><div class="item-inner"><div class="item-title-row"><div class="item-title">'+objson.data[f].titulo+'</div></div><div class="item-subtitle">'+objson.data[f].autor+'</div><div class="item-text">'+objson.data[f].fecha+'</div></div></a></li>';
                $$('#list-search').append(video);

            }//Fin del For
          }//Fin del Else
            //console.log(data);
            
          },//Fin del success

          error:function(error) {
            app7.preloader.hide(); //Si existe error ocultamos el cargador
            app7.dialog.alert('Hubo un error por favor intenta nuevamente'); 
            console.log(data);
          }//Fin del error
        });//Fin del app7.request 
}//Fin de la funcion buscar

//+++++++++++ FUNCION PARA OBTENER LOS VIDEOS ++++++++++++++++
function getVideos() {
        app7.preloader.show(); //Poner cargador para simular que esta mandando datos
        
        app7.request({
          url:app.hostname+'/mplay/api/videos.php',
          method:'GET',

          crossDomain: true,

          success: function(data){
            app7.preloader.hide(); //Si responde bien ocultamos el cargador
            
            var objson = JSON.parse(data);
            var video = "";
            var img = "";

            for (f in objson.data){
                //console.log(objson.data[f].titulo);
                img = app.hostname+'/mplay/img/'+objson.data[f].imagen;
                //img = objson.data[f].imagen;
                video = '<div class="item"><div class="post"><img src="'+img+'" onClick="goVideo(\''+objson.data[f].titulo+'\',\''+objson.data[f].urlvideo+'\')"><div class="time">'+objson.data[f].duracion+'</div></div><h5>'+objson.data[f].titulo+'</h5><p>'+objson.data[f].autor+'</p><p>'+objson.data[f].visitas+' Visitas | '+objson.data[f].fecha+'</p></div>';
                $$('#content-videos').append(video);

            }
            //console.log(data);
            
          },//Fin del success

          error:function(error) {
            app7.preloader.hide(); //Si existe error ocultamos el cargador
            app7.dialog.alert('Hubo un error por favor intenta nuevamente'); 
            console.log(data);
          }//Fin del error
        });//Fin del app7.request 
}//Fin de la funcion getVideos

//+++++++++++ FUNCION PARA EL REFRESH DE VIDEOS NUEVOS ++++++++++++++++
function refreshVideos(){
    app7.request({
          url: app.hostname+'/mplay/api/videos.php',
          method:'GET',

          crossDomain: true,

          success: function(data){

            app7.ptr.done(); //Para el cargador de Actualizar despues de refrescar los videos
            $$('#content-videos').html(""); //Para que no repita la informacion se limpia el DIV
            
            var objson = JSON.parse(data);
            var video = "";
            var img = "";

            for (f in objson.data){
                //console.log(objson.data[f].titulo);
                img = app.hostname+'/mplay/img/'+objson.data[f].imagen;
                //img = objson.data[f].imagen;
                video = '<div class="item"><div class="post"><img src="'+img+'"><div class="time">'+objson.data[f].duracion+'</div></div><h5>'+objson.data[f].titulo+'</h5><p>'+objson.data[f].autor+'</p><p>'+objson.data[f].visitas+' Visitas | '+objson.data[f].fecha+'</p></div>';
                $$('#content-videos').append(video);

            }
            //console.log(data);
            
          },//Fin del success

          error:function(error) {
            app7.preloader.hide(); //Si existe error ocultamos el cargador
            app7.dialog.alert('Hubo un error por favor intenta nuevamente'); 
            console.log(data);
          }//Fin del error
        });//Fin del app7.request   
}//Fin del Funcion refreshVideos

//+++++++++++ FUNCION PARA OBTENER EL SLIDER ++++++++++++++++
function getSlider() {
        app7.preloader.show(); //Poner cargador para simular que esta mandando datos
        
        app7.request({
          url: app.hostname+'/mplay/api/slider.php',
          method:'GET',

          crossDomain: true,

          success: function(data){
            app7.preloader.hide(); //Si responde bien ocultamos el cargador
            
            var objson = JSON.parse(data);
            //var slider = "";

            var swiper = app7.swiper.get('.swiper-container'); //Contenedor para los Sliders
            swiper.removeAllSlides(); //Para remover los Sliders y cargarlos nuevamente

            for (f in objson.data){
                console.log(objson.data[f].titulo);
                var slide = '<div class="swiper-slide"><div class="slider"><div class="mask"></div><img src="img/'+objson.data[f].imagen+'" /><div class="caption"><h2>'+objson.data[f].titulo+'</h2><p>'+objson.data[f].fecha+'</p><button>Play Now</button></div></div></div>';
                swiper.appendSlide(slide);
            }
            //console.log(data);
            
          },//Fin del success

          error:function(error) {
            app7.preloader.hide(); //Si existe error ocultamos el cargador
            app7.dialog.alert('Hubo un error por favor intenta nuevamente'); 
            console.log(data);
          }//Fin del error
        });//Fin del app7.request 
}//Fin de la funcion getSlider

//+++++++++++ FUNCION PARA IR AL DETALLE DEL VIDEO ++++++++++++++++
function goVideo(titulo,url){
  app.tituloVideo = titulo;
  app.urlVideo = url;
  mainView.router.navigate('/video/',{animate:true});
}


//Este tipo de funciones se van a ejecutar cada vez que entremos a una vista
$$(document).on('page:init', '.page[data-name="video"]', function (e) { 

  console.log(app.urlVideo);
  $$()
  $$('.videoyoutube iframe').remove();
  $$('<iframe width="100%" height="200"  frameborder="0" allowfullscreen>').attr('src',app.urlVideo).appendTo('.videoyoutube');

}); //FIn de $$document init-video