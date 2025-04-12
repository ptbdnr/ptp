import Header from '@/components/header/Header';
import Navigation from '@/components/navigation/Navigation';

import styles from '@/styles/plato.module.css';

export default function HomeLayout({ children }: { children: React.ReactNode }) {
    return (
      <div className={styles.container}>
          {children}
          <Navigation />
      </div>
    );
};