/* ================= LETTURA DEI FILE DELLA BANCA (tutto sull'iPad, nessun server) =================
   readTable(bytes) → righe (array di array di testo/numeri). Formati: CSV/TXT, XLSX, XLS (Excel 97-2003),
   tabelle HTML o XML «travestite» da .xls. */
const Fogli = (function () {
  "use strict";
  const td = (b, enc) => { try { return new TextDecoder(enc || "utf-8", { fatal: !enc }).decode(b); } catch (e) { return new TextDecoder("windows-1252").decode(b); } };
  let inflateRaw = async (u8) => new Uint8Array(await new Response(new Blob([u8]).stream().pipeThrough(new DecompressionStream("deflate-raw"))).arrayBuffer());
  const xmlUnesc = s => String(s).replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n)).replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16))).replace(/&amp;/g, "&");

  /* ---------- CSV ---------- */
  function csv(text) {
    text = text.replace(/^﻿/, "");
    const first = text.split(/\r?\n/).slice(0, 15).join("\n");
    const cnt = c => (first.match(new RegExp(c === "\t" ? "\t" : "\\" + c, "g")) || []).length;
    const sep = [";", ",", "\t", "|"].sort((a, b) => cnt(b) - cnt(a))[0];
    const rows = []; let row = [], cur = "", q = false;
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      if (q) { if (ch === '"') { if (text[i + 1] === '"') { cur += '"'; i++; } else q = false; } else cur += ch; continue; }
      if (ch === '"' && cur === "") { q = true; continue; }
      if (ch === sep) { row.push(cur); cur = ""; continue; }
      if (ch === "\n" || ch === "\r") { if (ch === "\r" && text[i + 1] === "\n") i++; row.push(cur); rows.push(row); row = []; cur = ""; continue; }
      cur += ch;
    }
    if (cur !== "" || row.length) { row.push(cur); rows.push(row); }
    return rows.map(r => r.map(c => c.trim()));
  }

  /* ---------- ZIP (per XLSX) ---------- */
  async function unzip(u8) {
    const dv = new DataView(u8.buffer, u8.byteOffset, u8.byteLength), out = {};
    let e = u8.length - 22; while (e >= 0 && dv.getUint32(e, true) !== 0x06054b50) e--;
    if (e < 0) throw new Error("zip non valido");
    let p = dv.getUint32(e + 16, true); const n = dv.getUint16(e + 10, true);
    for (let k = 0; k < n; k++) {
      const method = dv.getUint16(p + 10, true), csize = dv.getUint32(p + 20, true), nl = dv.getUint16(p + 28, true), xl = dv.getUint16(p + 30, true), cl = dv.getUint16(p + 32, true), off = dv.getUint32(p + 42, true);
      const name = td(u8.subarray(p + 46, p + 46 + nl));
      const lnl = dv.getUint16(off + 26, true), lxl = dv.getUint16(off + 28, true), data = u8.subarray(off + 30 + lnl + lxl, off + 30 + lnl + lxl + csize);
      out[name] = { method, data };
      p += 46 + nl + xl + cl;
    }
    return { get: async name => { const f = out[name]; if (!f) return null; return td(f.method === 0 ? f.data : await inflateRaw(f.data)); }, names: Object.keys(out) };
  }
  const colIdx = r => { let n = 0; for (const ch of r.replace(/\d+/g, "")) n = n * 26 + ch.charCodeAt(0) - 64; return n - 1; };
  async function xlsx(u8) {
    const z = await unzip(u8);
    const ssx = await z.get("xl/sharedStrings.xml"), ss = [];
    if (ssx) (ssx.match(/<si>[\s\S]*?<\/si>/g) || []).forEach(si => ss.push(xmlUnesc((si.match(/<t[^>]*>([\s\S]*?)<\/t>/g) || []).map(t => t.replace(/<[^>]+>/g, "")).join(""))));
    let sheet = "xl/worksheets/sheet1.xml";
    try { const wb = await z.get("xl/workbook.xml"), rel = await z.get("xl/_rels/workbook.xml.rels"); const rid = (wb.match(/<sheet [^>]*r:id="([^"]+)"/) || [])[1]; const tgt = rid && (rel.match(new RegExp('Id="' + rid + '"[^>]*Target="([^"]+)"')) || rel.match(new RegExp('Target="([^"]+)"[^>]*Id="' + rid + '"')) || [])[1]; if (tgt) sheet = "xl/" + tgt.replace(/^\/?xl\//, "").replace(/^\//, ""); } catch (e) {}
    const sx = await z.get(sheet) || await z.get(z.names.find(n => /^xl\/worksheets\/.*\.xml$/.test(n)));
    const rows = [];
    (sx.match(/<row[\s\S]*?<\/row>|<row[^>]*\/>/g) || []).forEach(rx => {
      const ri = +((rx.match(/<row[^>]*\br="(\d+)"/) || [])[1] || rows.length + 1) - 1, row = [];
      (rx.match(/<c\b[^>]*\/>|<c\b[\s\S]*?<\/c>/g) || []).forEach(cx => {
        const r = (cx.match(/\br="([A-Z]+\d+)"/) || [])[1], t = (cx.match(/\bt="([^"]+)"/) || [])[1];
        let v = (cx.match(/<v>([\s\S]*?)<\/v>/) || [])[1];
        if (t === "s") v = ss[+v]; else if (t === "inlineStr") v = xmlUnesc((cx.match(/<t[^>]*>([\s\S]*?)<\/t>/) || [])[1] || ""); else if (v != null) v = t === "str" || t === "e" ? xmlUnesc(v) : (isNaN(+v) ? xmlUnesc(v) : +v);
        row[r ? colIdx(r) : row.length] = v == null ? "" : v;
      });
      rows[ri] = Array.from(row, x => x == null ? "" : x);
    });
    return Array.from(rows, r => r || []);
  }

  /* ---------- XLS (Excel 97-2003: contenitore CFB + record BIFF8) ---------- */
  function cfbStream(u8, wanted) {
    const dv = new DataView(u8.buffer, u8.byteOffset, u8.byteLength);
    const ss = 1 << dv.getUint16(0x1e, true), mss = 1 << dv.getUint16(0x20, true), cutoff = dv.getUint32(0x38, true);
    const sec = i => (i + 1) * ss;
    const difat = []; for (let i = 0; i < 109; i++) { const s = dv.getUint32(0x4c + 4 * i, true); if (s < 0xfffffffa) difat.push(s); }
    let dsec = dv.getUint32(0x44, true), nd = dv.getUint32(0x48, true);
    while (nd-- > 0 && dsec < 0xfffffffa) { for (let i = 0; i < ss / 4 - 1; i++) { const s = dv.getUint32(sec(dsec) + 4 * i, true); if (s < 0xfffffffa) difat.push(s); } dsec = dv.getUint32(sec(dsec) + ss - 4, true); }
    const fat = []; difat.forEach(s => { for (let i = 0; i < ss / 4; i++) fat.push(dv.getUint32(sec(s) + 4 * i, true)); });
    const chain = (start, table) => { const c = []; let s = start, g = 0; while (s < 0xfffffffa && g++ < 1e6) { c.push(s); s = table[s]; } return c; };
    const read = (start, size) => { const c = chain(start, fat), out = new Uint8Array(c.length * ss); c.forEach((s, k) => out.set(u8.subarray(sec(s), sec(s) + ss), k * ss)); return size != null ? out.subarray(0, size) : out; };
    const dir = read(dv.getUint32(0x30, true)), ddv = new DataView(dir.buffer);
    let root = null, hit = null;
    for (let o = 0; o + 128 <= dir.length; o += 128) {
      const nl = ddv.getUint16(o + 0x40, true), type = dir[o + 0x42]; if (!type) continue;
      let name = ""; for (let i = 0; i < nl / 2 - 1; i++) name += String.fromCharCode(ddv.getUint16(o + 2 * i, true));
      const ent = { name, type, start: ddv.getUint32(o + 0x74, true), size: ddv.getUint32(o + 0x78, true) };
      if (type === 5) root = ent; else if (wanted.includes(name) && !hit) hit = ent;
    }
    if (!hit) throw new Error("foglio non trovato nel file .xls");
    if (hit.size >= cutoff) return read(hit.start, hit.size);
    const mini = read(root.start, root.size), mfat = []; const mf = read(dv.getUint32(0x3c, true)), mdv = new DataView(mf.buffer);
    for (let i = 0; i < mf.length / 4; i++) mfat.push(mdv.getUint32(4 * i, true));
    const c = chain(hit.start, mfat), out = new Uint8Array(c.length * mss); c.forEach((s, k) => out.set(mini.subarray(s * mss, s * mss + mss), k * mss));
    return out.subarray(0, hit.size);
  }
  function rk(v) { let n; if (v & 2) n = v >> 2; else { const b = new DataView(new ArrayBuffer(8)); b.setUint32(4, (v & 0xfffffffc) >>> 0, true); n = b.getFloat64(0, true); } return v & 1 ? n / 100 : n; }
  function xls(u8) {
    const wb = cfbStream(u8, ["Workbook", "Book"]), dv = new DataView(wb.buffer, wb.byteOffset, wb.byteLength);
    const recs = []; for (let p = 0; p + 4 <= wb.length;) { const t = dv.getUint16(p, true), l = dv.getUint16(p + 2, true); recs.push({ t, o: p + 4, l }); p += 4 + l; }
    // SST con i suoi CONTINUE
    const sst = [];
    for (let k = 0; k < recs.length; k++) if (recs[k].t === 0xfc) {
      const parts = [recs[k]]; let j = k + 1; while (j < recs.length && recs[j].t === 0x3c) parts.push(recs[j++]);
      let pi = 0, p = parts[0].o + 8, end = parts[0].o + parts[0].l; const total = dv.getUint32(parts[0].o + 4, true);
      const need = n => { if (p + n > end && pi + 1 < parts.length) { pi++; p = parts[pi].o; end = p + parts[pi].l; } };
      for (let s = 0; s < total && pi < parts.length; s++) {
        need(3); const cch = dv.getUint16(p, true); let fl = wb[p + 2]; p += 3; let runs = 0, ext = 0;
        if (fl & 8) { need(2); runs = dv.getUint16(p, true); p += 2; } if (fl & 4) { need(4); ext = dv.getUint32(p, true); p += 4; }
        let str = "", left = cch;
        while (left > 0) {
          if (p >= end) { if (pi + 1 >= parts.length) break; pi++; p = parts[pi].o; end = p + parts[pi].l; fl = (fl & ~1) | (wb[p] & 1); p++; }
          const w = fl & 1 ? 2 : 1, can = Math.min(left, Math.floor((end - p) / w));
          for (let i = 0; i < can; i++) str += String.fromCharCode(w === 2 ? dv.getUint16(p + 2 * i, true) : wb[p + i]);
          p += can * w; left -= can; if (can === 0 && left > 0) { p = end; }
        }
        let skip = runs * 4 + ext; while (skip > 0) { const step = Math.min(skip, end - p); p += step; skip -= step; if (skip > 0) { if (pi + 1 >= parts.length) break; pi++; p = parts[pi].o; end = p + parts[pi].l; } }
        sst.push(str);
      }
      break;
    }
    const rows = []; const put = (r, c, v) => { (rows[r] = rows[r] || [])[c] = v; };
    let bof = 0, pendingStr = null;
    for (const R of recs) {
      const o = R.o;
      if (R.t === 0x809) { bof++; continue; }
      if (R.t === 0x0a && bof >= 2) break; // fine del primo foglio
      if (bof < 2) continue;
      if (R.t === 0xfd) put(dv.getUint16(o, true), dv.getUint16(o + 2, true), sst[dv.getUint32(o + 6, true)] || "");
      else if (R.t === 0x203) put(dv.getUint16(o, true), dv.getUint16(o + 2, true), dv.getFloat64(o + 6, true));
      else if (R.t === 0x27e) put(dv.getUint16(o, true), dv.getUint16(o + 2, true), rk(dv.getUint32(o + 6, true)));
      else if (R.t === 0xbd) { const r = dv.getUint16(o, true), c0 = dv.getUint16(o + 2, true), n = (R.l - 6) / 6; for (let i = 0; i < n; i++) put(r, c0 + i, rk(dv.getUint32(o + 4 + 6 * i + 2, true))); }
      else if (R.t === 0x204) { const r = dv.getUint16(o, true), c = dv.getUint16(o + 2, true), n = dv.getUint16(o + 6, true), fl = wb[o + 8]; let s = ""; for (let i = 0; i < n; i++) s += String.fromCharCode(fl & 1 ? dv.getUint16(o + 9 + 2 * i, true) : wb[o + 9 + i]); put(r, c, s); }
      else if (R.t === 0x06) { const r = dv.getUint16(o, true), c = dv.getUint16(o + 2, true); if (dv.getUint16(o + 12, true) === 0xffff) { if (wb[o + 6] === 0) pendingStr = [r, c]; } else put(r, c, dv.getFloat64(o + 6, true)); }
      else if (R.t === 0x207 && pendingStr) { const n = dv.getUint16(o, true), fl = wb[o + 2]; let s = ""; for (let i = 0; i < n; i++) s += String.fromCharCode(fl & 1 ? dv.getUint16(o + 3 + 2 * i, true) : wb[o + 3 + i]); put(pendingStr[0], pendingStr[1], s); pendingStr = null; }
    }
    return Array.from(rows, r => Array.from(r || [], x => x == null ? "" : x));
  }

  /* ---------- HTML / XML «.xls» ---------- */
  function htmlTable(text) {
    const rows = []; (text.match(/<tr[\s\S]*?<\/tr>/gi) || []).forEach(tr => rows.push((tr.match(/<t[dh][^>]*>[\s\S]*?<\/t[dh]>/gi) || []).map(c => xmlUnesc(c.replace(/<br\s*\/?>/gi, " ").replace(/<[^>]+>/g, "")).replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim())));
    return rows;
  }
  function xml2003(text) {
    const rows = []; (text.match(/<(?:ss:)?Row[\s\S]*?<\/(?:ss:)?Row>/g) || []).forEach(r => { const row = []; (r.match(/<(?:ss:)?Cell[\s\S]*?<\/(?:ss:)?Cell>|<(?:ss:)?Cell[^>]*\/>/g) || []).forEach(c => { const ix = (c.match(/ss:Index="(\d+)"/) || [])[1]; if (ix) while (row.length < +ix - 1) row.push(""); const d = (c.match(/<(?:ss:)?Data[^>]*>([\s\S]*?)<\/(?:ss:)?Data>/) || [])[1]; row.push(d == null ? "" : xmlUnesc(d.replace(/<[^>]+>/g, ""))); }); rows.push(row); });
    return rows;
  }

  async function readTable(u8) {
    if (u8[0] === 0x50 && u8[1] === 0x4b) return xlsx(u8);
    if (u8[0] === 0xd0 && u8[1] === 0xcf && u8[2] === 0x11 && u8[3] === 0xe0) return xls(u8);
    if (u8[0] === 0x25 && u8[1] === 0x50 && u8[2] === 0x44 && u8[3] === 0x46) throw new Error("È un PDF: dalla banca scarica i movimenti in Excel o CSV");
    const text = td(u8);
    if (/^\s*</.test(text)) { if (/<(?:ss:)?Workbook/i.test(text)) return xml2003(text); if (/<table/i.test(text)) return htmlTable(text); }
    return csv(text);
  }
  return { readTable, csv, _setInflate: f => { inflateRaw = f; } };
})();
if (typeof module !== "undefined") module.exports = Fogli;
