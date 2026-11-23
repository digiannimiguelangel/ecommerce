import { collection, getDocs, doc, deleteDoc, addDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

export const cuponeraService = {

    crearCupon: async (cuponData) => {
        try {
            console.log('📝 Creando nuevo cupón:', cuponData);

            // Validar campos obligatorios
            if (!cuponData.codigo || !cuponData.codigo.trim()) {
                throw new Error('El código del cupón es requerido');
            }

            if (!cuponData.descuento || isNaN(cuponData.descuento) || cuponData.descuento < 0 || cuponData.descuento > 100) {
                throw new Error('El descuento debe ser un número entre 0 y 100');
            }

            // Crear el cupón en Firestore
            const cuponesDB = collection(db, 'cupones');
            const docRef = await addDoc(cuponesDB, {
                codigo: cuponData.codigo.trim(),
                descuento: parseInt(cuponData.descuento),
                fechaCreacion: new Date()
            });

            console.log('✅ Cupón creado con id:', docRef.id);

            return {
                id: docRef.id,
                codigo: cuponData.codigo.trim(),
                descuento: parseInt(cuponData.descuento),
                fechaCreacion: new Date()
            };

        } catch (error) {
            console.error('❌ Error al crear cupón:', error);
            throw error;
        }
    },

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