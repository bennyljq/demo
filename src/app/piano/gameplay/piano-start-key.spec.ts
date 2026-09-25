import { isStartKey } from './piano-start-key';

describe('keyboard start', () => {
  it('accepts printable keys, Space and Enter, but not navigation or shortcuts', () => {
    for (const key of ['a', 'A', '5', ' ', 'Enter']) expect(isStartKey(new KeyboardEvent('keydown', { key }))).toBeTrue();
    for (const key of ['Tab', 'Escape', 'ArrowLeft', 'Shift']) expect(isStartKey(new KeyboardEvent('keydown', { key }))).toBeFalse();
    for (const options of [{ repeat: true }, { ctrlKey: true }, { altKey: true }, { metaKey: true }, { isComposing: true }])
      expect(isStartKey(new KeyboardEvent('keydown', { key: 'a', ...options }))).toBeFalse();
  });

  it('leaves native and editable controls alone', () => {
    for (const tag of ['button', 'a', 'input', 'textarea', 'select']) {
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      spyOn(event, 'composedPath').and.returnValue([document.createElement(tag)]);
      expect(isStartKey(event)).withContext(tag).toBeFalse();
    }
  });
});
