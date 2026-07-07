import type {ReactNode} from 'react';
import styles from './styles.module.css';

export default function HomepageAgentBanner({
  children,
}: {
  children: ReactNode;
}): ReactNode {
  return (
    <aside className={styles.banner}>
      <div className={styles.eyebrow}>For AI coding agents</div>
      <h2 className={styles.heading}>Or let your agent introduce you</h2>
      <p className={styles.lead}>
        Already working with an AI coding agent? Paste this prompt in and let
        it read the docs for you.
      </p>
      {children}
    </aside>
  );
}
