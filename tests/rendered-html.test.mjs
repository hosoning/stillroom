import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("ships the finished Stillroom experience", async () => {
  const [page, data, layout] = await Promise.all([
    readFile(new URL("app/page.tsx", root), "utf8"),
    readFile(new URL("app/data.ts", root), "utf8"),
    readFile(new URL("app/layout.tsx", root), "utf8"),
  ]);

  assert.match(layout, /Stillroom/);
  assert.match(page, /Get a reply/);
  assert.match(page, /findCharacter/);
  assert.match(page, /buildReply/);
  assert.match(data, /generalResponses/);
  assert.equal((data.match(/^  \["/gm) ?? []).length, 88);
});
