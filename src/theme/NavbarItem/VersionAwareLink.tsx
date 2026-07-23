import React, {type ReactNode} from 'react';
import Link from '@docusaurus/Link';
import {useDocsPreferredVersion, useVersions} from '@docusaurus/plugin-content-docs/client';

interface Props {
  to: string;
  label: string;
  position?: 'left' | 'right';
  customComponent?: string;
  [key: string]: unknown;
}

export default function VersionAwareLink({to, label, position, customComponent, ...rest}: Props): ReactNode {
  const {preferredVersion} = useDocsPreferredVersion('reference');
  const versions = useVersions('reference');
  // Fall back to the configured lastVersion (path: '/') when no version has
  // been picked yet in this session. Versions carry their own real `path`
  // (e.g. '/', '/development', `/${releases.current}`) — respect it instead
  // of assuming every version is prefixed by its own name.
  const activeVersion = preferredVersion ?? versions.find((v) => v.isLast);
  const prefix = activeVersion && activeVersion.path !== '/' ? activeVersion.path : '';
  const target = `${prefix}${to}`;

  return (
    <Link className="navbar__item navbar__link" to={target} {...rest}>
      {label}
    </Link>
  );
}
