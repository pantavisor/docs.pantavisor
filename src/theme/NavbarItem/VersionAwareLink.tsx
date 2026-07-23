import React, {type ReactNode} from 'react';
import Link from '@docusaurus/Link';
import {useDocsPreferredVersion} from '@docusaurus/plugin-content-docs/client';

interface Props {
  to: string;
  label: string;
  position?: 'left' | 'right';
  customComponent?: string;
  [key: string]: unknown;
}

export default function VersionAwareLink({to, label, position, customComponent, ...rest}: Props): ReactNode {
  const {preferredVersion} = useDocsPreferredVersion('reference');
  const versionName = preferredVersion?.name;

  let target = to;
  if (!versionName) {
    target = `/028${to}`;
  } else if (versionName !== 'current') {
    target = `/${versionName}${to}`;
  }

  return (
    <Link className="navbar__item navbar__link" to={target} {...rest}>
      {label}
    </Link>
  );
}
