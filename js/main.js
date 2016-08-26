/**
 * Created by Jaime Rodríguez on 25/8/16.
 * 
 *  jQuey library under by jQuery fundation under MIT licence
 *  glitch-canvas by snopery with MIT licence
 *  sorpixels.js by Jules Carbon under MIT licence
 */

//Variables globales
var img_subida = new Image();
var img_glitch = new Image();
var img_sort = new Image();

var c_alfa = document.createElement("canvas");
var ctx_alfa = c_alfa.getContext('2d');

var c_beta = document.createElement("canvas");


var c_gamma = document.createElement("canvas");



var sobre = new Image();
sobre.src = "./img/sobre.jpg";

var img_final;

var div_subir;
var div_procesar;

//Mete los elementos dentro de las globales después de cargar body
$(window).on('load', function () {
    img_final = document.getElementById('img_resultado');
    div_subir = $("#d_subir_foto");
    div_procesar = $("#d_procesar");
})

//Clickear en #d_subir_foto nos da click al input (jQuery no funciona aquí)
function llamar_input () {
    var input_c = document.getElementById("i_subida");
    input_c.click();
}

//Sistema de enseñar la carga
function cargando (n){
    if (n == 1) {
        jQuery("#cargando").css(
            "display",
            "block"
        );
    } else {
        $("#cargando").css(
            "display",
            "none"
        );
    }
}

//Sitema de subida de documentos
function subir_imagen() {
    var lector = new FileReader();
    var documento = document.getElementById('i_subida').files[0];

    cargando(1);    //Comenzar carga de documento

    lector.onloadend = function() {
        img_subida.src = lector.result;
        img_final.src = img_subida.src;

        img_subida.onload = function () {
            console.log("Imagen cargada con éxito");
            c_alfa.width = img_subida.width;
            c_alfa.height = img_subida.height;
        }
        toggle_a( div_subir, div_procesar );
        $("#d_menu_procesar").css("display", "flex");
        console.log("Imagen subida con éxito: " + img_subida.width + ',' + img_subida.height);
		
        //Compatibilidad con Firefox

		
        subir_canvas(c_alfa,img_subida);
    }

    if (documento) {
        lector.readAsDataURL(documento);
    } else {
        console.alert("Ninguna imagen eegida!");
        img_subida.src = "";
    }

    cargando(0);    //Acabar carga de documento
}

//Subir a canvas FUNCIONA
function subir_canvas (canvas_a,img_a) {
    var cactx = canvas_a.getContext('2d');
    
    //Convertir canvas a tamaño de imagen
    canvas_a.width = img_a.width;
    canvas_a.height = img_a.height;
	
	console.log("Transfir imagen a canvas alfa");
    //Imprimir imagen
    cactx.drawImage(img_a,0,0);

}

function subir_img (img_a,canvas_a) {
    console.log("Transfiriendo canvas a imagen");
    img_a.src = canvas_a.toDataURL();
}

//Glitchear
function g_imagen() {
    var dat_imagen = ctx_alfa.getImageData( 0, 0, c_alfa.width, c_alfa.height);	//Problemas con Safari y Firefox
    //Parametros para glitcheado random
    var raiz_s = Math.floor((Math.random() * 100) + 1); //Seed 0-100
    var raiz_q = Math.floor((Math.random() * 99) + 1);  //Quality 0-99
    var raiz_i = Math.floor((Math.random() * 100) + 1); //Interactions 0-100
    var raiz_a = Math.floor((Math.random() * 99) + 1);  //Ammount 0-99

    cargando(1);
    glitch ({
        seed: raiz_s,
        quality: raiz_q,
        interactions: raiz_i,
        amount: raiz_a
    })
        .fromImageData(dat_imagen)
        .toDataURL()
        .then (function (dataURL) {
            img_glitch.src = dataURL;
            console.log("Imagen glitcheada con seed: " + raiz_s + ", quality: " + raiz_q + ", interactions: " + raiz_i + " ,amount: " + raiz_a);
            img_final.src = img_glitch.src; //Works with Safari
            //efectos(c_beta, img_glitch);

            cargando(0);
        })


}

//Sortear
function s_imagen () {
    cargando(1);
    c_gamma.width = img_subida.width;
    c_gamma.height = img_subida.height;

    //Configuración
    var modo = Math.floor((Math.random() * 2) + 1);
    console.log("Iniciado sorting, modo " + modo);
    c_gamma = sortPixels(img_subida, 0, 1);
    subir_img(img_sort, c_gamma);

    efectos(c_gamma, img_sort);


    //subir_img(img_final,c_gamma);
    cargando(0);
}

//Insertar efectos a la imagen
function efectos (canvos, imago) {
    var ctx_canvos = canvos.getContext('2d');

    //Convertir al tamaño de imagen
    canvos.width = imago.width;
    canvos.height = imago.height;
    ctx_canvos.drawImage(imago,0,0);

    //Configuración
    ctx_canvos.font = "90px VT323";   //Hay que invenar una formula para que sean proporcionales (em/%)

    /*Pintar
    ctx_canvos.globalCompositeOperation = "overlay";
    ctx_canvos.drawImage(sobre,0,0);*/

    /*
    ctx_canvos.globalCompositeOperation = "difference";
    ctx_canvos.fillStyle = "white";
    ctx_canvos.fillText("#glitcho", 10, 100);
    */
    subir_img(img_final,canvos);
}

function toggle_a ( ocultar, ensenar) {
    ocultar.css(
        "display",
        "none"
    );
    ensenar.css(
        "display",
        "block"
    );
}