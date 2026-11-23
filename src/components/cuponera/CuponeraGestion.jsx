
import styles from '../cuponera/Cuponera.module.css';

function GestionCuponera({ cupon, handleDelete }) {

    if (!cupon) {
        return null;
    }

    return (
        <div className={styles.cuponCard}>
            <div className={styles.cuponHeader}>
                <h4 className={styles.cuponCodigo}>{cupon.codigo || 'Sin código'}</h4>
                <span className={styles.cuponDescuento}>{cupon.descuento || '0'}%</span>
                {handleDelete && (
                    <button
                        onClick={() => handleDelete(cupon.id)}
                        className={styles.deleteButton}
                        title="Eliminar cupón"
                    >
                        🗑
                    </button>
                )}
            </div>
            <div className={styles.cuponInfo}>
                {cupon.descripcion && <p><strong>Descripción:</strong> {cupon.descripcion}</p>}
                {cupon.fechaInicio && <p><strong>Inicio:</strong> {cupon.fechaInicio}</p>}
                {cupon.fechaVencimiento && <p><strong>Vencimiento:</strong> {cupon.fechaVencimiento}</p>}
            </div>
        </div>
    );
}
export default GestionCuponera;