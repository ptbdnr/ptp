'use client';

import { useRouter } from 'next/navigation';

import HomeLayout from './home-layout';

import styles from './home.module.css';

const VIDEO_URL = 'https://ams1.vultrobjects.com/ptpbcktdist01/ptplatest.mp4';

export default function Page() {
  const router = useRouter();

    return (
    <HomeLayout>
        <div className={styles.video} >
          <video 
            controls
          >
            <source src={VIDEO_URL} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        <button 
          onClick={() => router.push('/profile')} 
          className={styles.button}
        >
          <h3>Smarter Cooking Starts Here</h3>
        </button>
    </HomeLayout>
    );
}