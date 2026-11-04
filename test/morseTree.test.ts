import { describe, it, expect } from 'vitest';
import { MORSE_TREE_NODES, getTreePath, getTreeNode, isInTree, getParentPosition, ROOT_POSITION } from '../src/data/morseTree';
import { ALPHABET_MORSE } from '../src/data/morseData';

describe('Morse Tree Board layout', () => {
  it('contains exactly the 26 letters with codes matching ALPHABET_MORSE', () => {
    expect(MORSE_TREE_NODES).toHaveLength(26);
    for (const item of ALPHABET_MORSE) {
      expect(getTreeNode(item.code)?.char).toBe(item.char);
    }
  });

  it('every node has a parent in the tree (or the root)', () => {
    for (const node of MORSE_TREE_NODES) {
      const parentCode = node.code.slice(0, -1);
      if (parentCode === '') {
        expect(getParentPosition(node.code)).toEqual(ROOT_POSITION);
      } else {
        expect(getTreeNode(parentCode)).toBeDefined();
      }
    }
  });

  it('draws every branch as a straight horizontal or vertical line', () => {
    for (const node of MORSE_TREE_NODES) {
      const parent = getParentPosition(node.code);
      expect(parent.x === node.x || parent.y === node.y).toBe(true);
    }
  });

  it('has no overlapping node positions', () => {
    const positions = new Set(MORSE_TREE_NODES.map(n => `${n.x},${n.y}`));
    expect(positions.size).toBe(MORSE_TREE_NODES.length);
  });

  it('follows E -> A -> R for dit, dah, dit', () => {
    expect(getTreePath('.-.')).toEqual(['.', '.-', '.-.']);
    expect(getTreePath('.-.').map(c => getTreeNode(c)?.char)).toEqual(['E', 'A', 'R']);
  });

  it('treats codes beyond the tree as out of tree', () => {
    expect(isInTree('.....')).toBe(false);
    expect(getTreePath('.....')).toEqual(['.', '..', '...', '....']);
    expect(isInTree('')).toBe(false);
    expect(getTreePath('')).toEqual([]);
  });
});
