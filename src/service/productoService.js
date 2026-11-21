import { collection, getDocs, doc, getDoc, addDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

export const productoService = {

    obtenerProductos: async () => {
        const productosDB = collection(db, 'productos');
        try {
            const resp = await getDocs(productosDB);
            return resp.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Error al obtener productos:', error);
            throw error;
        }
    },

    obtenerProductoPorId: async (id) => {
        try {
            const docRef = doc(db, 'productos', id);
            const resp = await getDoc(docRef);
            if (resp.exists()) {
                return { id: resp.id, ...resp.data() };
            } else {
                console.log("Producto no encontrado.");
                return null;
            }
        } catch (error) {
            console.error("Error al cargar el producto:", error);
            throw error;
        }
    },

    crearProducto: async (productoData) => {
        try {
            const productosDB = collection(db, 'productos');
            const datosFormateados = {
                nombre: productoData.nombre,
                precio: parseFloat(productoData.precio),
                stock: parseInt(productoData.stock, 10),
                image: productoData.image
            };

            // Solo agregar imageDeleteHash si existe y no es undefined
            if (productoData.imageDeleteHash) {
                datosFormateados.imageDeleteHash = productoData.imageDeleteHash;
            }

            console.log("Datos formateados para guardar:", datosFormateados);

            const docRef = await addDoc(productosDB, datosFormateados);
            console.log("Producto creado con ID:", docRef.id);

            return {
                id: docRef.id,
                ...datosFormateados
            };
        } catch (error) {
            console.error('Error al crear el producto:', error);
            throw error;
        }
    },

    eliminarImagenDeImgbb: async (deleteHash) => {
        try {
            if (!deleteHash) {
                console.warn('⚠ No hay delete_hash disponible para eliminar la imagen');
                return false;
            }

            console.log("🗑 Intentando eliminar imagen con delete_hash:", deleteHash);

            const apiKey = import.meta.env.VITE_API_KEY;
            console.log("API Key presente:", !!apiKey);

            // Intentar con método GET primero
            const urlEliminar = `https://api.imgbb.com/1/delete?key=${apiKey}&delete_hash=${deleteHash}`;
            console.log("URL de eliminación:", urlEliminar);

            let response = await fetch(urlEliminar, {
                method: 'GET'
            });

            let resultado = await response.json();
            console.log("Respuesta de imgbb (GET):", resultado);

            // Si falla con GET, intentar con POST
            if (!resultado.success) {
                console.log("🔄 Intentando con método POST...");

                const formData = new FormData();
                formData.append('delete_hash', deleteHash);

                response = await fetch(`https://api.imgbb.com/1/delete?key=${apiKey}`, {
                    method: 'POST',
                    body: formData
                });

                resultado = await response.json();
                console.log("Respuesta de imgbb (POST):", resultado);
            }

            if (resultado.success) {
                console.log('✅ Imagen eliminada de imgbb correctamente');
                return true;
            } else {
                console.warn('❌ No se pudo eliminar la imagen de imgbb:', resultado);
                if (resultado.error) {
                    console.warn('Error detallado:', resultado.error);
                }
                return false;
            }
        } catch (error) {
            console.error('❌ Error al eliminar imagen de imgbb:', error);
            return false;
        }
    },

    eliminarProducto: async (id) => {
        try {
            // Obtener el producto directamente de Firestore
            const docRef = doc(db, 'productos', id);
            const productoDocSnap = await getDoc(docRef);

            if (productoDocSnap.exists()) {
                const producto = productoDocSnap.data();
                console.log("📦 Producto encontrado:", producto);
                console.log("🏷 Delete hash:", producto.imageDeleteHash);

                // Si existe delete_hash, eliminar la imagen de imgbb primero
                if (producto && producto.imageDeleteHash) {
                    console.log("🗑 Iniciando eliminación de imagen de imgbb...");
                    await this.eliminarImagenDeImgbb(producto.imageDeleteHash);
                } else {
                    console.warn("⚠ No hay delete_hash para este producto. No se puede eliminar la imagen.");
                }
            } else {
                console.warn("⚠ Producto no encontrado en Firestore");
            }

            // Eliminar el documento de Firebase
            console.log("🗑 Eliminando documento de Firebase...");
            await deleteDoc(docRef);
            console.log("✅ Producto eliminado de Firebase");

            return true;
        } catch (error) {
            console.error('❌ Error al eliminar:', error);
            throw error;
        }
    }
};

