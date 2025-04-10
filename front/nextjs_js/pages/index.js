import Head from "next/head";
import styles from "../styles/Home.module.css";

export default function Home() {
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
          <br></br>
          Developed during a 2-week hackathon to bring AI innovation into your kitchen.
          <br></br>
          Hackaton: <a href="https://www.kxsb.org/lpb25" target="_blank">The Ultimate, Multi-modal, AI Acceleration Event LPB 25</a>
        </p>

        <div className={styles.grid}>
          <a href="https://nextjs.org/docs" className={styles.card}>
            <h3>Documentation &rarr;</h3>
            <p>Find <a href="https://github.com/ptbdnr/ptp" target="_blank">ptp</a> documentation and learn about the project.</p>
          </a>

          <a
            href="https://github.com/vercel/next.js/tree/canary/examples"
            className={styles.card}
          >
            <h3>NextJS Examples &rarr;</h3>
            <p>Discover and deploy boilerplate example Next.js projects.</p>
          </a>

        </div>
      </main>

      <footer className={styles.footer}>
        Made with ❤️ by Team Picture-to-Palatable
      </footer>
    </div>
  );
}
