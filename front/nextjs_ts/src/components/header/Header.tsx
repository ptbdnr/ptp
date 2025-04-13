import Image from 'next/image';

import styles from './Header.module.css';

interface HeaderProps {
  tagline?: string;
}

export default function Header({ tagline }: HeaderProps) {
  return (
    <div className={styles.header}>
      <div className={styles.titleLine}>
        <Image
          src="logo.svg"
          alt="Logo"
          width={40}
          height={40}
          className={styles.logoImage}
        />
        <h1>PLATO</h1>
      </div>
      {tagline && <p className={styles.tagline}>{tagline}</p>}
    </div>
  );
}