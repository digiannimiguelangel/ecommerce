import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
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
    }
};
