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
    path: '/start',
    title: 'Get Started',
    description:
      'New here? Learn the architecture, flash real hardware in 30 minutes, or migrate from Mender, RAUC, or SWUpdate.',
    to: '/start',
    cta: 'Start here',
  },
  {
    path: '/reference/pantavisor',
    title: 'Pantavisor reference',
    description:
      'Commands, schemas, and configuration keys for the on-device runtime — versioned per release.',
    to: '/reference/pantavisor',
    cta: 'Browse reference',
  },
  {
    path: '/reference/meta-pantavisor',
    title: 'meta-pantavisor reference',
    description:
      'The Yocto/OpenEmbedded layer: KAS configs, BitBake recipes, the CI pipeline, and board install guides.',
    to: '/reference/meta-pantavisor',
    cta: 'Browse reference',
  },
  {
    path: '/reference/pvr',
    title: 'pvr reference',
    description:
      'The Pantavisor command-line utility for creating, managing, and deploying containerized applications.',
    to: '/reference/pvr',
    cta: 'Browse reference',
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
