import { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs, doc, deleteDoc, updateDoc, getDoc } from 'firebase/firestore';
import { FormularioContainer } from '../formulario/FormularioContainer';
import { productoService } from '../../service/productoService';
import GestionList from './GestionList';

function Gestion() {

    const [productos, setProductos] = useState([]);
    const [productoEditar, setProductoEditar] = useState(null);

    useEffect(() => {
        const fetchProductos = async () => {
            const productos = await productoService.obtenerProductos();
            setProductos(productos);
        };
        fetchProductos();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
            try {
                const db = getFirestore();
                const docRef = doc(db, 'productos', id);
                
                console.log("🔍 Obteniendo producto para eliminar...");
                // Obtener el producto directamente de Firestore para asegurar que tenemos el delete_hash
                const productoDocSnap = await getDoc(docRef);
                
                if (productoDocSnap.exists()) {
                    const producto = productoDocSnap.data();
                    console.log("📦 Producto encontrado:", producto);
                    console.log("🏷 Delete hash:", producto.imageDeleteHash);
                    
                    // Si existe delete_hash, eliminar la imagen de imgbb primero
                    if (producto && producto.imageDeleteHash) {
                        console.log("🗑 Iniciando eliminación de imagen de imgbb...");
                        await eliminarImagenDeImgbb(producto.imageDeleteHash);
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
                alert('Producto eliminado correctamente');
                
                // Actualizar la lista localmente
                setProductos(productos.filter(prod => prod.id !== id));
            } catch (error) {
                console.error('❌ Error al eliminar:', error);
                alert('Error al eliminar el producto: ' + error.message);
            }
        }
    };

    const eliminarImagenDeImgbb = async (deleteHash) => {
        try {
            if (!deleteHash) {
                console.warn('⚠ No hay delete_hash disponible para eliminar la imagen');
                return;
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
            } else {
                console.warn('❌ No se pudo eliminar la imagen de imgbb:', resultado);
                if (resultado.error) {
                    console.warn('Error detallado:', resultado.error);
                }
            }
        } catch (error) {
            console.error('❌ Error al eliminar imagen de imgbb:', error);
        }
    };

    const handleEditar = (producto) => {
        setProductoEditar(producto);
    };

    const actualizarProductos = async () => {
        const productos = await productoService.obtenerProductos();
        setProductos(productos);
    };

    return (
        <div>
            <FormularioContainer onProductoCreado={actualizarProductos} />
            <GestionList productos={productos} handleDelete={handleDelete} handleEditar={handleEditar} />
        </div>
    );
}

export default Gestion;