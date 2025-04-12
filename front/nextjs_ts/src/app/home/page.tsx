import HomeLayout from './home-layout';

import styles from './home.module.css';

export default function Page() {
    return (
        <HomeLayout>
            <main className={styles.main}>
                home
            </main>
        </HomeLayout>
    );
}