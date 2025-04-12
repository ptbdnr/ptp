import Header from '@/components/header/Header';
import Navigation from '@/components/navigation/Navigation';
import styles from './recipe-discovery.module.css';

export default function RecipeDiscoveryLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className={styles.container}>
            <Header />
            {children}
            <Navigation />
        </div>
    );
};