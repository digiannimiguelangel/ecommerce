import { useEffect, useState } from 'react';
import { cuponeraService } from '../../service/cuponeraService';
import GestionCuponeraList from './GestionCuponeraList';
import FormularioCuponera from './FormularioCuponera';
import styles from './Cuponera.module.css';

function Cuponera() {

    const [cupones, setCupones] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);

    useEffect(() => {
        fetchCupones();
    }, []);

    const fetchCupones = async () => {
        try {
            setCargando(true);
            const cupones = await cuponeraService.obtenerCupones();
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
                setCupones(cupones.filter(cupon => cupon.id !== id));
                alert('Cuponera eliminada exitosamente');
            } catch (error) {
                console.error('Error al eliminar:', error);
            }
        }
    };

    const handleCuponerCreada = (nuevosCupones) => {
        setCupones([...cupones, nuevosCupones]);
        setMostrarFormulario(false);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2>Gestión de Cuponeras</h2>
                <p className={styles.subtitle}>Visualiza y administra tus cupones</p>
            </div>

            {mostrarFormulario ? (
                <FormularioCuponera
                    onCuponerCreada={handleCuponerCreada}
                    onCancel={() => setMostrarFormulario(false)}
                />
            ) : (
                <button
                    onClick={() => setMostrarFormulario(true)}
                    className={styles.submitButton}
                    style={{ marginBottom: '20px', maxWidth: '250px' }}
                >
                    + Crear Nueva Cuponera
                </button>
            )}

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
