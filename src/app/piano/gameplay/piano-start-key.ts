/** Keyboard start only accepts an intentional key away from native controls. */
export function isStartKey(event: KeyboardEvent): boolean {
  if (event.defaultPrevented || event.repeat || event.ctrlKey || event.altKey || event.metaKey || event.isComposing) return false;
  if (event.key !== 'Enter' && event.key.length !== 1) return false;
  return !event.composedPath().some(target => target instanceof HTMLElement &&
    (target.isContentEditable || target.matches('button, a, input, textarea, select, [role="button"], [role="link"], [role="textbox"]')));
}
