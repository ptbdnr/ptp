'use client';

import { useRouter } from 'next/navigation';

import Head from "next/head";
import styles from "../styles/landing.module.css";


export default function Page() {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <Head>
        <title>Plato</title>
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Plato
        </h1>

        <p className={styles.description}>
          Plato is a multi-modal AI application that transforms the way you approach home cooking. By accepting inputs in various formats (text, speech, images, and videos), it provides personalized recipe recommendations tailored to your specific dietary needs, available ingredients, kitchen tools, and meal plans.
        </p>
        <p className={styles.description}>
          Developed during a 2-week <a href="https://www.kxsb.org/lpb25" target="_blank">hackathon</a> to bring AI innovation into your kitchen.
        </p>
        
        <div className={styles.grid}>
          <a href="https://github.com/ptbdnr/ptp" 
            target="_blank" 
            className={styles.card}
          >
            <h3>Documentation &rarr;</h3>
            <p>Find more documentation and learn about the project.</p>
          </a>

          <div
            onClick={() => {router.push('/login')}}
            className={styles.card}
          >
            <h3>Try it &rarr;</h3>
            <p>Discover and cook something delicious.</p>
          </div>

        </div>
      </main>

      <footer className={styles.footer}>
        Made with ❤️ by Team Picture-to-Palatable
      </footer>
    </div>
  );
}
