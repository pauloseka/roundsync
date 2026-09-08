import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const BRAND = [0.169, 0.373, 0.42, 1];
const STROKE = 1.5;

function path(points, closed = false) {
  return {
    i: points.map(() => [0, 0]),
    o: points.map(() => [0, 0]),
    v: points,
    c: closed,
  };
}

function rect(x, y, w, h) {
  return path(
    [
      [x, y],
      [x + w, y],
      [x + w, y + h],
      [x, y + h],
    ],
    true,
  );
}

function shape(pathData, color = BRAND) {
  return {
    ty: "gr",
    it: [
      { ty: "sh", ks: { a: 0, k: pathData } },
      {
        ty: "st",
        c: { a: 0, k: color },
        o: { a: 0, k: 100 },
        w: { a: 0, k: STROKE },
        lc: 2,
        lj: 2,
      },
      {
        ty: "tr",
        p: { a: 0, k: [0, 0] },
        a: { a: 0, k: [0, 0] },
        s: { a: 0, k: [100, 100] },
        r: { a: 0, k: 0 },
        o: { a: 0, k: 100 },
      },
    ],
  };
}

function buildIcon(name, shapes) {
  return {
    v: "5.7.4",
    fr: 30,
    ip: 0,
    op: 30,
    w: 24,
    h: 24,
    nm: name,
    ddd: 0,
    assets: [],
    layers: [
      {
        ddd: 0,
        ind: 1,
        ty: 4,
        nm: name,
        sr: 1,
        ks: {
          o: { a: 0, k: 100 },
          r: { a: 0, k: 0 },
          p: { a: 0, k: [0, 0, 0] },
          a: { a: 0, k: [0, 0, 0] },
          s: { a: 0, k: [100, 100, 100] },
        },
        ao: 0,
        shapes: shapes.map(([pathData, color]) => shape(pathData, color ?? BRAND)),
        ip: 0,
        op: 30,
        st: 0,
        bm: 0,
      },
    ],
  };
}

const icons = {
  dashboard: [
    [rect(4, 4, 7, 7)],
    [rect(13, 4, 7, 7)],
    [rect(4, 13, 7, 7)],
    [rect(13, 13, 7, 7)],
  ],
  tasks: [
    [
      path(
        [
          [9, 3],
          [15, 3],
          [15, 5],
          [17, 5],
          [17, 20],
          [7, 20],
          [7, 5],
          [9, 5],
          [9, 3],
        ],
        true,
      ),
    ],
    [path([[9, 10], [15, 10]])],
    [path([[9, 14], [13, 14]])],
    [path([[9, 17], [11, 19], [15, 15]])],
  ],
  cases: [
    [
      path(
        [
          [12, 4],
          [19, 18],
          [5, 18],
          [12, 4],
        ],
        true,
      ),
    ],
    [path([[12, 9], [12, 13]])],
    [path([[12, 15], [12.01, 15]])],
  ],
  messages: [
    [
      path(
        [
          [5, 6],
          [5, 15],
          [11, 15],
          [13, 17],
          [13, 15],
          [18, 15],
          [18, 6],
          [5, 6],
        ],
        true,
      ),
    ],
    [path([[8, 10], [15, 10]])],
    [path([[8, 12.5], [13, 12.5]])],
  ],
  patients: [
    [path([[12, 4], [9.5, 4], [9.5, 8.5], [12, 10.5], [14.5, 8.5], [14.5, 4], [12, 4]], true)],
    [
      path([
        [6.5, 19],
        [6.5, 17],
        [8.5, 15],
        [15.5, 15],
        [17.5, 17],
        [17.5, 19],
      ]),
    ],
  ],
  audit: [
    [
      path(
        [
          [12, 5],
          [17, 7],
          [17, 12],
          [12, 19],
          [7, 12],
          [7, 7],
          [12, 5],
        ],
        true,
      ),
    ],
    [path([[12, 9], [12, 12]])],
    [path([[12, 12], [14.5, 13.5]])],
  ],
  settings: [
    [
      path(
        [
          [12, 5],
          [13.6, 5.4],
          [14.8, 6.4],
          [15.2, 8],
          [16.6, 8.8],
          [17.2, 10.2],
          [16.6, 11.6],
          [15.2, 12.4],
          [14.8, 14],
          [13.6, 15],
          [12, 15.4],
          [10.4, 15],
          [9.2, 14],
          [8.8, 12.4],
          [7.4, 11.6],
          [6.8, 10.2],
          [7.4, 8.8],
          [8.8, 8],
          [9.2, 6.4],
          [10.4, 5.4],
          [12, 5],
        ],
        true,
      ),
    ],
    [
      path(
        [
          [12, 9.5],
          [13.4, 9.5],
          [13.4, 10.9],
          [12, 12.3],
          [10.6, 10.9],
          [10.6, 9.5],
          [12, 9.5],
        ],
        true,
      ),
    ],
  ],
  logout: [
    [rect(4, 5, 9, 14)],
    [path([[13, 12], [18, 12]])],
    [path([[16, 9.5], [18.5, 12], [16, 14.5]])],
  ],
};

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "icons", "nav");
mkdirSync(root, { recursive: true });

for (const [name, shapes] of Object.entries(icons)) {
  writeFileSync(join(root, `${name}.json`), JSON.stringify(buildIcon(name, shapes)));
}

console.log(`Wrote ${Object.keys(icons).length} outline Lottie nav icons.`);
