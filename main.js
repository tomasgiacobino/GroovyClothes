
class Prenda{
    constructor(tipo,marca,talle,color,precio,cantidad,id,cantidadEnCarrito){
        this.tipo = tipo;
        this.marca = marca;
        this.talle = talle; 
        this.color = color;
        this.precio = parseFloat(precio);
        this.cantidad = parseInt(cantidad);
        this.id = id;
        this.cantidadEnCarrito = parseInt(cantidadEnCarrito) || 1;
    }
    addCantidad(){
        this.cantidadEnCarrito++;
    }
    subTotal(){
        return this.precio * this.cantidadEnCarrito;
    }
    agregarCantidad(valor){
        this.cantidadEnCarrito += valor;
        this.cantidad -= valor
    }
    agregarCantidad2(valor){
        this.cantidadEnCarrito += valor;
        this.cantidad += 1;
    }
}


let prendas = [];
let arrayIds = [];
const carrito = [];

if ("ListaProductos" in localStorage){

    const guardados = JSON.parse(localStorage.getItem("ListaProductos"));
    for (const generico of guardados){
        prendas.push(new Prenda(generico.tipo,generico.marca,generico.talle,generico.color,generico.precio,generico.cantidad,generico.id,generico.cantidadEnCarrito))
    }
}


if ("ListaId" in localStorage){
   var recuperarId = localStorage.getItem("ListaId");
   if (recuperarId == null){
       arrayIds = [];
   }else{
       arrayIds = JSON.parse(recuperarId);
   }
}


//Traigo elementos del HTML
let divBuscar = document.getElementById("divMostrar")
let form = document.getElementById("formCargar");
let formBuscar = document.getElementById("filtrado");
let formEliminarID = document.getElementById("formEliminarID");
let cantidadCarrito = document.getElementById("cantidadCarrito");
let productosCarrito = document.getElementById("productosCarrito")
let totalCarrito = document.getElementById("totalCarrito")
//Traigo elementos del HTML


//Contador para generar ID 
let contador = 0;
//Contador para generar ID

// Inicio funcion de Cargar productos
const cargarProductos = (e) =>{

    e.preventDefault();
    if (e.target[1].value == "" || e.target[2].value == "" || e.target[3].value == "" || e.target[4].value == "" || e.target[5].value == ""){
        return Toastify({
            text: "Porfavor cargue todos los valores de la prenda.",
            duration: 2000,
            gravity: 'top',
            position: 'right',
            style: {
                background: 'linear-gradient(to right, #1715ad, #3b4ba1, #013371)'
            }
        }).showToast();
    }else{
        arrayIds.push(contador);
        let tipo = e.target[0].value;
        let marca = e.target[1].value;
        let talle = e.target[2].value;
        let color = e.target[3].value;
        let precio = e.target[4].value;
        let cantidad = e.target[5].value;
        let id = arrayIds.length;
        let cantidadEnCarrito;

        let prenda = new Prenda(tipo,marca.toUpperCase(),talle,color,precio,cantidad,id,cantidadEnCarrito);

        prendas.push(prenda);
        form.reset();

        localStorage.setItem('ListaProductos',JSON.stringify(prendas));
        localStorage.setItem('ListaId',JSON.stringify(arrayIds));
        verProducto(prendas)
    }
}
// Fin funcion de Cargar productos

// Inicio funcion de Ver productos
const verProducto = (lista) =>{
    divBuscar.innerHTML = "";
    for (const prenda of lista){
        let div = document.createElement('div');
        div.classList.add('productos');
        div.innerHTML = ` <h3><strong>${prenda.tipo}</strong> ${prenda.marca}<br></h3>                            
                            <h5>Talle:${prenda.talle}</h5>
                            <h5>Color: ${prenda.color}</h5>
                            <h5>Precio:</> ${prenda.precio}</h5>
                            <h5>Cantidad: ${prenda.cantidad}</h5>
                            <h5>ID: ${prenda.id}</h5>
                            <button id= "${prenda.id}" class="buttonComprar btn btn-dark"> Comprar </button>`
        divBuscar.append(div);
    }

    eventoBotonComprar();
}
// Fin funcion de Ver productos


