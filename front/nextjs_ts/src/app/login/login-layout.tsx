import Header from '@/components/header/Header';

import styles from '@/styles/plato.module.css';

export default function LoginLayout({ children }: { children: React.ReactNode }) {
    return (
      <div className={styles.container}>
          <Header tagline="Smarter cooking starts here" showAvatar={false}/>
          <main className={styles.main}>
            {children}
          </main>
      </div>
    );
};