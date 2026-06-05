import {visit} from 'unist-util-visit';

// Maps MkDocs Material icon names to MDI CSS class names (they match 1:1)
const PATTERN = /:material-([a-z][a-z0-9-]*):/g;

export default function rehypeMaterialIcons() {
  return (tree) => {
    visit(tree, 'text', (node, index, parent) => {
      if (!PATTERN.test(node.value)) return;
      PATTERN.lastIndex = 0;

      const parts = [];
      let lastIndex = 0;
      let match;

      while ((match = PATTERN.exec(node.value)) !== null) {
        if (match.index > lastIndex) {
          parts.push({type: 'text', value: node.value.slice(lastIndex, match.index)});
        }
        parts.push({
          type: 'element',
          tagName: 'span',
          properties: {
            className: ['mdi', `mdi-${match[1]}`],
            ariaHidden: 'true',
          },
          children: [],
        });
        lastIndex = PATTERN.lastIndex;
      }

      if (lastIndex < node.value.length) {
        parts.push({type: 'text', value: node.value.slice(lastIndex)});
      }

      if (parts.length > 1 || parts[0]?.type !== 'text') {
        parent.children.splice(index, 1, ...parts);
        return [visit.SKIP, index + parts.length];
      }
    });
  };
}
