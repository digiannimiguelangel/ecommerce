
import styles from '../cuponera/Cuponera.module.css';

function CuponeraGestion({ cupon, handleDelete }) {

    if (!cupon) {
        return null;
    }

    const formatearFecha = (fecha) => {
        if (!fecha) return 'Sin fecha';

        let fechaObj;

        try {
            if (fecha && typeof fecha.toDate === 'function') {
                fechaObj = fecha.toDate();
            }
            else if (fecha instanceof Date) {
                fechaObj = fecha;
            }
            else if (typeof fecha === 'string') {
                fechaObj = new Date(fecha);
            }
            else if (typeof fecha === 'number') {
                fechaObj = new Date(fecha);
            }
            else if (fecha.seconds !== undefined) {
                fechaObj = new Date(fecha.seconds * 1000);
            }
            else {
                return 'Formato no reconocido';
            }

            if (isNaN(fechaObj.getTime())) {
                return 'Fecha inválida';
            }

            const opciones = {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            };
            return fechaObj.toLocaleDateString('es-AR', opciones);
        } catch (error) {
            return 'Error en fecha';
        }
    };

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
                <p className={styles.cuponFecha}>
                    <strong>Creado:</strong> {formatearFecha(cupon.fechaCreacion)}
                </p>
            </div>
        </div>
    );
}
export default CuponeraGestion;