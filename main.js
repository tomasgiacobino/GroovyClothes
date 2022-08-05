
class Prenda{
    constructor(tipo,marca,talle,color,precio,cantidad,id){
        this.tipo = tipo;
        this.marca = marca;
        this.talle = talle; 
        this.color = color;
        this.precio = precio;
        this.cantidad = cantidad;
        this.id = id;
    }
}


let prendas = [];
let arrayIds = [];


let divBuscar = document.getElementById("divMostrar")
let form = document.getElementById("formCargar");
let formBuscar = document.getElementById("filtrado");




if ("ListaProductos" in localStorage){

     const guardados = JSON.parse(localStorage.getItem('ListaProductos'));
     for (const generico of guardados){
         prendas.push(new Prenda(generico.tipo,generico.marca,generico.talle,generico.color,generico.precio,generico.cantidad,generico.id))
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

let contador = 0;

const cargarProductos = (e) =>{
    
    console.log(arrayIds)
    e.preventDefault();
    if (e.target[1].value == "" || e.target[2].value == "" || e.target[3].value == "" || e.target[4].value == ""){
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

        let prenda = new Prenda(tipo,marca.toUpperCase(),talle,color,precio,cantidad,id);

        prendas.push(prenda);
        form.reset();

        localStorage.setItem("ListaProductos",JSON.stringify(prendas));
        localStorage.setItem("ListaId",JSON.stringify(arrayIds));
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
                            <button id="${prenda.id}" class="buttonBorrar"> Restar Unidad </button>
                            <button class="buttonComprar"> Comprar </button>`
        divBuscar.append(div)
    }
    eventoBoton();
}

window.addEventListener("load",verProducto(prendas))


function eventoBoton(){
    let buttonBorrar = document.getElementsByClassName("buttonBorrar");
    for (const boton of buttonBorrar){
        boton.addEventListener("click",function(){
            let eliminar = prendas.filter(prendas => prendas.id != this.id);
            prendas = eliminar;
            localStorage.setItem("ListaProductos",JSON.stringify(prendas));
            verProducto(prendas);
        })
    }
    
}    




form.addEventListener("submit",cargarProductos);

formBuscar.addEventListener("input",function(){
        let marcaFiltrada = prendas.filter(prenda => prenda.marca.includes(this.value.toUpperCase()));
        if (marcaFiltrada.length == 0){
            divBuscar.innerHTML = `No se encontro ningun producto.`
        }else{
            verProducto(marcaFiltrada);
        }      
})











