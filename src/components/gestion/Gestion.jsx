import { useEffect, useState } from 'react';
import { FormularioContainer } from '../formulario/FormularioContainer';
import { productoService } from '../../service/productoService';
import GestionList from './GestionList';

function Gestion() {

    const [productos, setProductos] = useState([]);
    const [productoEditar, setProductoEditar] = useState(null);

    useEffect(() => {
        const fetchProductos = async () => {
            const productos = await productoService.obtenerProductos();
            setProductos(productos);
        };
        fetchProductos();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
            try {
                await productoService.eliminarProducto(id);
                alert('Producto eliminado correctamente');
                
                // Actualizar la lista localmente
                setProductos(productos.filter(prod => prod.id !== id));
            } catch (error) {
                console.error('Error al eliminar:', error);
                alert('Error al eliminar el producto: ' + error.message);
            }
        }
    };

    const handleEditar = (producto) => {
        setProductoEditar(producto);
    };

    const actualizarProductos = async () => {
        const productos = await productoService.obtenerProductos();
        setProductos(productos);
    };

    return (
        <div>
            <FormularioContainer onProductoCreado={actualizarProductos} />
            <GestionList productos={productos} handleDelete={handleDelete} handleEditar={handleEditar} />
        </div>
    );
}

export default Gestion;