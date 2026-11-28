import styles from './FormularioProductos.module.css';

export function FormularioProducto({ datosForm, manejarCambio, manejarEnvio, manejarCambioImagen, imagenFile, productoEditar, onCancel }) {

    return (
        <form className={styles.form} onSubmit={manejarEnvio}>
            <h3>{productoEditar ? 'Editar Producto' : 'Agregar Nuevo Producto'}</h3>
            <div>
                <label>Nombre del Producto:</label>
                <input
                    id="nombre"
                    type="text"
                    placeholder="Ej: Teclado Mecánico"
                    name="nombre"
                    value={datosForm.nombre || ''}
                    onChange={manejarCambio}
                    required
                    pattern=".*\S.*"
                    title="Ingresa un nombre que contenga al menos un carácter distinto de espacio."
                />
            </div>
            <div>
                <label htmlFor="descripcion">Descripción del producto (opcional):</label>
                <textarea
                    id="descripcion"
                    name="descripcion"
                    rows="4"
                    value={datosForm.descripcion}
                    onChange={manejarCambio}
                />
            </div>
            <div>
                <label>Precio: $</label>
                <input
                    id="precio"
                    type="number"
                    placeholder="Ej: 95"
                    name="precio"
                    value={datosForm.precio ?? ''}
                    onChange={manejarCambio}
                    required
                    min="0.01"
                    step="any"
                />
            </div>
            <div>
                <label>Stock:</label>
                <input
                    id="stock"
                    type="number"
                    placeholder="Ej: 5"
                    name="stock"
                    value={datosForm.stock ?? ''}
                    onChange={manejarCambio}
                    required
                    min="0"
                    step="1"
                />
            </div>
            <div>
                <label htmlFor="oferta" className={styles.ofertaLabel}>
                    <input
                        id="oferta"
                        type="checkbox"
                        name="oferta"
                        checked={datosForm.oferta}
                        onChange={manejarCambio}
                    />
                    Producto en oferta
                </label>
            </div>
            <div>
                <label id="imagenLabel">Imagen:</label>
                <div className={styles.archivoInput}>
                    <label htmlFor="imagen" className={styles.archivoBoton}>
                        Elegir imagen
                    </label>
                    <input
                        id="imagen"
                        aria-labelledby="imagenLabel"
                        className={styles.archivoOculto}
                        type="file"
                        accept="image/*"
                        name="imagen"
                        required={!productoEditar?.image}
                        onChange={manejarCambioImagen}
                    />
                    <span className={styles.archivoNombre}>
                        {imagenFile ? imagenFile.name : productoEditar?.image ? 'Se conservará la imagen actual' : 'Ningún archivo seleccionado'}
                    </span>
                </div>
            </div>
            <div className={styles.botones}>
                <button type="submit" className={styles.botonGuardar}>✓ Guardar Producto</button>
                {onCancel && (
                    <button 
                        type="button" 
                        className={styles.botonCancelar}
                        onClick={onCancel}
                    >
                        ✕ Cancelar
                    </button>
                )}
            </div>
        </form>
    );

}
