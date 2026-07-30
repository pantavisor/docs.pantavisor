import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import isInternalUrl from '@docusaurus/isInternalUrl';
import IconExternalLink from '@theme/Icon/ExternalLink';
import {useDocsPreferredVersion, useVersions} from '@docusaurus/plugin-content-docs/client';
import type {Props} from '@theme/Footer/LinkItem';

// Docs footer links (`to`) should follow the version picked under
// "Stable"/"Unstable", the same way the navbar's VersionAwareLink items do.
export default function FooterLinkItem({item}: Props): ReactNode {
  const {to, href, label, prependBaseUrlToHref, className, ...props} = item;

  const {preferredVersion} = useDocsPreferredVersion('reference');
  const versions = useVersions('reference');
  const activeVersion = preferredVersion ?? versions.find((v) => v.isLast);
  const versionPrefix = activeVersion && activeVersion.path !== '/' ? activeVersion.path : '';

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