// Aca se cargan las prendas guardadas en el localStorage cuando se inicia la pagina
window.addEventListener("load",verProducto(prendas))
//Aca se cargan las prendas guardadas en el localStorage cuando se inicia la pagina

//Funcion para retornar que no hay mas stock de una prenda al tocar el boton COMPRAR
function noStockPrenda(){
    return Toastify({
        text: "No hay mas stock de esta prenda",
        duration: 3000,
        gravity: 'bottom',
        position: 'right',
        style: {
            background: 'linear-gradient(to right, #00b09b, #96c92d)'
        }
    }).showToast();
}
//Funcion para retornar que no hay mas stock de una prenda al tocar el boton COMPRAR


// Inicio Funcion para comprar Productos y cargarlos al carrito
function eventoBotonComprar(){
    let buttonComprar = document.getElementsByClassName("buttonComprar");
    for (const boton of buttonComprar){
        boton.addEventListener("click",function(){
            for (let i = 0; i < prendas.length; i++){
                if (prendas[i].id == this.id){
                    let exist = carrito.find(prendas => prendas.id == this.id);
                    if (exist){
                        if (prendas[i].cantidad > 0){   
                            exist.addCantidad();
                            prendas[i].cantidad--;
                            localStorage.setItem('ListaCarrito',JSON.stringify(carrito));
                            localStorage.setItem('ListaProductos',JSON.stringify(prendas));
                        }else{
                            noStockPrenda();
                        }
                    }else{
                        exist = prendas.find(prendas => prendas.id == this.id);
                        if (prendas[i].cantidad > 0){
                            carrito.push(exist);
                            prendas[i].cantidad--;
                            localStorage.setItem('ListaCarrito',JSON.stringify(carrito));
                            localStorage.setItem('ListaProductos',JSON.stringify(prendas));
                        }else{
                            noStockPrenda();
                        }
                    }
                    carritoHTML(carrito);
                    verProducto(prendas)
                }
            } 
        })
    }
}

//Fin Funcion para comprar Productos y cargarlos al carrito

// Inicio Funcion para eliminar Productos del local storage.
const eliminarID = (e) =>{
    e.preventDefault();
    let validarID = prendas.find(prendas => prendas.id == e.target[0].value);
    if (validarID){
        let eliminarID = prendas.filter(prendas => prendas.id != e.target[0].value);
        prendas = eliminarID;
        localStorage.setItem("ListaProductos",JSON.stringify(prendas));
        verProducto(prendas)
        formEliminarID.reset();
        return Toastify({
            text: `Se elimino correctamente el ID: ${validarID.id}`,
            duration: 3000,
            gravity: 'bottom',
            position: 'right',
            style: {
                background: 'linear-gradient(to right, #632121,#ad1515,#872a2a)'
            }
        }).showToast();
    }else{
        formEliminarID.reset();          
        return Toastify({
            text: "Ese ID no esta asociado a ninguna prenda.",
            duration: 2000,
            gravity: 'bottom',
            position: 'right',
            style: {
            background: 'linear-gradient(to right, #632121,#ad1515,#872a2a)'
            }
        }).showToast();
    }
}
// Fin Funcion para eliminar Productos del local storage.

