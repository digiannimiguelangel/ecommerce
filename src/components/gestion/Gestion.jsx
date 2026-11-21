import { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { FormularioProducto } from '../formulario/FormularioProductos';
import { productoService } from '../../service/productoService';
import GestionList from './GestionList';

function Gestion() {

    const [productos, setProductos] = useState([]);
    const [productoEditar, setProductoEditar] = useState(null);

    const estadoInicialForm = {
        nombre: '',
        descripcion: '',
        precio: '',
        stock: '',
        urlImagen: '',
        oferta: false,
        destacado: false
    };

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
                const db = getFirestore();
                const docRef = doc(db, 'productos', id);
                await deleteDoc(docRef);
                // setProductos(productos.filter(prod => prod.id !== id));
                alert('Producto eliminado correctamente');
            } catch (error) {
                console.error('Error al eliminar:', error);
            }
        }
        setProductos(productos.filter(prod => prod.id !== id));
    };

    const handleEditar = (producto) => {
        setProductoEditar(producto);
    };

    const handleCancelarEdicion = () => {
        setProductoEditar(null);
    };

    return (
        <div>
            <h2>Alta de Productos</h2>
            <FormularioProducto
                datosForm={productoEditar || {}}
                manejarCambio={() => { }}
                manejarEnvio={() => { }}
                manejarCambioImagen={() => { }}
                imagenFile={null}
                estadoInicialForm={estadoInicialForm}
            />
            <GestionList productos={productos} />
        </div>
    );
}

export default Gestion;