class Inventario {
    constructor() {
        this.inventario = {};
    }
//Agregamos Productos
    agregarProducto(nombre, precio, cantidad, categoria) {
        this.inventario[nombre] = { nombre, precio, cantidad, categoria };
        Object.seal(this.inventario[nombre]);
    }
//Listamos los productos de menor a mayor
    listarMenorAMayor() {
        return Object.values(this.inventario).sort((a, b) => a.precio - b.precio);
    }
//Listamos los productos de mayor a menor
    listarMayorAMenor() {
        return Object.values(this.inventario).sort((a, b) => b.precio - a.precio);
    }
//Filtramos los productos por categoria
    filtrarPorCategoria(categoria) {
        return Object.values(this.inventario).filter(producto => producto.categoria === categoria);
    }
}
//Creamos la clase venta
class Venta {
    static ventasRealizadas = [];
    static totalIngresos = 0;

    #cliente;

    constructor(producto, cliente, cantidad) {
        this.producto = producto;
        this.#cliente = cliente;
        this.cantidad = cantidad;
        this.fechaHora = new Date().toLocaleString(); // Fecha y hora de la venta
    }

    get Cliente() {
        return this.#cliente;
    }

    set Cliente(cliente) {
        this.#cliente = cliente;
    }

    realizarVenta(inventario) {
        if (inventario.inventario[this.producto]) {
            let producto = inventario.inventario[this.producto];
            if (producto.cantidad >= this.cantidad) {
                producto.cantidad -= this.cantidad;
                let ingreso = this.cantidad * producto.precio;
                Venta.totalIngresos += ingreso;
                Venta.ventasRealizadas.push({
                    producto: this.producto,
                    cliente: this.#cliente,
                    cantidad: this.cantidad,
                    ingreso: ingreso,
                    fechaHora: this.fechaHora
                });

                console.log(
                    `Venta realizada: ${this.cantidad} unidades de ${this.producto} a ${this.#cliente}.`
                );
            } else {
                console.log("Cantidad insuficiente en el inventario.");
            }
        } else {
            console.log("Producto inexistente en el inventario.");
        }
    }
//Aplicamos el descuento
    static aplicarDescuento(inventario, categoria, descuento) {
        for (let clave in inventario.inventario) {
            if (inventario.inventario[clave].categoria === categoria) {
                let producto = inventario.inventario[clave];
                let descuentoAplicado = (producto.precio * descuento) / 100;
                producto.precio -= descuentoAplicado;
                console.log(
                    `Producto: ${producto.nombre} tiene un descuento del ${descuento}% ahora cuesta ${producto.precio}`
                );
            }
        }
    }

   //producto mas vendido utlizando el reduce
    static productoMasVendido() {
        return Object.values(Venta.ventasRealizadas)
            .reduce((max, venta) => (venta.cantidad > max.cantidad ? venta : max), {cantidad: 0
            }) .producto;
    }

    static imprimirReporte(inventario) {
        console.log("\n*** Reporte Final ***");
        console.log("\nInventario Actualizado:");
        console.table(Object.values(inventario.inventario));

        console.log("\nVentas Realizadas:");
        console.table(Venta.ventasRealizadas);

        console.log("\nTotal de Ingresos Generados:");
        console.log(`$${Venta.totalIngresos.toFixed(2)}`);

        console.log("\nProducto Más Vendido:");
        console.log(Venta.productoMasVendido());
    }
}

// Crear y gestionar el inventario
let inventario = new Inventario();
inventario.agregarProducto("Camisa", 1000, 10, "Ropa");
inventario.agregarProducto("Pantalón", 2000, 5, "Ropa");
inventario.agregarProducto("Zapatos", 3000, 3, "Calzado");
inventario.agregarProducto("Gorra", 500, 20, "Accesorios");

// Listar productos
console.log("Productos de menor a mayor precio:");
console.table(inventario.listarMenorAMayor());

console.log("Productos de mayor a menor precio:");
console.table(inventario.listarMayorAMenor());

// Filtrar productos por categoría
console.log("Productos de la categoría 'Ropa':");
console.table(inventario.filtrarPorCategoria("Ropa"));

// Realizar ventas
let venta1 = new Venta("Camisa", "Juan", 2);
venta1.realizarVenta(inventario);

let venta2 = new Venta("Pantalón", "Maria", 3);
venta2.realizarVenta(inventario);

// Aplicar descuento
Venta.aplicarDescuento(inventario, "Ropa", 67);

// Imprimir el reporte final
Venta.imprimirReporte(inventario);
