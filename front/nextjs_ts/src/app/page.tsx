'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';

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
        <div>
          <h1 className={styles.title}>
            Plato
          </h1>
          <p className={styles.description}>
            Smarter cooking starts here
          </p>
        </div>

        
        <div className={styles.grid}>
          <div
            onClick={() => {router.push('/login')}}
            className={styles.card}
          >
            <h3>Try it &rarr;</h3>
            <p>Discover and cook something delicious.</p>
          </div>
          <a href="https://github.com/ptbdnr/ptp" 
            target="_blank" 
            className={styles.card}
          >
            <h3>Documentation &rarr;</h3>
            <p>Find more documentation and learn about the project.</p>
          </a>
        </div>

        <div>
          <p className={styles.description}>
            Plato is a multi-modal AI application that transforms the way you approach home cooking.
            By accepting inputs in various formats (text, speech, images, and videos), 
            it provides personalized recipe recommendations tailored 
            to your specific dietary needs, available ingredients, kitchen tools, and meal plans.
          </p>
        </div>

        <div>
          <div>
            <h2 className={styles.subtitle}>
              Developed during
            </h2>
            <div className={styles.kxsbGrid}>
              <div className={styles.kxsbFull}>
                The Ultimate, Multi-modal, AI Acceleration Event
              </div>
              <div className={styles.kxsbShort}>
              <a href="https://www.kxsb.org/lpb25" target="_blank">LPB 25</a>
              </div>              
            </div>
            {/* <p className={styles.code}>
              <a href="https://www.kxsb.org/lpb25" target="_blank">KXSB London, Paris, Berlin AI HackXelerator™</a> 
            </p> */}
          </div>
          
          <div className={styles.sponsors}>
            <h2 className={styles.subtitle}>
              Sponsors
            </h2>
            <div className={styles.grid}>
              <div className={styles.card}>
                <a href="https://www.vultr.com" target="_blank" rel="noopener">
                  <Image src="logos/vultr.svg" alt="Vultr" width={120} height={120}/>
                </a>
              </div>
              <div className={styles.card}>
                <a href="https://www.amd.com" target="_blank" rel="noopener">
                  <Image src="logos/AMD.svg" alt="AMD" width={120} height={120}/>
                </a>
              </div>
              <div className={styles.card}>
                <a href="https://www.pinecone.io" target="_blank" rel="noopener">
                  <Image src="logos/pinecone.svg" alt="Pinecone" width={120} height={120}/>
                </a>
              </div>
              <div className={styles.card}>
                <a href="https://huggingface.co/" target="_blank" rel="noopener">
                  <Image src="logos/hf.svg" alt="Huggingface" width={120} height={120}/>
                </a>
              </div>
              <div className={styles.card}>
                <a href="https://mistral.ai/" target="_blank" rel="noopener">
                  <Image src="logos/mistral.svg" alt="Mistral AI" width={120} height={120}/>
                </a>
              </div>
              <div className={styles.card}>
                <a href="https://lumalabs.ai" target="_blank" rel="noopener">
                  <Image src="logos/lumalabs.svg" alt="Luma Labs" width={120} height={120}/>
                </a>
              </div>
              {/* <div className={styles.card}>
                <a href="https://www.twelvelabs.io/" target="_blank" rel="noopener">
                  <Image src="logos/twelvelabs.webp" alt="Twelve Labs" width={120} height={120}/>
                </a>
              </div> */}
            </div>
          </div>
        </div>

      </main>

      <footer className={styles.footer}>
        Made with ❤️ by Team Picture-to-Palatable
      </footer>
    </div>
  );
}
