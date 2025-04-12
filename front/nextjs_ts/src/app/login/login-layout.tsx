import Header from '@/components/header/Header';
import Navigation from '@/components/navigation/Navigation';

import styles from '@/styles/plato.module.css';

export default function LoginLayout({ children }: { children: React.ReactNode }) {
    return (
      <div className={styles.container}>
          <Header />
          {children}
      </div>
    );
};