import React, {type ReactNode} from 'react';
import Link from '@docusaurus/Link';
import {useDocsPreferredVersion} from '@docusaurus/plugin-content-docs/client';

interface Props {
  to: string;
  label: string;
  position?: 'left' | 'right';
  [key: string]: unknown;
}

export default function DevelopmentNavbarLink({to, label, ...rest}: Props): ReactNode {
  const {savePreferredVersionName} = useDocsPreferredVersion('reference');

  return (
    <Link
      className="navbar__item navbar__link"
      to={to}
      onClick={() => savePreferredVersionName('development')}
      {...rest}
    >
      {label}
    </Link>
  );
}
