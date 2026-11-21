import { useState } from 'react';
import { FormularioProducto } from './FormularioProductos';
import { productoService } from '../../service/productoService';

export function FormularioContainer() {

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
                console.log("Imagen subida con éxito. URL:", datosImgbb.data.url);

                const productoCompleto = {
                    ...datosForm,
                    image: datosImgbb.data.url
                };
                console.log("Enviando los siguientes datos a la API:", productoCompleto);

                await productoService.crearProducto(productoCompleto);
                alert("Producto creado correctamente");
                setDatosForm({ nombre: '', precio: '', stock: '' });
                setImagenFile(null);

            } else {
                throw new Error('La subida de la imagen a Imgbb falló.');
            }

        } catch (error) {
            console.error("Error al crear el producto:", error);
            alert("Error al crear el producto");
        }
    };

    return (
        <FormularioProducto
            datosForm={datosForm}
            manejarCambio={manejarCambio}
            manejarEnvio={manejarEnvio}
            manejarCambioImagen={manejarCambioImagen}
            imagenFile={imagenFile}
        />
    );
}