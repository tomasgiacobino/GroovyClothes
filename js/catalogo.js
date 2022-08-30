class Catalogo {
  constructor(id, titulo, descripcion, imagen, precio, cantidad) {
    this.id = id;
    this.titulo = titulo.toUpperCase();
    this.descripcion = descripcion;
    this.imagen = imagen;
    this.precio = precio;
    this.cantidad = cantidad || 1;
  }
  addCantidad() {
    this.cantidad++;
  }
  subTotal() {

    return this.precio * this.cantidad

  }
  agregarCantidad(valor){
    this.cantidad += valor;

  }
}



// Mi array con los productos que traigo del JSON
let catalogoMostrar = [];

//Array de tipos
let tipos = ['Remera', 'Campera', 'Pantalon', 'Zapatilla']


//Array de carrito
let carritoCatalogo = [];





// Traigo elementos del HTML
let catalogo = document.getElementById("catalogoRopa");

let filtrarMarcaCatalogo = document.getElementById("filtradoMarca");

let filtrarTipoCatalogo = document.getElementById("selectTipo");

let cantidadCatalogoCarrito = document.getElementById("cantidadCatalogo");

let productosCatalogo = document.getElementById("productosCarritoCatalogo")

let totalCarritoCatalogo = document.getElementById("totalCarritoCatalogo");

let confirmar = document.getElementById("confirm")



// Funcion para filtrar por MARCA
filtrarMarcaCatalogo.addEventListener("input", function () {
  let marcaFiltrada = catalogoMostrar.filter(prenda => prenda.titulo.includes(this.value.toUpperCase()));
  if (marcaFiltrada.length == 0) {
    catalogo.innerHTML = `No se encontro ningun producto.`;
  } else {
    catalogoUI(marcaFiltrada);
  }
})


//Funcion Filtrar por TIPO
function selectTipo(lista) {
  filtrarTipoCatalogo.innerHTML += `<option selected>Todos</option>`

  for (const tipo of lista) {
    filtrarTipoCatalogo.innerHTML += `<option> ${tipo}</option>`
  }
}
selectTipo(tipos);

filtrarTipoCatalogo.onchange = function () {
  if (this.value != 'Todos') {
    const productosEncontrados = catalogoMostrar.filter(prenda => prenda.descripcion == this.value)
    catalogoUI(productosEncontrados);
  } else {
    catalogoUI(catalogoMostrar);
  }
}


//Funcion seleccionar TIPO

function seleccionamosProducto() {

  let botones = document.getElementsByClassName("btnComprar")

  for (const boton of botones) {


    boton.addEventListener("click", function () {


      let seleccionamos = carritoCatalogo.find(producto => producto.id == this.id) //find para buscar por el id (find busca un unico resultado)



      if (seleccionamos) {

        seleccionamos.addCantidad();  //Me suma la cantidad solamente

      } else {

        seleccionamos = catalogoMostrar.find(producto => producto.id == this.id)  //me busca el producto por el id 
        carritoCatalogo.push(seleccionamos)


      }

      localStorage.setItem("CarritoCatalogo", JSON.stringify(carritoCatalogo)) //Actualizamos el localStorage


      carritoModal(carritoCatalogo);


    })


  }

}





//localStorage para tipos

if ("CarritoCatalogo" in localStorage) {

  let guardados = JSON.parse(localStorage.getItem("CarritoCatalogo"))

  for (const generico of guardados) {

    carritoCatalogo.push(new Catalogo(generico.id, generico.titulo, generico.descripcion, generico.imagen, generico.precio, generico.cantidad))

  }

  carritoModal(carritoCatalogo)

}


//Función para mostrar los productos en el modal

function carritoModal(lista) {
  cantidadCatalogoCarrito.innerHTML = lista.length;
  productosCatalogo.innerHTML = "";
  for (const productos of lista) {
    let producto = document.createElement("div");
    producto.innerHTML = `
      <h4>Ariticulo: ${productos.descripcion} ${productos.titulo}</h4>
      <h4>Precio:${productos.precio}</h4>
      <h4>Cantidad en carrito:${productos.cantidad}</h4>
      <h4>Subtotal: ${productos.subTotal()}</h4>



      <a id="${productos.id}" class="btn btn-primary btn-añadir"><i class="fa-solid fa-plus"></i></a>
      <a id="${productos.id}" class="btn btn-primary btn-restar"><i class="fa-solid fa-minus"></i></a>
      <a id="${productos.id}" class="btn btn-primary btn-borrar"><i class="fa-solid fa-trash"></i></a><hr>
      
      
     `
    productosCatalogo.append(producto);
  }
  sumarCarrito()

    document.querySelectorAll(".btn-añadir").forEach(boton => boton.onclick = añadirCarrito);
    document.querySelectorAll(".btn-restar").forEach(boton => boton.onclick = restarCarrito);
    document.querySelectorAll(".btn-borrar").forEach(boton => boton.onclick = borrarDelCarrito);
}

