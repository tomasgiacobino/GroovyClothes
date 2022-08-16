class Catalogo{
    constructor(id,titulo,descripcion,imagen,precio){
        this.id = id;
        this.titulo = titulo.toUpperCase();
        this.descripcion = descripcion;
        this.imagen = imagen;
        this.precio = precio;
    }
}

let catalogoMostrar = [];

let catalogo = document.getElementById("catalogoRopa");
let filtrarMarcaCatalogo = document.getElementById("filtrado");


filtrarMarcaCatalogo.addEventListener("input",function(){
  let marcaFiltrada = catalogoMostrar.filter(prenda => prenda.titulo.includes(this.value.toUpperCase()));
  if (marcaFiltrada.length == 0){
      catalogo.innerHTML = `No se encontro ningun producto.`;
  }else{
      catalogoUI(marcaFiltrada);
  }      
})

function catalogoUI (lista) {
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
            </div>
          </div>
        </div>`
      catalogo.append(div);        
    }
}

catalogoUI(catalogoMostrar);

//
async function cargarDatos (){

    const pedido = await fetch("../json/Json.json"); //
    const datosJson = await pedido.json(); //

    for (const generico of datosJson){

        catalogoMostrar.push(new Catalogo(generico.id,generico.titulo,generico.descripcion,generico.imagen,generico.precio))

    }
    catalogoUI(catalogoMostrar);


}
cargarDatos();