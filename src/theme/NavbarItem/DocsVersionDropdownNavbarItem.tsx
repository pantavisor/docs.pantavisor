import React, {type ReactNode} from 'react';
import {
  useVersions,
  useActiveDocContext,
  useDocsVersionCandidates,
  useDocsPreferredVersion,
} from '@docusaurus/plugin-content-docs/client';
import {translate} from '@docusaurus/Translate';
import {useHistorySelector} from '@docusaurus/theme-common';
import DefaultNavbarItem from '@theme/NavbarItem/DefaultNavbarItem';
import DropdownNavbarItem from '@theme/NavbarItem/DropdownNavbarItem';
import type {
  Props,
  PropVersions,
  PropVersionItem,
} from '@theme/NavbarItem/DocsVersionDropdownNavbarItem';
import type {LinkLikeNavbarItemProps} from '@theme/NavbarItem';
import type {
  GlobalVersion,
  GlobalDoc,
  ActiveDocContext,
} from '@docusaurus/plugin-content-docs/client';

type VersionItem = {
  version: GlobalVersion;
  label: string;
};

function getVersionItems(
  versions: GlobalVersion[],
  configs?: PropVersions,
): VersionItem[] {
  if (configs) {
    // Explicit configs name exactly which versions to show (e.g. the Unstable
    // dropdown deliberately includes 'development') — no implicit filtering.
    const versionMap = new Map<string, GlobalVersion>(
      versions.map((version) => [version.name, version]),
    );

    const toVersionItem = (
      name: string,
      config?: PropVersionItem,
    ): VersionItem => {
      const version = versionMap.get(name);
      if (!version) {
        throw new Error(`No docs version exist for name '${name}', please verify your 'docsVersionDropdown' navbar item versions config.
Available version names:\n- ${versions.map((v) => `${v.name}`).join('\n- ')}`);
      }
      return {version, label: config?.label ?? version.label};
    };

    if (Array.isArray(configs)) {
      return configs.map((name) => toVersionItem(name, undefined));
    } else {
      return Object.entries(configs).map(([name, config]) =>
        toVersionItem(name, config),
      );
    }
  } else {
    // No explicit configs (unused by this site today, both navbar dropdowns
    // always pass one) — fall back to every version except 'development',
    // which should only ever appear where explicitly requested.
    return versions
      .filter((v) => v.name !== 'development')
      .map((version) => ({version, label: version.label}));
  }
}

function useVersionItems({
  docsPluginId,
  configs,
}: {
  docsPluginId: Props['docsPluginId'];
  configs: Props['versions'];
}): VersionItem[] {
  const versions = useVersions(docsPluginId);
  const {activeVersion} = useActiveDocContext(docsPluginId);
  const items = getVersionItems(versions, configs);

  // If the version currently being browsed isn't one of the default dropdown
  // entries (e.g. an RC or old release reached via the "Others" page), surface
  // it in the dropdown for as long as it's the active version. It drops back
  // out on its own once the user switches to another version, since this
  // recomputes from the active version on every render.
  if (activeVersion && !items.some((vi) => vi.version === activeVersion)) {
    items.push({version: activeVersion, label: activeVersion.label});
  }

  return items;
}

function getVersionMainDoc(version: GlobalVersion): GlobalDoc {
  return version.docs.find((doc) => doc.id === version.mainDocId)!;
}

function getVersionTargetDoc(
  version: GlobalVersion,
  activeDocContext: ActiveDocContext,
): GlobalDoc {
  return (
    activeDocContext.alternateDocVersions[version.name] ??
    getVersionMainDoc(version)
  );
}

function useDisplayedVersionItem({
  docsPluginId,
  versionItems,
}: {
  docsPluginId: Props['docsPluginId'];
  versionItems: VersionItem[];
}): VersionItem {
  const candidates = useDocsVersionCandidates(docsPluginId);
  const candidateItems = candidates
    .map((candidate) => versionItems.find((vi) => vi.version === candidate))
    .filter((vi) => vi !== undefined);
  return candidateItems[0] ?? versionItems[0]!;
}

export default function DocsVersionDropdownNavbarItem({
  mobile,
  docsPluginId,
  dropdownActiveClassDisabled,
  dropdownItemsBefore,
  dropdownItemsAfter,
  versions: configs,
  label: customLabel,
  ...props
}: Props & {label?: string}): ReactNode {
  const search = useHistorySelector((history) => history.location.search);
  const hash = useHistorySelector((history) => history.location.hash);
  const activeDocContext = useActiveDocContext(docsPluginId);
  const {savePreferredVersionName} = useDocsPreferredVersion(docsPluginId);
  const versionItems = useVersionItems({docsPluginId, configs});

  if (versionItems.length === 0) {
    return null;
  }

  const displayedVersionItem = useDisplayedVersionItem({
    docsPluginId,
    versionItems,
  });

  function versionItemToLink({
    version,
    label,
  }: VersionItem): LinkLikeNavbarItemProps {
    const targetDoc = getVersionTargetDoc(version, activeDocContext);
    const isActive = version === activeDocContext.activeVersion;
    return {
      // Bold the version currently being browsed so it stands out in the list.
      label: isActive ? <strong>{label}</strong> : label,
      to: `${targetDoc.path}${search}${hash}`,
      isActive: () => isActive,
      onClick: () => savePreferredVersionName(version.name),
    };
  }

  const items: LinkLikeNavbarItemProps[] = [
    ...dropdownItemsBefore,
    ...versionItems.map(versionItemToLink),
    ...dropdownItemsAfter,
  ];

  const dropdownLabel =
    mobile && items.length > 1
      ? translate({
          id: 'theme.navbar.mobileVersionsDropdown.label',
          message: 'Versions',
          description:
            'The label for the navbar versions dropdown on mobile view',
        })
      : customLabel ?? displayedVersionItem.label;

  const dropdownTo =
    mobile && items.length > 1
      ? undefined
      : getVersionTargetDoc(displayedVersionItem.version, activeDocContext)
          .path;

  // When a custom label is provided (e.g. "Stable", "RC"), always show as a
  // dropdown even with a single item, so the user sees the version name inside.
  if (!customLabel && items.length <= 1) {
    return (
      <DefaultNavbarItem
        {...props}
        mobile={mobile}
        label={dropdownLabel}
        to={dropdownTo}
        isActive={dropdownActiveClassDisabled ? () => false : undefined}
      />
    );
  }

  return (
    <DropdownNavbarItem
      {...props}
      mobile={mobile}
      label={dropdownLabel}
      to={dropdownTo}
      items={items}
      isActive={dropdownActiveClassDisabled ? () => false : undefined}
    />
  );
}
