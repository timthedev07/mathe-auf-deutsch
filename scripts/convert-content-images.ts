import { spawn } from "child_process";
import {
  access,
  readFile,
  readdir,
  rename,
  unlink,
  writeFile,
} from "fs/promises";
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

function runSips(args: string[], captureOutput = false) {
  return new Promise<string>((resolve, reject) => {
    const child = spawn("sips", args, {
      stdio: captureOutput ? ["ignore", "pipe", "pipe"] : "inherit",
    });

    let stdout = "";
    let stderr = "";
    child.stdout?.on("data", (chunk) => (stdout += chunk));
    child.stderr?.on("data", (chunk) => (stderr += chunk));

    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolve(stdout);
        return;
      }

      reject(new Error(`sips exited with code ${code}: ${stderr.trim()}`));
    });
  });
}

async function getOrientation(filePath: string) {
  const output = await runSips(["-g", "orientation", filePath], true);
  const sipsOrientation = output.match(/orientation:\s*(\d+)/)?.[1];

  if (sipsOrientation) {
    return Number(sipsOrientation);
  }

  const metadata = (await readFile(filePath)).toString("latin1");
  return Number(
    metadata.match(/<tiff:Orientation>(\d+)<\/tiff:Orientation>/)?.[1] ?? 1,
  );
}

const orientationOperations: Record<number, string[]> = {
  1: [],
  2: ["-f", "horizontal"],
  3: ["-r", "180"],
  4: ["-f", "vertical"],
  5: ["-f", "horizontal", "-r", "90"],
  6: ["-r", "90"],
  7: ["-f", "horizontal", "-r", "270"],
  8: ["-r", "270"],
};

async function stripOrientationMetadata(filePath: string) {
  const png = await readFile(filePath);
  const signature = png.subarray(0, 8);
  const chunks = [signature];
  let offset = 8;

  while (offset < png.length) {
    const length = png.readUInt32BE(offset);
    const chunkEnd = offset + length + 12;
    const type = png.toString("ascii", offset + 4, offset + 8);

    if (type !== "eXIf" && type !== "iTXt") {
      chunks.push(png.subarray(offset, chunkEnd));
    }

    offset = chunkEnd;
  }

  await writeFile(filePath, Buffer.concat(chunks));
}

async function normaliseOrientation(filePath: string, orientation: number) {
  const operations = orientationOperations[orientation];

  if (!operations) {
    throw new Error(`Unsupported image orientation ${orientation}: ${filePath}`);
  }

  if (operations.length === 0) {
    return false;
  }

  const temporaryPath = `${filePath}.orientation-normalised.png`;

  try {
    await runSips([...operations, filePath, "--out", temporaryPath]);
    await stripOrientationMetadata(temporaryPath);
    await rename(temporaryPath, filePath);
  } catch (error) {
    await unlink(temporaryPath).catch(() => undefined);
    throw error;
  }

  return true;
}

async function convertWithSips(inputPath: string, outputPath: string) {
  const orientation = await getOrientation(inputPath);
  await runSips(["-s", "format", "png", inputPath, "--out", outputPath]);
  await normaliseOrientation(outputPath, orientation);
}

(async () => {
  const targetDir = path.resolve(
    process.argv[2] ?? path.join("images", "content"),
  );
  const files = await walk(targetDir);
  let converted = 0;
  let normalised = 0;
  let pruned = 0;
  let skipped = 0;

  for (const filePath of files) {
    const extension = path.extname(filePath).toLowerCase();

    if (extension === losslessTargetExtension) {
      const orientation = await getOrientation(filePath);
      if (await normaliseOrientation(filePath, orientation)) {
        console.log(
          `Normalised orientation for ${path.relative(process.cwd(), filePath)}`,
        );
        normalised += 1;
      }
      continue;
    }

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
    `Done. Converted ${converted} file(s), normalised ${normalised} image(s), pruned ${pruned} original(s), skipped ${skipped} file(s).`,
  );
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
