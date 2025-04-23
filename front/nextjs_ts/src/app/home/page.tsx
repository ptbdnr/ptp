'use client';

import { useRouter } from 'next/navigation';

import HomeLayout from './home-layout';

import YouTube, { YouTubeProps } from 'react-youtube';

import styles from './home.module.css';

export default function Page() {
  const router = useRouter();

  const onPlayerReady: YouTubeProps['onReady'] = (event) => {
    // access to player in all event handlers via event.target
    event.target.pauseVideo();
  }

  const opts: YouTubeProps['opts'] = {
    // height: '390',
    width: '100%',
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
    },
  };


  return (
    <HomeLayout>
      <button 
        onClick={() => router.push('/profile')} 
        className={styles.button}
      >
        <h3>Smarter Cooking Starts Here</h3>
      </button>

      <div className={styles.video} >
        ... or watch the video before you go
        <YouTube videoId="B5o5uPj2KiY" opts={opts} onReady={onPlayerReady} />
        not loading? <a href="https://www.youtube.com/watch?v=B5o5uPj2KiY&feature=youtu.be" target='_blank'>click here</a>
      </div>
      </HomeLayout>
    );
}