import { useEffect, useState } from 'react';
import { FormularioContainer } from '../formulario/FormularioContainer';
import { productoService } from '../../service/productoService';
import GestionList from './GestionList';
import styles from './Gestion.module.css';

function Gestion() {

    const [productos, setProductos] = useState([]);
    const [productoEditar, setProductoEditar] = useState(null);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);

    useEffect(() => {
        fetchProductos();
    }, []);

    const fetchProductos = async () => {
        const productos = await productoService.obtenerProductos();
        setProductos(productos);
    };

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
        setMostrarFormulario(true);
    };

    const cerrarFormulario = () => {
        setMostrarFormulario(false);
        setProductoEditar(null);
    };

    const actualizarProductos = (producto) => {
        setProductos(prev => productoEditar
            ? prev.map(prod => prod.id === producto.id ? producto : prod)
            : [...prev, producto]);
        cerrarFormulario();
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2>Gestión de Productos</h2>
                <p className={styles.subtitle}>Visualiza y administra tus productos</p>
            </div>

            {mostrarFormulario ? (
                <FormularioContainer
                    key={productoEditar?.id ?? 'nuevo'}
                    productoEditar={productoEditar}
                    onProductoCreado={actualizarProductos}
                    onCancel={cerrarFormulario}
                />
            ) : (
                <button
                    onClick={() => setMostrarFormulario(true)}
                    className={styles.submitButton}
                    style={{ marginBottom: '20px', maxWidth: '250px' }}
                >
                    + Crear Nuevo Producto
                </button>
            )}

            <GestionList
                productos={productos}
                handleDelete={handleDelete}
                handleEditar={handleEditar} />
        </div>
    );
}

export default Gestion;