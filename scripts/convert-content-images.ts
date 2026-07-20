import { spawn } from "child_process";
import { access, readdir, unlink } from "fs/promises";
import path from "path";

const sourceExtensions = new Set([".heic", ".heif", ".tif", ".tiff", ".webp"]);

const losslessTargetExtension = ".png";

async function exists(filePath: string) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function walk(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const entryPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        return walk(entryPath);
      }

      return Promise.resolve([entryPath]);
    }),
  );

  return files.flat();
}

function convertWithSips(inputPath: string, outputPath: string) {
  return new Promise<void>((resolve, reject) => {
    const child = spawn(
      "sips",
      ["-s", "format", "png", inputPath, "--out", outputPath],
      {
        stdio: "inherit",
      },
    );

    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`sips exited with code ${code}`));
    });
  });
}

(async () => {
  const targetDir = path.resolve(
    process.argv[2] ?? path.join("images", "content"),
  );
  const files = await walk(targetDir);
  let converted = 0;
  let pruned = 0;
  let skipped = 0;

  for (const filePath of files) {
    const extension = path.extname(filePath).toLowerCase();

    if (!sourceExtensions.has(extension)) {
      skipped += 1;
      continue;
    }

    const outputPath = path.join(
      path.dirname(filePath),
      `${path.basename(filePath, path.extname(filePath))}${losslessTargetExtension}`,
    );

    if (await exists(outputPath)) {
      await unlink(filePath);
      console.log(
        `Pruned ${path.relative(process.cwd(), filePath)}; kept existing ${path.relative(process.cwd(), outputPath)}`,
      );
      pruned += 1;
      continue;
    }

    await convertWithSips(filePath, outputPath);
    console.log(
      `Converted ${path.relative(process.cwd(), filePath)} -> ${path.relative(process.cwd(), outputPath)}`,
    );
    converted += 1;

    await unlink(filePath);
    console.log(`Pruned ${path.relative(process.cwd(), filePath)}`);
    pruned += 1;
  }

  console.log(
    `Done. Converted ${converted} file(s), pruned ${pruned} original(s), skipped ${skipped} file(s).`,
  );
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
