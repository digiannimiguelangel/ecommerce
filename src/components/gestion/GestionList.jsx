import styles from './Gestion.module.css';
import ProductoGestion from './ProductoGestion';

function GestionList({ productos }) {

    return (
        <div className={styles.productosGrid}>
            {productos.map((producto, index) => (
                <ProductoGestion key={index} producto={producto} />
            ))}
        </div>
    );

}
export default GestionList;
