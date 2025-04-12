import Header from '@/components/header/Header';
import Navigation from '@/components/navigation/Navigation';

import styles from './meal-plan.module.css';

export default function MealPlanLayout({ children }: { children: React.ReactNode }) {
    return (
      <div className={styles.container}>
          <Header />
          {children}
          <Navigation />
      </div>
    );
};