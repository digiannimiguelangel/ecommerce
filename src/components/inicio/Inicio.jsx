import styles from './Inicio.module.css';
import { useGetProductosOferta } from './useGetProductosOferta';
import TarjetaProducto from '../producto/TarjetaProducto';

function Inicio() {

    const { productos: productosEnOferta, cargando: productosLoading, error: productosError } = useGetProductosOferta();

    return (
        <div className={styles.home}>
            <section className={styles.hero}>
                <div className={styles.heroCopy}>
                    <span className={styles.eyebrow}>
                        <span aria-hidden="true">🐾</span> TODO PARA QUIEN TE ESPERA EN CASA
                    </span>
                    <h1>Su felicidad también es <span>la nuestra.</span></h1>
                    <p>
                        Encontrá comida, juguetes y esos pequeños mimos que hacen
                        que cada día con tu mascota sea especial.
                    </p>
                </div>
                <div className={styles.heroVisual}>
                    <div className={styles.heroBlob} />
                    <img
                        className={styles.heroImage}
                        src="https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=1000&q=85"
                        alt="Perro disfrutando de un día al aire libre"
                    />
                    <div className={styles.floatingNote}>
                        <span className={styles.heart} aria-hidden="true">♥</span>
                        <span><strong>Mucho amor</strong><br />en cada pedido</span>
                    </div>
                    <span className={styles.sparkle} aria-hidden="true">✦</span>
                    <span className={styles.pawPrint} aria-hidden="true">🐾</span>
                </div>
            </section>

            <section className={styles.offers}>
                <div className={styles.sectionHeading}>
                    <div>
                        <span className={styles.sectionEyebrow}>ESPECIAL PARA TI</span>
                        <h2>Productos en Oferta</h2>
                    </div>
                </div>
                {productosLoading ? (
                    <div className={styles.loadingMessage} role="status" aria-live="polite">
                        <p>Cargando ofertas...</p>
                    </div>
                ) : (
                    <div className={styles.productGrid}>
                        {productosEnOferta.length > 0 ? (
                            productosEnOferta.map((producto) => (
                                <TarjetaProducto
                                    key={producto.id}
                                    id={producto.id}
                                    nombre={producto.nombre}
                                    precio={producto.precio}
                                    stock={producto.stock}
                                    image={producto.image}
                                    categoria={producto.categoria}
                                />
                            ))
                        ) : (
                            <p className={styles.noProducts}>No hay productos en oferta en este momento.</p>
                        )}
                    </div>
                )}
            </section>

        </div>
    );
}

export default Inicio;
