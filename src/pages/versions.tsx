import type {ReactNode} from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';
import {useVersions} from '@docusaurus/plugin-content-docs/client';
import type {GlobalVersion} from '@docusaurus/plugin-content-docs/client';
import styles from './versions.module.css';

function versionHref(version: GlobalVersion): string {
  const mainDoc = version.docs.find((doc) => doc.id === version.mainDocId);
  return mainDoc?.path ?? version.path;
}

function VersionRow({version}: {version: GlobalVersion}): ReactNode {
  return (
    <li className={styles.row}>
      <Link className={styles.rowLink} to={versionHref(version)}>
        {version.label}
      </Link>
    </li>
  );
}

export default function VersionsPage(): ReactNode {
  const versions = useVersions('reference');
  const master = versions.find((v) => v.name === 'development');
  const stable = versions.filter(
    (v) => v.name !== 'development' && !v.name.includes('rc'),
  );
  const others = versions.filter(
    (v) => v.name !== 'development' && v.name.includes('rc'),
  );

  return (
    <Layout
      title="Versions"
      description="All published versions of the Pantavisor documentation: master, stable releases, and release candidates.">
      <main className={styles.main}>
        <Heading as="h1">Versions</Heading>
        <p className={styles.intro}>Every published copy of these docs.</p>

        {master && (
          <section className={styles.section}>
            <Heading as="h2" className={styles.sectionTitle}>
              Master
            </Heading>
            <ul className={styles.list}>
              <VersionRow version={master} />
            </ul>
          </section>
        )}

        <section className={styles.section}>
          <Heading as="h2" className={styles.sectionTitle}>
            Stable
          </Heading>
          <ul className={styles.list}>
            {stable.map((version) => (
              <VersionRow key={version.name} version={version} />
            ))}
          </ul>
        </section>

        {others.length > 0 && (
          <section className={styles.section}>
            <Heading as="h2" className={styles.sectionTitle}>
              Others
            </Heading>
            <ul className={styles.list}>
              {others.map((version) => (
                <VersionRow key={version.name} version={version} />
              ))}
            </ul>
          </section>
        )}
      </main>
    </Layout>
  );
}
