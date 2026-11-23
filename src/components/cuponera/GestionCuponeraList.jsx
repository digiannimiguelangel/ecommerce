import styles from '../cuponera/Cuponera.module.css';
import CuponeraGestion from './CuponeraGestion';

function GestionCuponeraList({ cupones, handleDelete }) {

    if (!cupones || cupones.length === 0) {
        return (
            <div className={styles.cuponerasGrid}>
                <p className={styles.emptyMessage}>No hay cuponeras disponibles</p>
            </div>
        );
    }

    return (
        <div className={styles.cuponerasGrid}>
            {cupones.map((cupon, index) => (
                <CuponeraGestion
                    key={cupon.id || index}
                    cupon={cupon}
                    handleDelete={handleDelete}
                />
            ))}
        </div>
    );

}
export default GestionCuponeraList;