import { Meal } from '@/types/meals';

import Image from 'next/image';
// import Autoplay from 'embla-carousel-autoplay'
// import useEmblaCarousel from 'embla-carousel-react'

import styles from './MealDetailsHero.module.css';

export default function MealDetailsHero({meal}: {meal: Meal}) {
  // const [emblaRef] = useEmblaCarousel()

  return (
    <div className={styles.heroCarousel}>
      <section className="embla">
        {/* <div className="embla__viewport" ref={emblaRef}> */}
          {/* <div className={`embla__container`}> */}
            <div className="embla__slide" key={'hero-img-1'}>
              <Image 
                src={meal.images.hero_url || "/placeholder_meal-hero_16x4.jpg"}
                alt={meal.name}
                fill
                className={styles.heroImage}
              />
            </div>
            {/* <div className={`${styles.heroVideo} embla__slide`} key={'hero-vid-1'}>
              <video 
                width="100%" 
                height="100%" 
                controls 
                autoPlay 
                preload="auto"
                src={meal.videos?.hero_url || "/placeholder_meal-hero_16x4.mp4"}
                playsInline
              />
            </div> */}
            {/* <div className="embla__slide" key={'hero-img-2'}>
              <Image 
                src={"/placeholder_meal-hero_16x4.jpg"}
                alt={meal.name}
                fill
                className={styles.heroImage}
              />
            </div> */}
          {/* </div> */}
        {/* </div> */}
      </section>
    </div>
  );
}