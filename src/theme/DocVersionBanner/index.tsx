import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Link from '@docusaurus/Link';
import Translate from '@docusaurus/Translate';
import {
  useActivePlugin,
  useDocVersionSuggestions,
  useVersions,
  type GlobalVersion,
} from '@docusaurus/plugin-content-docs/client';
import {ThemeClassNames} from '@docusaurus/theme-common';
import {
  useDocsPreferredVersion,
  useDocsVersion,
} from '@docusaurus/plugin-content-docs/client';
import type {Props} from '@theme/DocVersionBanner';
import type {PropVersionMetadata} from '@docusaurus/plugin-content-docs';

function getLatestStableVersion(versions: GlobalVersion[]): GlobalVersion | null {
    const stable = versions.filter((v) => !v.label.includes('rc') && v.name !== 'development');
  if (stable.length === 0) return null;
  return stable.reduce((best, v) => (v.label > best.label ? v : best));
}

function isRcVersion(label: string): boolean {
  return label.toLowerCase().includes('rc');
}

function VersionBannerContent({
  versionMetadata,
  siteTitle,
  latestStableLabel,
}: {
  versionMetadata: PropVersionMetadata;
  siteTitle: string;
  latestStableLabel: string | null;
}) {
  const label = versionMetadata.label;

  if (isRcVersion(label)) {
    return (
      <Translate
        id="theme.docs.versions.rcVersionLabel"
        description="Banner for release candidate version"
        values={{versionLabel: <b>{label}</b>, siteTitle}}>
        {'{siteTitle} {versionLabel} is a release candidate. Documentation may change before the stable release.'}
      </Translate>
    );
  }

  if (latestStableLabel && label === latestStableLabel) {
    return (
      <Translate
        id="theme.docs.versions.latestStableVersionLabel"
        description="Banner for latest stable version"
        values={{versionLabel: <b>{label}</b>, siteTitle}}>
        {'This is the documentation to the latest stable version {siteTitle} ({versionLabel}).'}
      </Translate>
    );
  }

  if (versionMetadata.version === 'development') {
    return (
      <Translate
        id="theme.docs.versions.latestDevVersionLabel"
        description="Banner for development version"
        values={{siteTitle}}>
        {'This is documentation for {siteTitle} development, which is actively in development and may contain incomplete or experimental features.'}
      </Translate>
    );
  }

  return (
    <Translate
      id="theme.docs.versions.unmaintainedVersionLabel"
      description="The label used to tell the user that he is browsing an unmaintained doc version"
      values={{siteTitle, versionLabel: <b>{label}</b>}}>
      {'This is documentation for {siteTitle} {versionLabel}, which is no longer actively maintained.'}
    </Translate>
  );
}

function LatestVersionSuggestionLabel({
  versionLabel,
  to,
  onClick,
}: {
  to: string;
  onClick: () => void;
  versionLabel: string;
}) {
  return (
    <Translate
      id="theme.docs.versions.latestVersionSuggestionLabel"
      description="The label used to tell the user to check the latest version"
      values={{
        versionLabel,
        latestVersionLink: (
          <b>
            <Link to={to} onClick={onClick}>
              <Translate
                id="theme.docs.versions.latestVersionLinkLabel"
                description="The label used for the latest version suggestion link label">
                latest version
              </Translate>
            </Link>
          </b>
        ),
      }}>
      {
        'For up-to-date documentation, see the {latestVersionLink} ({versionLabel}).'
      }
    </Translate>
  );
}

export default function DocVersionBanner({className}: Props): ReactNode {
  const versionMetadata = useDocsVersion();
  const {
    siteConfig: {title: siteTitle},
  } = useDocusaurusContext();
  const {pluginId} = useActivePlugin({failfast: true})!;

  const getVersionMainDoc = (version: GlobalVersion) =>
    version.docs.find((doc) => doc.id === version.mainDocId)!;

  const {savePreferredVersionName} = useDocsPreferredVersion(pluginId);
  const {latestDocSuggestion, latestVersionSuggestion} =
    useDocVersionSuggestions(pluginId);
  const allVersions = useVersions(pluginId);

  const latestStable = getLatestStableVersion(allVersions);
  const latestStableLabel = latestStable?.label ?? null;
  const latestStablePath = latestStable ? getVersionMainDoc(latestStable).path : '/pantavisor/overview';

  if (!versionMetadata.banner) {
    return null;
  }

  const latestVersionSuggestedDoc =
    latestDocSuggestion ?? getVersionMainDoc(latestVersionSuggestion);

  return (
    <div
      className={clsx(
        className,
        ThemeClassNames.docs.docVersionBanner,
        'alert alert--info margin-bottom--md',
      )}
      role="alert">
      <div>
        <VersionBannerContent
          versionMetadata={versionMetadata}
          siteTitle={siteTitle}
          latestStableLabel={latestStableLabel}
        />
      </div>
      <div className="margin-top--md">
        <Translate
          id="theme.docs.versions.latestVersionSuggestionLabel"
          description="The label used to tell the user to check the latest version"
          values={{
            latestVersionLink: (
              <b>
                <Link to={latestStablePath} onClick={() => latestStable && savePreferredVersionName(latestStable.name)}>
                  <Translate
                    id="theme.docs.versions.latestVersionLinkLabel"
                    description="The label used for the latest version suggestion link label">
                    check here
                  </Translate>
                </Link>
              </b>
            ),
            stableVersionLabel: latestStableLabel ?? 'latest',
          }}>
          {'For the latest stable version, {latestVersionLink} ({stableVersionLabel}).'}
        </Translate>
      </div>
    </div>
  );
}
