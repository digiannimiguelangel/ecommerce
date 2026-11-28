import { useState } from 'react';
import { FormularioProducto } from './FormularioProductos';
import { productoService } from '../../service/productoService';

export function FormularioContainer({ productoEditar, onProductoCreado, onCancel }) {

    const [datosForm, setDatosForm] = useState({
        nombre: productoEditar?.nombre ?? '',
        descripcion: productoEditar?.descripcion ?? '',
        precio: productoEditar?.precio ?? '',
        stock: productoEditar?.stock ?? ''
    });

    const [imagenFile, setImagenFile] = useState(null);

    const manejarCambio = (e) => {
        const { name, value } = e.target;
        console.log("Cambio en el formulario:", name, value);
        setDatosForm({
            ...datosForm,
            [name]: value
        });
    }

    const manejarCambioImagen = (e) => {
        const { files } = e.target;
        setImagenFile(files[0]);
    };

    const manejarEnvio = async (e) => {
        e.preventDefault();

        if (!imagenFile && !productoEditar?.image) {
            alert("Por favor, selecciona una imagen para el producto.");
            return;
        }

        if (imagenFile && !imagenFile.type.startsWith('image/')) {
            alert("El archivo seleccionado debe ser una imagen.");
            return;
        }

        // Validar que todos los campos estén completos
        if (!datosForm.nombre.trim() || datosForm.precio === '' || datosForm.stock === '') {
            alert("Por favor, completa todos los campos del formulario.");
            return;
        }

        try {
            let image = productoEditar?.image;
            if (imagenFile) {
                const apiKey = import.meta.env.VITE_API_KEY;
                const formData = new FormData();
                formData.append('image', imagenFile);
                const respuestaImgbb = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
                    method: 'POST',
                    body: formData,
                });
                const datosImgbb = await respuestaImgbb.json();
                if (!respuestaImgbb.ok || !datosImgbb.success) {
                    throw new Error('La subida de la imagen a Imgbb falló.');
                }
                image = datosImgbb.data.url;
            }

            const productoCompleto = {
                nombre: datosForm.nombre.trim(),
                descripcion: datosForm.descripcion.trim(),
                precio: parseFloat(datosForm.precio),
                stock: parseInt(datosForm.stock, 10),
                image
            };
            const productoGuardado = productoEditar
                ? await productoService.actualizarProducto(productoEditar.id, productoCompleto)
                : await productoService.crearProducto(productoCompleto);

            alert(productoEditar ? "Producto actualizado correctamente" : "Producto creado correctamente");
            setDatosForm({ nombre: '', descripcion: '', precio: '', stock: '' });
            setImagenFile(null);
            const inputArchivo = document.getElementById('imagen');
            if (inputArchivo) {
                inputArchivo.value = '';
            }
            if (onProductoCreado) {
                onProductoCreado(productoEditar ? { ...productoEditar, ...productoGuardado } : productoGuardado);
            }

        } catch (error) {
            const accion = productoEditar ? 'actualizar' : 'crear';
            console.error(`Error al ${accion} el producto:`, error);
            alert(`Error al ${accion} el producto: ` + error.message);
        }
    };

    return (
        <FormularioProducto
            datosForm={datosForm}
            manejarCambio={manejarCambio}
            manejarEnvio={manejarEnvio}
            manejarCambioImagen={manejarCambioImagen}
            imagenFile={imagenFile}
            productoEditar={productoEditar}
            onCancel={onCancel}
        />
    );
}