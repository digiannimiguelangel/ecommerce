
import styles from '../cuponera/Cuponera.module.css';

function CuponeraGestion({ cupon, handleDelete }) {

    if (!cupon) {
        return null;
    }

    // Formatear la fecha de creación
    const formatearFecha = (fecha) => {
        console.log('🔍 Fecha recibida:', fecha);
        console.log('🔍 Tipo:', typeof fecha);
        console.log('🔍 Constructor:', fecha?.constructor?.name);
        console.log('🔍 Tiene toDate?:', typeof fecha?.toDate);
        
        if (!fecha) return 'Sin fecha';
        
        let fechaObj;
        
        try {
            // Primero intentar si es un objeto con método toDate (Timestamp de Firebase)
            if (fecha && typeof fecha.toDate === 'function') {
                console.log('✅ Es Timestamp de Firebase');
                fechaObj = fecha.toDate();
            } 
            // Si es una Date de JavaScript
            else if (fecha instanceof Date) {
                console.log('✅ Es Date de JavaScript');
                fechaObj = fecha;
            } 
            // Si es un string
            else if (typeof fecha === 'string') {
                console.log('✅ Es string');
                fechaObj = new Date(fecha);
            } 
            // Si es un número (milisegundos)
            else if (typeof fecha === 'number') {
                console.log('✅ Es número');
                fechaObj = new Date(fecha);
            } 
            // Si es un objeto con propiedades seconds y nanoseconds (Timestamp de Firebase serializado)
            else if (fecha.seconds !== undefined) {
                console.log('✅ Es objeto Timestamp serializado');
                fechaObj = new Date(fecha.seconds * 1000);
            }
            else {
                console.log('⚠️ Tipo desconocido:', fecha);
                return 'Formato no reconocido';
            }

            // Validar que sea una fecha válida
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
            const resultado = fechaObj.toLocaleDateString('es-AR', opciones);
            console.log('✅ Fecha formateada:', resultado);
            return resultado;
        } catch (error) {
            console.error('❌ Error al formatear fecha:', error, error.stack);
            return 'Error en fecha';
        }
    };

    console.log('📋 Cupón completo:', cupon);
    console.log('📋 fechaCreacion:', cupon.fechaCreacion);
    console.log('📋 createdAt:', cupon.createdAt);

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