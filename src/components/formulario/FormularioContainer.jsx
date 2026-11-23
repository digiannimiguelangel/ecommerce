import { useState } from 'react';
import { FormularioProducto } from './FormularioProductos';
import { productoService } from '../../service/productoService';

export function FormularioContainer({ onProductoCreado, onCancel }) {

    const [datosForm, setDatosForm] = useState({
        nombre: '',
        precio: '',
        stock: ''
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

        if (!imagenFile) {
            alert("Por favor, selecciona una imagen para el producto.");
            return;
        }

        if (!imagenFile.type.startsWith('image/')) {
            alert("El archivo seleccionado debe ser una imagen.");
            return;
        }

        // Validar que todos los campos estén completos
        if (!datosForm.nombre || !datosForm.precio || !datosForm.stock) {
            alert("Por favor, completa todos los campos del formulario.");
            return;
        }

        const apiKey = import.meta.env.VITE_API_KEY;
        const formData = new FormData();
        formData.append('image', imagenFile);

        try {
            console.log("Subiendo imagen a Imgbb...");
            const respuestaImgbb = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
                method: 'POST',
                body: formData,
            });

            const datosImgbb = await respuestaImgbb.json();
            
            if (datosImgbb.success) {
                console.log("✅ Imagen subida con éxito");
                console.log("   URL:", datosImgbb.data.url);

                const productoCompleto = {
                    nombre: datosForm.nombre.trim(),
                    precio: parseFloat(datosForm.precio),
                    stock: parseInt(datosForm.stock, 10),
                    image: datosImgbb.data.url
                };
                console.log("📦 Guardando producto en Firestore");

                await productoService.crearProducto(productoCompleto);
                console.log("✅ Producto creado exitosamente");
                
                alert("Producto creado correctamente");
                
                // Resetear formulario
                setDatosForm({ nombre: '', precio: '', stock: '' });
                setImagenFile(null);
                
                // Resetear el input de archivo en el DOM
                const inputArchivo = document.getElementById('imagen');
                if (inputArchivo) {
                    inputArchivo.value = '';
                }
                
                // Llamar al callback para actualizar la lista
                if (onProductoCreado) {
                    console.log("Actualizando lista de productos...");
                    onProductoCreado();
                }

            } else {
                throw new Error('La subida de la imagen a Imgbb falló.');
            }

        } catch (error) {
            console.error("Error al crear el producto:", error);
            alert("Error al crear el producto: " + error.message);
        }
    };

    return (
        <FormularioProducto
            datosForm={datosForm}
            manejarCambio={manejarCambio}
            manejarEnvio={manejarEnvio}
            manejarCambioImagen={manejarCambioImagen}
            imagenFile={imagenFile}
            onCancel={onCancel}
        />
    );
}