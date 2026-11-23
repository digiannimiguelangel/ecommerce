import { useState } from 'react';
import { cuponeraService } from '../../service/cuponeraService';
import styles from './Cuponera.module.css';

function FormularioCuponera({ onCuponerCreada, onCancel }) {
    const [formData, setFormData] = useState({
        codigo: '',
        descuento: '',
        fechaCreacion: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            setLoading(true);

            // Usar el servicio para crear el cupón
            const nuevosCupones = await cuponeraService.crearCupon({
                codigo: formData.codigo,
                descuento: formData.descuento
            });

            console.log('✅ Cupón creado exitosamente:', nuevosCupones);

            // Resetear formulario
            setFormData({
                codigo: '',
                descuento: ''
            });

            // Notificar al padre
            if (onCuponerCreada) {
                onCuponerCreada(nuevosCupones);
            }

            alert('Cupón creado exitosamente');
        } catch (err) {
            console.error('❌ Error al crear cupón:', err);
            setError(err.message || 'Error al crear el cupón');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.formularioContainer}>
            <div className={styles.formularioHeader}>
                <h3>Crear Nueva Cuponera</h3>
            </div>

            {error && <div className={styles.formularioError}>{error}</div>}

            <form onSubmit={handleSubmit} className={styles.formulario}>
                <div className={styles.formularioGroup}>
                    <label htmlFor="codigo">Código del Cupón *</label>
                    <input
                        type="text"
                        id="codigo"
                        name="codigo"
                        value={formData.codigo}
                        onChange={handleChange}
                        placeholder="Ej: VERANO2024"
                        required
                    />
                </div>

                <div className={styles.formularioGroup}>
                    <label htmlFor="descuento">Descuento (%) *</label>
                    <input
                        type="number"
                        id="descuento"
                        name="descuento"
                        value={formData.descuento}
                        onChange={handleChange}
                        placeholder="Ej: 15"
                        min="0"
                        max="100"
                        required
                    />
                </div>

                <div className={styles.formularioActions}>
                    <button
                        type="submit"
                        className={styles.submitButton}
                        disabled={loading}
                    >
                        {loading ? 'Creando...' : '✓ Guardar Cupón'}
                    </button>
                    <button
                        type="button"
                        className={styles.cancelButton}
                        onClick={onCancel}
                        disabled={loading}
                    >
                        ✕ Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
}

export default FormularioCuponera;
