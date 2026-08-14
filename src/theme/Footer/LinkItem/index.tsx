import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import isInternalUrl from '@docusaurus/isInternalUrl';
import IconExternalLink from '@theme/Icon/ExternalLink';
import {useActiveVersion, useDocsPreferredVersion, useVersions} from '@docusaurus/plugin-content-docs/client';
import type {Props} from '@theme/Footer/LinkItem';

// Docs footer links (`to`) should follow whichever version the reader is
// currently browsing, the same way the navbar's VersionAwareLink items do.
// useDocsPreferredVersion alone only reflects an explicit choice (Versions
// dropdown or the outdated-version banner's "latest version" link) — it
// does not update just from browsing another version's pages, so it must
// be paired with useActiveVersion (derived from the current route).
export default function FooterLinkItem({item}: Props): ReactNode {
  const {to, href, label, prependBaseUrlToHref, className, ...props} = item;

  const activeVersion = useActiveVersion('reference');
  const {preferredVersion} = useDocsPreferredVersion('reference');
  const versions = useVersions('reference');
  const version = activeVersion ?? preferredVersion ?? versions.find((v) => v.isLast);
  const versionPrefix = version && version.path !== '/' ? version.path : '';

  const toUrl = useBaseUrl(to ? `${versionPrefix}${to}` : to);
  const normalizedHref = useBaseUrl(href, {forcePrependBaseUrl: true});

  return (
    <Link
      className={clsx('footer__link-item', className)}
      {...(href
        ? {
            href: prependBaseUrlToHref ? normalizedHref : href,
          }
        : {
            to: toUrl,
          })}
      {...props}>
      {label}
      {href && !isInternalUrl(href) && <IconExternalLink />}
    </Link>
  );
}
