// Removes *.map files from .next/server after a production build.
//
// These are server-side source maps for the Node.js SSR/RSC bundles —
// distinct from (and unrelated to) `productionBrowserSourceMaps`, which
// only controls *client* bundle maps and is already off by default here.
// Nothing in this app reads them: they're never served over HTTP (only
// .next/static/** is exposed under /_next/static/*, and these live under
// .next/server/**, which Next's server never serves as a response body),
// and there's no Sentry/Datadog/error-tracking integration in this project
// that symbolicates stack traces from them. Measured at 461 files / ~76MB
// on a fresh build — roughly two-thirds of the entire .next output size —
// pure dead weight for this deployment. Node.js's automatic source-map
// stack-trace support (`--enable-source-maps`) is also not used anywhere
// in this project's scripts/tooling, so removing the files doesn't lose
// any observable behavior, only unsymbolicated (function-name-only,
// already-correct-line-count-in-original-source) stack traces if someone
// ever manually inspects a raw Node error log — an acceptable tradeoff
// this project doesn't currently rely on avoiding.
//
// A plain `rm`/`find -delete` in an npm script isn't portable across the
// Windows dev machines and Linux (EC2) deploy target this app runs on, so
// this is a small Node script instead (`node` is already a build
// dependency everywhere this runs).
import { readdir, rm, stat } from "node:fs/promises";
import path from "node:path";

const SERVER_DIR = path.join(process.cwd(), ".next", "server");

async function removeMapsRecursively(dir) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return { removed: 0, bytes: 0 };
  }

  let removed = 0;
  let bytes = 0;

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const sub = await removeMapsRecursively(fullPath);
      removed += sub.removed;
      bytes += sub.bytes;
    } else if (entry.isFile() && entry.name.endsWith(".map")) {
      const { size } = await stat(fullPath);
      await rm(fullPath);
      removed += 1;
      bytes += size;
    }
  }

  return { removed, bytes };
}

const { removed, bytes } = await removeMapsRecursively(SERVER_DIR);
console.log(`postbuild: removed ${removed} server source map file(s) (${(bytes / 1024 / 1024).toFixed(1)} MB)`);
