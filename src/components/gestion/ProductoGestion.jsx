import styles from './Gestion.module.css';

function GestionProducto({ producto, handleEditar, handleDelete }) {

    return (
        <div className={styles.productoCard}>
            {producto.image && (
                <div className={styles.productoImageContainer}>
                    <img src={producto.image} alt={producto.nombre} className={styles.productoImage} />
                </div>
            )}
            <div className={styles.productoContent}>
                <div className={styles.productoHeader}>
                    <h4 className={styles.productoNombre}>{producto.nombre}</h4>
                    <span className={styles.productoPrecio}>${Number(producto.precio).toFixed(2)}</span>
                    <div className={styles.productoInfo}>
                        <p><strong>Stock:</strong> {producto.stock}</p>
                    </div>
                </div>
            </div>
            <div className={styles.productoActions}>
                <button
                    onClick={() => handleEditar && handleEditar(producto)}
                    className={styles.editButton}
                >
                    ✎ Editar
                </button>
                <button
                    onClick={() => handleDelete && handleDelete(producto.id)}
                    className={styles.deleteButton}
                >
                    🗑 Eliminar
                </button>
            </div>
        </div>
    );
}
export default GestionProducto;
