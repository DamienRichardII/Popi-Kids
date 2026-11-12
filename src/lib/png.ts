/** Vérification locale d'un fichier PNG de personnalisation : PNG, fond transparent, 600 dpi. */
export type PngCheck = { ok: boolean; error?: string; warning?: string; width?: number; height?: number; dpi?: number };

export const PNG_MAX_BYTES = 10 * 1024 * 1024;
export const PNG_MIN_DPI = 590; // tolérance d'arrondi (600 dpi = 23 622 px/m)

export function inspectPng(buf: Uint8Array): PngCheck {
  const sig = [137, 80, 78, 71, 13, 10, 26, 10];
  if (buf.length < 33 || sig.some((b, i) => buf[i] !== b)) return { ok: false, error: "Le fichier doit être un PNG." };
  const dv = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
  const width = dv.getUint32(16), height = dv.getUint32(20), colorType = buf[25] ?? 0;
  let alpha = colorType === 4 || colorType === 6;
  let dpi: number | undefined;
  let pos = 8;
  while (pos + 8 <= buf.length) {
    const len = dv.getUint32(pos);
    const type = String.fromCharCode(...buf.slice(pos + 4, pos + 8));
    if (type === "tRNS") alpha = true;
    if (type === "pHYs" && pos + 17 <= buf.length && buf[pos + 16] === 1) dpi = Math.round(dv.getUint32(pos + 8) * 0.0254);
    if (type === "IDAT" || type === "IEND") break;
    pos += 12 + len;
  }
  if (!alpha) return { ok: false, error: "Le PNG doit avoir un fond transparent.", width, height, dpi };
  if (dpi !== undefined && dpi < PNG_MIN_DPI) return { ok: false, error: `Résolution trop faible (${dpi} dpi) : 600 dpi requis.`, width, height, dpi };
  return { ok: true, width, height, dpi, warning: dpi === undefined ? "Résolution non indiquée dans le fichier : 600 dpi requis, nous la vérifierons avant impression." : undefined };
}
