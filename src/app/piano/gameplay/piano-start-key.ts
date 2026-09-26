/** Printable keys start Play even after a control was focused; native activation still wins. */
export function isStartKey(event: KeyboardEvent): boolean {
  if (event.defaultPrevented || event.repeat || event.ctrlKey || event.altKey || event.metaKey || event.isComposing) return false;
  if (event.key !== 'Enter' && event.key.length !== 1) return false;
  const path = event.composedPath();
  if (path.some(target => target instanceof HTMLElement &&
    (target.isContentEditable || target.matches('input, textarea, select, [role="textbox"]')))) return false;
  if (event.key === 'Enter' || event.key === ' ') return !path.some(target => target instanceof HTMLElement &&
    target.matches('button, a, [role="button"], [role="link"]'));
  return true;
}
