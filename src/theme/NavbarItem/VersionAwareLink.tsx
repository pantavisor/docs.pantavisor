import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import {useLocation} from '@docusaurus/router';
import {useActiveVersion, useDocsPreferredVersion, useVersions} from '@docusaurus/plugin-content-docs/client';

interface Props {
  to: string;
  label: string;
  position?: 'left' | 'right';
  customComponent?: string;
  [key: string]: unknown;
}

// Section roots for the four left-hand navbar links, longest first so the
// most specific one wins: /meta-pantavisor/getting-started/* must highlight
// "Getting Started" and NOT also "meta-pantavisor", which owns the rest of
// /meta-pantavisor/*. Keep in sync with the `to` targets in the navbar
// `items` config (docusaurus.config.ts).
const SECTION_ROOTS = [
  '/meta-pantavisor/getting-started',
  '/meta-pantavisor',
  '/pantavisor',
  '/pvr',
].sort((a, b) => b.length - a.length);

function isUnder(pathname: string, root: string): boolean {
  return pathname === root || pathname.startsWith(`${root}/`);
}

export default function VersionAwareLink({to, label, position, customComponent, ...rest}: Props): ReactNode {
  // useDocsPreferredVersion only reflects an explicit choice (the Versions
  // dropdown, or the "latest version" link in the outdated-version banner) —
  // it does NOT update just from browsing pages of another version. Without
  // useActiveVersion, a reader who navigated straight to e.g. /development/pvr
  // (no explicit version pick) would have every other navbar link silently
  // fall back to the stable version instead of following /development.
  const activeVersion = useActiveVersion('reference');
  const {preferredVersion} = useDocsPreferredVersion('reference');
  const versions = useVersions('reference');
  // Priority: the version of the page currently being viewed > the reader's
  // last explicit choice > the configured lastVersion (path: '/'). Versions
  // carry their own real `path` (e.g. '/', '/development', `/${releases.current}`)
  // — respect it instead of assuming every version is prefixed by its own name.
  const version = activeVersion ?? preferredVersion ?? versions.find((v) => v.isLast);
  const prefix = version && version.path !== '/' ? version.path : '';
  const target = `${prefix}${to}`;

  // Bold the link whose section contains the page being viewed, so the navbar
  // shows which area of the docs the reader is in. Strip the version prefix
  // first so matching works on every version, then take the most specific
  // section root that both this link and the current page fall under.
  const {pathname} = useLocation();
  const unprefixed = prefix && pathname.startsWith(prefix) ? pathname.slice(prefix.length) || '/' : pathname;
  const thisRoot = SECTION_ROOTS.find((root) => isUnder(to, root));
  const activeRoot = SECTION_ROOTS.find((root) => isUnder(unprefixed, root));
  const isActive = thisRoot !== undefined && thisRoot === activeRoot;

  return (
    <Link
      className={clsx('navbar__item navbar__link', isActive && 'navbar__link--active')}
      to={target}
      {...rest}>
      {label}
    </Link>
  );
}
