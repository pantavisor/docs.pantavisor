import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';
import ThemedImage from '@theme/ThemedImage';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

export default function HomepageHero(): ReactNode {
  return (
    <header className={styles.hero}>
      <div className={styles.copy}>
        <div className={styles.eyebrow}>Embedded Linux runtime</div>
        <Heading as="h1" className={styles.headline}>
          Pantavisor is <span className={styles.accent}>PID 1</span> — and it
          owns the whole device update.
        </Heading>
        <p className={styles.subhead}>
          Base, kernel, app containers, and config ship as one signed,
          content-addressed revision. No image updater bolted on top — this{' '}
          <em>is</em> the runtime.
        </p>
        <div className={styles.ctas}>
          <Link className={styles.primaryButton} to="/start">
            Quick start
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M3 8h10M9 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
          <Link className={styles.secondaryLink} to="/reference">
            or browse the reference docs
          </Link>
        </div>
      </div>

      <div className={styles.manifestFrame}>
        <ThemedImage
          className={styles.logoGhost}
          alt=""
          role="presentation"
          sources={{
            light: useBaseUrl('images/logo-icon.svg'),
            dark: useBaseUrl('images/logo-icon-white.svg'),
          }}
        />
        <div className={styles.manifest}>
          <div className={styles.manifestTitlebar}>
            <span>state.json</span>
            <span className={styles.manifestDots}>
              <span />
              <span />
              <span />
            </span>
          </div>
          <div className={styles.manifestBody}>
            <div>{'{'}</div>
            <div className={styles.indent}>
              <span className={styles.key}>&quot;bsp/run.json&quot;</span>:{' '}
              <span className={styles.sha}>&quot;a3f9c1e…&quot;</span>,
            </div>
            <div className={styles.indent}>
              <span className={styles.key}>&quot;app/run.json&quot;</span>:{' '}
              <span className={styles.sha}>&quot;7be402d…&quot;</span>,
            </div>
            <div className={styles.indent}>
              <span className={styles.key}>&quot;device.json&quot;</span>:{' '}
              <span className={styles.sha}>&quot;51c0aa8…&quot;</span>
            </div>
            <div>{'}'}</div>
            <div className={styles.revChip}>signed · rev 028</div>
          </div>
        </div>
      </div>
    </header>
  );
}
