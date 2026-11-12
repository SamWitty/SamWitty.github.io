// Turns standard Markdown footnotes ([^1]) into sidenotes.
//
// Wide screens: each note sits in the right margin next to the line that
// references it. Narrow screens: tapping the number expands the note inline.
// No JavaScript; the toggle is a hidden checkbox.

const isElement = (node, tag) => node && node.type === 'element' && (!tag || node.tagName === tag);

function walk(node, visit, parent = null, index = null) {
  if (visit(node, parent, index) === false) return;
  if (node.children) {
    for (let i = 0; i < node.children.length; i++) walk(node.children[i], visit, node, i);
  }
}

// Footnote bodies are block content (<p>), but a sidenote lives inside a
// paragraph, so convert blocks to spans and drop the "↩" back-links.
function toInline(nodes) {
  const out = [];
  for (const node of nodes) {
    if (isElement(node, 'a') && 'dataFootnoteBackref' in node.properties) continue;
    if (node.type === 'text' && !node.value.trim() && out.length === 0) continue;
    if (isElement(node) && ['p', 'ul', 'ol', 'li', 'blockquote', 'div'].includes(node.tagName)) {
      out.push({ type: 'element', tagName: 'span', properties: { className: ['sn-block'] }, children: toInline(node.children) });
      continue;
    }
    out.push(isElement(node) && node.children ? { ...node, children: toInline(node.children) } : node);
  }
  return out;
}

export default function rehypeSidenotes() {
  return (tree) => {
    const notes = new Map();
    let section = null;

    walk(tree, (node, parent, index) => {
      if (isElement(node, 'section') && 'dataFootnotes' in node.properties) {
        section = { parent, index };
        walk(node, (li) => {
          if (isElement(li, 'li') && String(li.properties.id || '').startsWith('user-content-fn-')) {
            notes.set('#' + li.properties.id, toInline(li.children));
          }
        });
        return false;
      }
    });

    if (!section) return;
    section.parent.children.splice(section.index, 1);

    let count = 0;
    walk(tree, (node, parent, index) => {
      if (!isElement(node, 'sup')) return;
      const link = node.children.find((c) => isElement(c, 'a') && 'dataFootnoteRef' in c.properties);
      if (!link) return;
      const body = notes.get(link.properties.href);
      if (!body) return;

      count += 1;
      const id = `sn-${count}`;
      const label = String(count);

      parent.children.splice(
        index,
        1,
        {
          type: 'element',
          tagName: 'label',
          properties: { htmlFor: id, className: ['sn-ref'], ariaLabel: `Note ${label}` },
          children: [{ type: 'element', tagName: 'sup', properties: {}, children: [{ type: 'text', value: label }] }],
        },
        { type: 'element', tagName: 'input', properties: { type: 'checkbox', id, className: ['sn-toggle'] }, children: [] },
        {
          type: 'element',
          tagName: 'span',
          properties: { className: ['sidenote'], role: 'note' },
          children: [
            { type: 'element', tagName: 'span', properties: { className: ['sn-num'] }, children: [{ type: 'text', value: label + ' ' }] },
            ...structuredClone(body),
          ],
        },
      );
      return false;
    });
  };
}
