import type { ActiveTarget } from '../artifacts/artifact.interface';

export class TrieNode {
  public children: Map<string, TrieNode> = new Map();
  public isEndOfWord = false;
  public target: ActiveTarget | null = null;
}

/**
 * Prefix Tree (Trie) Data Structure for O(m) target acquisition and lock-on resolution.
 * Indexes all active projectiles and affordable player spells.
 */
export class Trie {
  private root = new TrieNode();

  public clear(): void {
    this.root = new TrieNode();
  }

  public insert(word: string, target: ActiveTarget): void {
    const normalized = word.toUpperCase();
    let current = this.root;

    for (let i = 0; i < normalized.length; i++) {
      const char = normalized[i];
      if (!current.children.has(char)) {
        current.children.set(char, new TrieNode());
      }
      current = current.children.get(char)!;
    }

    current.isEndOfWord = true;
    current.target = target;
  }

  /**
   * Finds any active target whose word begins with the given initial character.
   * Under the Initial Letter Rule, at most one target can start with any character.
   */
  public findByFirstChar(char: string): ActiveTarget | null {
    const normalized = char.toUpperCase();
    const child = this.root.children.get(normalized);
    if (!child) return null;

    // Traverse down to find the registered target
    return this.findAnyTarget(child);
  }

  private findAnyTarget(node: TrieNode): ActiveTarget | null {
    if (node.target) return node.target;
    for (const child of node.children.values()) {
      const found = this.findAnyTarget(child);
      if (found) return found;
    }
    return null;
  }

  public findExact(word: string): ActiveTarget | null {
    const normalized = word.toUpperCase();
    let current = this.root;
    for (let i = 0; i < normalized.length; i++) {
      const char = normalized[i];
      if (!current.children.has(char)) return null;
      current = current.children.get(char)!;
    }
    return current.isEndOfWord ? current.target : null;
  }

  public delete(word: string): void {
    const normalized = word.toUpperCase();
    this.deleteHelper(this.root, normalized, 0);
  }

  private deleteHelper(current: TrieNode, word: string, index: number): boolean {
    if (index === word.length) {
      if (!current.isEndOfWord) return false;
      current.isEndOfWord = false;
      current.target = null;
      return current.children.size === 0;
    }

    const char = word[index];
    const node = current.children.get(char);
    if (!node) return false;

    const shouldDeleteCurrentNode = this.deleteHelper(node, word, index + 1);

    if (shouldDeleteCurrentNode) {
      current.children.delete(char);
      return current.children.size === 0 && !current.isEndOfWord;
    }

    return false;
  }

  /**
   * Checks if the given word is a prefix of any registered word in the Trie.
   * Mandated by the Prefix Rule in Spell Crafting.
   */
  public isPrefixOfExisting(word: string): boolean {
    const normalized = word.toUpperCase();
    let current = this.root;
    for (let i = 0; i < normalized.length; i++) {
      const char = normalized[i];
      if (!current.children.has(char)) return false;
      current = current.children.get(char)!;
    }
    return current.children.size > 0;
  }

  /**
   * Checks if any registered word in the Trie is a prefix of the given candidate word.
   * E.g. If "CAT" is registered, candidate "CATCH" is rejected.
   */
  public hasExistingPrefix(word: string): boolean {
    const normalized = word.toUpperCase();
    let current = this.root;
    for (let i = 0; i < normalized.length; i++) {
      const char = normalized[i];
      if (current.isEndOfWord) return true;
      if (!current.children.has(char)) return false;
      current = current.children.get(char)!;
    }
    return current.isEndOfWord;
  }

  public getAllTargets(): ActiveTarget[] {
    const results: ActiveTarget[] = [];
    this.collectTargets(this.root, results);
    return results;
  }

  private collectTargets(node: TrieNode, list: ActiveTarget[]): void {
    if (node.isEndOfWord && node.target) {
      list.push(node.target);
    }
    for (const child of node.children.values()) {
      this.collectTargets(child, list);
    }
  }
}