// Inicio Funcion para mostrar productos del carrito.
function carritoHTML(lista){
    cantidadCarrito.innerHTML = lista.length;
    productosCarrito.innerHTML = "";
    for (const productos of lista){
        let producto = document.createElement("div");
        producto.innerHTML = `
        <h4>Ariticulo: ${productos.tipo} ${productos.marca}</h4>
        <h4>Precio:${productos.precio}</h4>
        <h4>Cantidad en carrito:${productos.cantidadEnCarrito}</h4>
        <h4>Subtotal: ${productos.subTotal()}</h4>



        <a id="${productos.id}" class="btn btn-primary btn-añadir"><i class="fa-solid fa-plus"></i></a>
        <a id="${productos.id}" class="btn btn-primary btn-restar"><i class="fa-solid fa-minus"></i></a>
        <a id="${productos.id}" class="btn btn-primary btn-borrar"><i class="fa-solid fa-trash"></i></a><hr>
        
        
       `
        productosCarrito.append(producto);
    }
    sumarCarrito();

    document.querySelectorAll(".btn-añadir").forEach(boton => boton.onclick = añadirCarrito);
    document.querySelectorAll(".btn-restar").forEach(boton => boton.onclick = restarCarrito);
    document.querySelectorAll(".btn-borrar").forEach(boton => boton.onclick = borrarDelCarrito);
}
// Fin Funcion para mostrar productos del carrito.

// Inicio Funcion para ver el Total del carrito
function sumarCarrito(){
    let sumaCarrito = carrito.reduce((totalCompra,producto)=>totalCompra += producto.subTotal(),0);
    totalCarrito.innerHTML = `Total: ${sumaCarrito}`;
}
// Fin Funcion para ver el Total del carrito

function añadirCarrito(){
    let producto = carrito.find(productos => productos.id == this.id);

    if(producto.cantidad >= 1){

        producto.agregarCantidad(1);

        this.parentNode.children[2].innerHTML = "Cantidad en carrito:" + producto.cantidadEnCarrito;
        
        this.parentNode.children[3].innerHTML = "Subtotal:" + producto.subTotal();
        
        sumarCarrito();
        
        localStorage.setItem("ListaCarrito",JSON.stringify(carrito));
        localStorage.setItem("ListaProductos",JSON.stringify(prendas));
        verProducto(prendas);
    }else{
        return noStockPrenda();
    }
    
}

function restarCarrito(){
    let producto = carrito.find(productos => productos.id == this.id)
    
    if(producto.cantidadEnCarrito>1){

        producto.agregarCantidad2(-1);

    
        this.parentNode.children[2].innerHTML = "Cantidad en carrito:" + producto.cantidadEnCarrito;

        this.parentNode.children[3].innerHTML = "Subtotal:" + producto.subTotal();

        sumarCarrito();

        localStorage.setItem("ListaCarrito",JSON.stringify(carrito));
        localStorage.setItem("ListaProductos",JSON.stringify(prendas));
        verProducto(prendas);

    }else{ 
        return Toastify({
            text: "No puedes tener cantidad 0.",
            duration: 2000,
            gravity: 'bottom',
            position: 'right',
            style: {
                background: 'linear-gradient(to right, #632121,#ad1515,#872a2a)'
            }
        }).showToast();
    }
}

function borrarDelCarrito(){
    let producto = carrito.findIndex(producto => producto.id == this.id);
    carrito.splice(producto,1);

    carritoHTML(carrito);

    localStorage.setItem("ListaCarrito",JSON.stringify(carrito));

}


form.addEventListener("submit",cargarProductos);
formEliminarID.addEventListener("submit",eliminarID);

// Inicio Funcion para filtrar marcas.
formBuscar.addEventListener("input",function(){
        let marcaFiltrada = prendas.filter(prenda => prenda.marca.includes(this.value.toUpperCase()));
        if (marcaFiltrada.length == 0){
            divBuscar.innerHTML = `No se encontro ningun producto.`;
        }else{
            verProducto(marcaFiltrada);
        }      
})
// Fin Funcion para filtrar marcas.


if ('ListaCarrito' in localStorage){
        
    const guardadosCarrito = JSON.parse(localStorage.getItem('ListaCarrito'));
        
    for (const generico of guardadosCarrito){
        carrito.push(new Prenda(generico.tipo,generico.marca,generico.talle,generico.color,generico.precio,generico.cantidad,generico.id,generico.cantidadEnCarrito))
    }
    carritoHTML(carrito)
}

