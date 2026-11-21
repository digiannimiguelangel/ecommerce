import { collection, getDocs, doc, getDoc, addDoc } from 'firebase/firestore';
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
    }
};
