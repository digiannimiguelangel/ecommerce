import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

export const cuponeraService = {

    obtenerCupones: async () => {
        const cuponesDB = collection(db, 'cupones');
        try {
            console.log("📦 Obteniendo cupones de Firestore...");
            const resp = await getDocs(cuponesDB);
            console.log("✅ Cupones obtenidos:", resp.docs.length);

            const cupones = resp.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            console.log("📋 Cupones procesados:", cupones);
            return cupones;
        } catch (error) {
            console.error('❌ Error al obtener cupones:', error);
            console.error('Error detalles:', error.message);
            throw error;
        }
    },

    eliminarCupon: async (cuponId) => {
        try {
            console.log('🗑 Eliminando cupón con id:', cuponId);
            const cuponRef = doc(db, 'cupones', cuponId);
            await deleteDoc(cuponRef);
            console.log('✅ Cupón eliminado exitosamente');
            return true;
        } catch (error) {
            console.error('❌ Error al eliminar cupón:', error);
            throw error;
        }
    },
};