//Función sumarCarrito

function sumarCarrito() {
  let sumaCarrito = carritoCatalogo.reduce((totalCompra, producto) => totalCompra += producto.subTotal(), 0);
  totalCarritoCatalogo.innerHTML = `Total: $ ${sumaCarrito}`;

}

function añadirCarrito(){
  let producto = carritoCatalogo.find(productos => productos.id == this.id);

  if(producto){

      producto.agregarCantidad(1);

      this.parentNode.children[2].innerHTML = "Cantidad en carrito:" + producto.cantidad;
      
      this.parentNode.children[3].innerHTML = "Subtotal:" + producto.subTotal();
      
      sumarCarrito();
      
      localStorage.setItem("CarritoCatalogo",JSON.stringify(carritoCatalogo));
  }
  
}

function restarCarrito(){
  let producto = carritoCatalogo.find(productos => productos.id == this.id)
  
  if(producto.cantidad > 1){

      producto.agregarCantidad(-1);

  
      this.parentNode.children[2].innerHTML = "Cantidad en carrito:" + producto.cantidad;

      this.parentNode.children[3].innerHTML = "Subtotal:" + producto.subTotal();

      sumarCarrito();

      localStorage.setItem("CarritoCatalogo",JSON.stringify(carritoCatalogo));

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
  let producto = carritoCatalogo.findIndex(producto => producto.id == this.id); //recorre el array completo y le pasamos el id
  carritoCatalogo.splice(producto,1); //eliminar una posicion en especifico y eliminamos solo uno

  carritoModal(carritoCatalogo); //te lo muestra

  localStorage.setItem("CarritoCatalogo",JSON.stringify(carritoCatalogo)); //actualiza

}





// Funcion para mostrar los productos del Array
function catalogoUI(lista) {
  catalogo.innerHTML = "";
  for (const prenda of lista) {

    let div = document.createElement('div');

    div.classList.add("col");

    div.innerHTML = `<div class="row row-cols-1 row-cols-md-2 g-4">
        <div class="col">
          <div class="card bg-light">
            <img src="${prenda.imagen}" class="card-img-top" alt="...">
            <div class="card-body bg-dark">
              <h5 class="card-title text-light h4">${prenda.titulo}</h5>
              <p class="card-text text-light h6">${prenda.descripcion}</p>
              <p class="card-text text-danger h6">$${prenda.precio}</p>
              <button id="${prenda.id}" class="btnComprar btn btn-light">Comprar</button>
            </div>
          </div>
        </div>`
    catalogo.append(div);
  }
  seleccionamosProducto();
}


//Mostramos en el HTML
catalogoUI(catalogoMostrar);





// Traigo los datos del JSON a mi Array
async function cargarDatos() {

  const pedido = await fetch("../json/Json.json"); //
  const datosJson = await pedido.json(); //

  for (const generico of datosJson) {

    catalogoMostrar.push(new Catalogo(generico.id, generico.titulo, generico.descripcion, generico.imagen, generico.precio, generico.cantidad))

  }
  catalogoUI(catalogoMostrar);
}
cargarDatos();



//Alert de compra confirmada cuando se haga click en el boton (fetch)

confirmar.onclick = () => {

  enviarDatos(); //llamamos a la función

}


function enviarDatos(lista) { 

  fetch("https://jsonplaceholder.typicode.com/posts", {

      method: "POST", //metodo POST
      body: JSON.stringify({
        carrito: lista,
        userID: 30
      }), //le puedo mandar cualquier tipo de información al body pero primero lo transformamos en JSON
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      } //informacion que necesito enviar para ver que información es (tipo de contenido,charset)


    }).then((respuesta) => {
      return respuesta.json()
    }) //primero lo pasamos a JSON
    .then((datos) => { //para recibir los datos

      Swal.fire(
        'Compra realizada',
        `Compra nro ${datos.id} realizada correctamente`, //si sale todo bien dira compra realizada
        'success'
      )
      vaciarElCarrito(); //llamamos a la función vaciarElCarrito para cuando apriete confirmar vacie el carrito


    }).catch((datos) => {


      Swal.fire(
        'Compra rechazada',
        `Compra nro ${datos.id} fue rechazada`, //si sale todo mal dira compra rechazada
        'error'
      )


    })

}


function vaciarElCarrito() {


  localStorage.removeItem("CarritoCatalogo");

  carritoCatalogo.splice(0, carritoCatalogo.length);

  carritoModal(carritoCatalogo);


  
}
