import { useEffect, useState } from 'react';
import { cuponeraService } from '../../service/cuponeraService';
import GestionCuponeraList from './GestionCuponeraList';
import styles from './Cuponera.module.css';

function Cuponera() {

    const [cupones, setCupones] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        fetchCupones();
    }, []);

    const fetchCupones = async () => {
        try {
            console.log("🔍 Iniciando carga de cupones...");
            setCargando(true);
            const cupones = await cuponeraService.obtenerCupones();
            console.log("✅ Cupones cargados en Cuponera.jsx:", cupones);
            setCupones(cupones);
        } catch (error) {
            console.error('❌ Error al obtener cupones:', error);
            console.error('Detalles del error:', error.message);
            setCupones([]);
        } finally {
            setCargando(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar esta cuponera?')) {
            try {
                await cuponeraService.eliminarCupon(id);
                console.log('✅ Cuponera eliminada. Actualizando lista...');
                // Actualizar la lista removiendo el cupón
                setCupones(cupones.filter(cupon => cupon.id !== id));
                alert('Cuponera eliminada exitosamente');
            } catch (error) {
                console.error('Error al eliminar:', error);
                alert('Error al eliminar la cuponera: ' + error.message);
            }
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2>Gestión de Cuponeras</h2>
            </div>

            {cargando ? (
                <div className={styles.loading}>Cargando cupones...</div>
            ) : (
                <GestionCuponeraList
                    cupones={cupones}
                    handleDelete={handleDelete}
                />
            )}
        </div>
    );
}

export default Cuponera;