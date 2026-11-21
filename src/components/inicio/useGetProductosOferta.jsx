import { useEffect, useState } from 'react';
import { productoService } from '../../service/productoService';

export function useGetProductosOferta() {

    const [productos, setProductos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const cargarProductos = async () => {
            const inicio = Date.now();

            try {
                const todosLosProductos = await productoService.obtenerProductos();
                const productosEnOferta = todosLosProductos.filter(producto => producto.oferta === true || producto.oferta === 'true');
                console.log('Todos los productos:', todosLosProductos);
                console.log('Productos en oferta:', productosEnOferta);
                setProductos(productosEnOferta);

            } catch (errorDeCarga) {
                setError(errorDeCarga);
                console.error('Error al cargar productos en oferta:', errorDeCarga);
            } finally {
                const tiempoRestante = 1000 - (Date.now() - inicio);
                if (tiempoRestante > 0) {
                    await new Promise((resolve) => setTimeout(resolve, tiempoRestante));
                }
                setCargando(false);
            }
        };

        cargarProductos();
    }, []);

    return { productos, cargando, error };
}
