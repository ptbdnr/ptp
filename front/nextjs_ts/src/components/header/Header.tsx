import Image from 'next/image';

import { CircleUser, EllipsisVertical } from 'lucide-react';

import styles from './Header.module.css';

interface HeaderProps {
  tagline?: string;
}

export default function Header({ tagline }: HeaderProps) {
  return (
    <div className={styles.header}>
      <div className={styles.titleLine}>
        <div className={styles.logoContainer}>
        <Image
          src="/logo.svg"
          alt="Logo"
          width={40}
          height={40}
          className={styles.logoImage}
        />
        <h1>PLATO</h1>
        </div>
        <div className={styles.iconsContainer}>
          <CircleUser size={40} className={styles.userIcon} />
          <EllipsisVertical size={40} className={styles.menuIcon} />
        </div>
      </div>
      {tagline && <p className={styles.tagline}>{tagline}</p>}
    </div>
  );
}