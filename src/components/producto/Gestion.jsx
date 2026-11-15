import { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { FormularioProducto } from '../formulario/FormularioProductos';
import styles from './Gestion.module.css';

function Gestion() {

    const [productos, setProductos] = useState([]);
    const [productoEditar, setProductoEditar] = useState(null);

    const estadoInicialForm = {
        nombre: '',
        precio: '',
        stock: '',
        urlImagen: ''
    };

    useEffect(() => {
        const fetchProductos = async () => {
            const db = getFirestore();

            const productosRef = collection(db, 'productos');
            const resp = await getDocs(productosRef);
            setProductos(resp.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        };
        fetchProductos();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
            try {
                const db = getFirestore();
                const docRef = doc(db, 'productos', id);
                await deleteDoc(docRef);
                setProductos(productos.filter(prod => prod.id !== id));
                alert('Producto eliminado correctamente');
            } catch (error) {
                console.error('Error al eliminar:', error);
            }
        }
    };

    const handleEditar = (producto) => {
        setProductoEditar(producto);
    };

    const handleCancelarEdicion = () => {
        setProductoEditar(null);
    };

    return (
        <div>
            {/*
            <h2>Gestión de Productos</h2>
            <hr />
            <FormularioProducto
                datosForm={productoEditar || {}}
                manejarCambio={() => { }}
                manejarEnvio={() => { }}
                manejarCambioImagen={() => { }}
                imagenFile={null}
                estadoInicialForm={estadoInicialForm}
            />
            <hr />
            */}

            {productoEditar && (
                <button onClick={handleCancelarEdicion} className={styles.cancelButton}>Cancelar Edición</button>
            )}

            <h3>Lista de Productos</h3>
            <div className={styles.productosGrid}>
                {productos.map(prod => (
                    <div key={prod.id} className={styles.productoCard}>
                        {prod.image && (
                            <div className={styles.productoImageContainer}>
                                <img src={prod.image} alt={prod.nombre} className={styles.productoImage} />
                            </div>
                        )}
                        <div className={styles.productoContent}>
                            <div className={styles.productoHeader}>
                                <h4 className={styles.productoNombre}>{prod.nombre}</h4>
                                <span className={styles.productoPrecio}>${Number(prod.precio).toFixed(2)}</span>
                                <div className={styles.productoInfo}>
                                    <p><strong>Stock:</strong> {prod.stock}</p>
                                </div>
                            </div>
                        </div>
                        <div className={styles.productoActions}>
                            <button
                                onClick={() => handleEditar(prod)}
                                className={styles.editButton}
                            >
                                ✎ Editar
                            </button>
                            <button
                                onClick={() => handleDelete(prod.id)}
                                className={styles.deleteButton}
                            >
                                🗑 Eliminar
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Gestion;