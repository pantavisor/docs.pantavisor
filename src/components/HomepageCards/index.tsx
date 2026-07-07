import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

type CardItem = {
  path: string;
  title: string;
  description: string;
  to: string;
  cta: string;
};

const cards: CardItem[] = [
  {
    path: '/reference/pantavisor',
    title: 'Reference',
    description:
      'Commands, schemas, and configuration keys for Pantavisor and meta-pantavisor — versioned per release.',
    to: '/reference/pantavisor',
    cta: 'Browse reference',
  },
  {
    path: '/concepts',
    title: 'Concepts',
    description:
      'How Pantavisor works — PID 1, content-addressed revisions, atomic updates, and rollback.',
    to: '/concepts',
    cta: 'Read concepts',
  },
  {
    path: '/benchmarks',
    title: 'Compare to alternatives',
    description:
      'Pantavisor against Yocto, Balena, Mender, RAUC, SWUpdate, Buildroot, and Docker.',
    to: '/benchmarks',
    cta: 'See the comparison',
  },
];

function Arrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3 8h10M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function HomepageCards(): ReactNode {
  return (
    <section className={styles.section}>
      <div className={styles.labelRow}>
        <span className={styles.label}>Quick access</span>
        <hr />
      </div>
      <div className={styles.grid}>
        {cards.map((card) => (
          <Link key={card.to} className={styles.card} to={card.to}>
            <span className={styles.path}>{card.path}</span>
            <h3>{card.title}</h3>
            <p>{card.description}</p>
            <span className={styles.arrow}>
              {card.cta} <Arrow />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
