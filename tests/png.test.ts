import { describe, expect, it } from "vitest";
import { inspectPng } from "@/lib/png";

function chunk(type: string, data: number[]) {
  const len = data.length;
  return [(len >>> 24) & 255, (len >>> 16) & 255, (len >>> 8) & 255, len & 255, ...[...type].map((c) => c.charCodeAt(0)), ...data, 0, 0, 0, 0];
}
const u32 = (n: number) => [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255];
function png(colorType: number, ppm?: number) {
  const ihdr = [...u32(100), ...u32(80), 8, colorType, 0, 0, 0];
  return new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10, ...chunk("IHDR", ihdr),
    ...(ppm ? chunk("pHYs", [...u32(ppm), ...u32(ppm), 1]) : []), ...chunk("IDAT", [1, 2]), ...chunk("IEND", [])]);
}

describe("fichier PNG de personnalisation", () => {
  it("refuse un fichier qui n'est pas un PNG", () => {
    expect(inspectPng(new Uint8Array(60)).ok).toBe(false);
  });
  it("refuse un PNG sans transparence", () => {
    expect(inspectPng(png(2, 23622)).ok).toBe(false);
  });
  it("refuse une résolution inférieure à 600 dpi", () => {
    const r = inspectPng(png(6, 11811)); // 300 dpi
    expect(r.ok).toBe(false);
    expect(r.dpi).toBe(300);
  });
  it("accepte un PNG transparent à 600 dpi", () => {
    const r = inspectPng(png(6, 23622));
    expect(r.ok).toBe(true);
    expect(r.dpi).toBe(600);
  });
  it("accepte avec avertissement si la résolution n'est pas indiquée", () => {
    const r = inspectPng(png(6));
    expect(r.ok).toBe(true);
    expect(r.warning).toBeTruthy();
  });
});
