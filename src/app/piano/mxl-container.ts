/** Read the declared MusicXML rootfile from a ZIP-based MXL container. */
export async function readMxlRootfile(buffer: ArrayBuffer): Promise<string> {
  const bytes = new Uint8Array(buffer);
  const view = new DataView(buffer);
  const u16 = (at: number) => view.getUint16(at, true);
  const u32 = (at: number) => view.getUint32(at, true);
  let end = -1;
  for (let at = bytes.length - 22; at >= Math.max(0, bytes.length - 65557); at--) {
    if (u32(at) === 0x06054b50) { end = at; break; }
  }
  if (end < 0 || end + 22 + u16(end + 20) > bytes.length) throw new Error('Invalid MXL ZIP directory.');
  if (u16(end + 8) !== u16(end + 10)) throw new Error('Multi-disk MXL is unsupported.');
  const entries = new Map<string, { method: number; size: number; compressed: number; offset: number }>();
  let at = u32(end + 16);
  for (let i = 0; i < u16(end + 10); i++) {
    if (at + 46 > bytes.length || u32(at) !== 0x02014b50) throw new Error('Invalid MXL ZIP entry.');
    const nameLength = u16(at + 28);
    const extraLength = u16(at + 30);
    const commentLength = u16(at + 32);
    const name = new TextDecoder().decode(bytes.subarray(at + 46, at + 46 + nameLength));
    entries.set(name, { method: u16(at + 10), compressed: u32(at + 20), size: u32(at + 24), offset: u32(at + 42) });
    at += 46 + nameLength + extraLength + commentLength;
  }
  const read = async (name: string): Promise<string> => {
    const entry = entries.get(name);
    if (!entry) throw new Error(`MXL is missing declared file ${name}.`);
    if (entry.size > 8_000_000) throw new Error(`MXL file ${name} is too large.`);
    const offset = entry.offset;
    if (offset + 30 > bytes.length || u32(offset) !== 0x04034b50) throw new Error(`Invalid MXL entry ${name}.`);
    const start = offset + 30 + u16(offset + 26) + u16(offset + 28);
    const compressed = bytes.slice(start, start + entry.compressed);
    if (compressed.length !== entry.compressed) throw new Error(`Truncated MXL entry ${name}.`);
    let result: Uint8Array;
    if (entry.method === 0) result = compressed;
    else if (entry.method === 8) {
      if (typeof DecompressionStream === 'undefined') throw new Error('This browser cannot decompress MXL files.');
      result = new Uint8Array(await new Response(new Blob([compressed]).stream()
        .pipeThrough(new DecompressionStream('deflate-raw'))).arrayBuffer());
    } else throw new Error(`Unsupported MXL compression method ${entry.method}.`);
    if (result.length !== entry.size) throw new Error(`Invalid MXL file size for ${name}.`);
    return new TextDecoder().decode(result);
  };
  const container = new DOMParser().parseFromString(await read('META-INF/container.xml'), 'application/xml');
  if (container.getElementsByTagName('parsererror').length) throw new Error('Invalid MXL container.xml.');
  const rootfile = Array.from(container.getElementsByTagName('*'))
    .find(element => element.localName === 'rootfile')?.getAttribute('full-path');
  if (!rootfile || rootfile.startsWith('/') || rootfile.split('/').includes('..')) throw new Error('MXL has no valid declared rootfile.');
  return read(rootfile);
}
