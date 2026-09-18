'use client';

import styles from '../styles.module.css';

export default function CodeLogo() {
  return <span className={styles.codeLogo} aria-label="Own Blog code logo"><span className={styles.logoBracket}>{'<'}</span><span className={styles.logoSlash}>/</span><span className={styles.logoBracket}>{'>'}</span><i /></span>;
}
