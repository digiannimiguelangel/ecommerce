import styles from './Gestion.module.css';
import ProductoGestion from './GestionProducto';

function GestionList({ productos, handleDelete, handleEditar }) {

    return (
        <div className={styles.productosGrid}>
            {productos.map((producto, index) => (
                <ProductoGestion 
                    key={index} 
                    producto={producto} 
                    handleDelete={handleDelete}
                    handleEditar={handleEditar}
                />
            ))}
        </div>
    );

}
export default GestionList;
