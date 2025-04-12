import Navigation from '@/components/navigation/Navigation';
import styles from './recipe_discovery.module.css';

export default function RecipeDiscoveryLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.logo}>Plato</h1>
            </div>
            {children}
            <Navigation />
        </div>
    );
};