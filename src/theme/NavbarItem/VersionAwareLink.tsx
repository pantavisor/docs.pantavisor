import React, {type ReactNode} from 'react';
import Link from '@docusaurus/Link';
import {useActiveVersion, useDocsPreferredVersion, useVersions} from '@docusaurus/plugin-content-docs/client';

interface Props {
  to: string;
  label: string;
  position?: 'left' | 'right';
  customComponent?: string;
  [key: string]: unknown;
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

  return (
    <Link className="navbar__item navbar__link" to={target} {...rest}>
      {label}
    </Link>
  );
}
