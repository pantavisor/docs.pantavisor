import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';
import ThemedImage from '@theme/ThemedImage';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

// Illustrative excerpt of a real state.json shape — keys and truncated hash
// prefixes lifted from the worked example in
// pantavisor/docs/overview/revisions.md (#spec, the bsp/pantavisor binary,
// bsp/kernel.img, and one container's run.json + root.squashfs). The
// container is renamed from that doc's "awconnect" to the more generic
// "webserver" for a first-time visitor.
const manifestEntries: Array<[string, string]> = [
  ['#spec', 'pantavisor-service-system@1'],
  ['bsp/pantavisor', '1e6561f75c…'],
  ['bsp/kernel.img', '990f8b0fca…'],
  ['webserver/run.json', '153d58588b…'],
  ['webserver/root.squashfs', 'e1ddabe573…'],
];

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
          <Link className={styles.secondaryLink} to="/reference/pantavisor">
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
            {manifestEntries.map(([key, value], i) => (
              <div className={styles.indent} key={key}>
                <span className={styles.key}>&quot;{key}&quot;</span>:{' '}
                <span className={styles.sha}>&quot;{value}&quot;</span>
                {i < manifestEntries.length - 1 && ','}
              </div>
            ))}
            <div>{'}'}</div>
            <div className={styles.revChip}>signed · rev 028</div>
          </div>
        </div>
      </div>
    </header>
  );
}
