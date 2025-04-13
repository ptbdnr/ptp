import Header from '@/components/header/Header';
import Navigation from '@/components/navigation/Navigation';

import styles from '@/styles/plato.module.css';

export default function HomeLayout({ children }: { children: React.ReactNode }) {
    return (
      <div className={styles.container}>
          <Header tagline="Smarter cooking starts here" />
          <main className={styles.main}>
            {children}
          </main>
          <Navigation />
      </div>
    );
};