
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

console.log(carrito)
console.log(prendas);


let divBuscar = document.getElementById("divMostrar")
let form = document.getElementById("formCargar");
let formBuscar = document.getElementById("filtrado");
let formEliminarID = document.getElementById("formEliminarID");
let cantidadCarrito = document.getElementById("cantidadCarrito");
let productosCarrito = document.getElementById("productosCarrito")
let totalCarrito = document.getElementById("totalCarrito")



let contador = 0;

const cargarProductos = (e) =>{

    e.preventDefault();
    if (e.target[1].value == "" || e.target[2].value == "" || e.target[3].value == "" || e.target[4].value == "" || e.target[5].value == ""){
        alert("Error al cargar prenda!")
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

const verProducto = (lista) =>{
    divBuscar.innerHTML = "";
    for (const prenda of lista){
        let div = document.createElement('div')
        div.classList.add('productos')
        div.innerHTML = ` <strong>${prenda.tipo}</strong> ${prenda.marca}<br>                            
                            <strong>Talle:</strong> ${prenda.talle}<br>
                            <strong>Color:</strong> ${prenda.color}<br>
                            <strong>Precio:</strong> ${prenda.precio}<br>
                            <strong>Cantidad:</strong> ${prenda.cantidad}<br>
                            <strong>ID:</strong> ${prenda.id}<br>
                            <button id= "${prenda.id}" class="buttonComprar"> Comprar </button>`
        divBuscar.append(div)
    }

    eventoBotonComprar();
}

window.addEventListener("load",verProducto(prendas))






function eventoBotonComprar(){
    let buttonComprar = document.getElementsByClassName("buttonComprar");
    for (const boton of buttonComprar){
        boton.addEventListener("click",function(){
            for (let i = 0; i < prendas.length; i++){
                if (prendas[i].id == this.id){
                    let exist = carrito.find(prendas => prendas.id == this.id);
                    if (exist){
                        exist.addCantidad();
                        prendas[i].cantidad--;
                        if(prendas[i].cantidad == 0){
                            Toastify({
                                text: "No hay mas stock de esta prenda",
                                duration: 3000,
                                gravity: 'bottom',
                                position: 'right',
                                style: {
                                    background: 'linear-gradient(to right, #00b09b, #96c92d)'
                                }
                            }).showToast();
                        }
                    }else{
                        exist = prendas.find(prendas => prendas.id == this.id);
                        carrito.push(exist);
                        prendas[i].cantidad--;
                        if(prendas[i].cantidad == 0){
                            Toastify({
                                text: "No hay mas stock de esta prenda",
                                duration: 3000,
                                gravity: 'bottom',
                                position: 'right',
                                style: {
                                    background: 'linear-gradient(to right, #00b09b, #96c92d)'
                                }
                            }).showToast();
                        }
                    }
                    localStorage.setItem('ListaCarrito',JSON.stringify(carrito));
                    localStorage.setItem('ListaProductos',JSON.stringify(prendas));
                    carritoHTML(carrito);
                    verProducto(prendas)

                }
            }
            
        })
    }
}

const eliminarID = (e) =>{
    e.preventDefault();
    let eliminarID = prendas.filter(prendas => prendas.id != e.target[0].value);
    prendas = eliminarID;
    localStorage.setItem("ListaProductos",JSON.stringify(prendas));
    verProducto(prendas)
    formEliminarID.reset();
}

function carritoHTML(lista){
    cantidadCarrito.innerHTML = lista.length;
    productosCarrito.innerHTML = "";
    for (const productos of lista){
        let producto = document.createElement('div');
        producto.innerHTML = `<hr><h4>Ariticulo: ${productos.tipo} ${productos.marca}</h4>
                              <h4>Precio:${productos.precio}</h4>
                              <h4>Cantidad:${productos.cantidadEnCarrito}</h4>
                              <h4>Subtotal: ${productos.subTotal()}<h4><br> <hr>
                              `;
        productosCarrito.append(producto);
    }
    sumarCarrito();

}

function sumarCarrito(){
    let sumaCarrito = carrito.reduce((totalCompra,producto)=>totalCompra += producto.subTotal(),0);
    totalCarrito.innerHTML = `Total: ${sumaCarrito}`;

}



form.addEventListener("submit",cargarProductos);
formEliminarID.addEventListener("submit",eliminarID);


formBuscar.addEventListener("input",function(){
        let marcaFiltrada = prendas.filter(prenda => prenda.marca.includes(this.value.toUpperCase()));
        if (marcaFiltrada.length == 0){
            divBuscar.innerHTML = `No se encontro ningun producto.`;
        }else{
            verProducto(marcaFiltrada);
        }      
})


if ('ListaCarrito' in localStorage){
        
    const guardadosCarrito = JSON.parse(localStorage.getItem('ListaCarrito'));
        
    for (const generico of guardadosCarrito){
        carrito.push(new Prenda(generico.tipo,generico.marca,generico.talle,generico.color,generico.precio,generico.cantidad,generico.id,generico.cantidadEnCarrito))
    }
    carritoHTML(carrito)
}

