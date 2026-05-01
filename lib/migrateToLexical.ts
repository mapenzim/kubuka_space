import { createEditor, $getRoot } from "lexical";
import { $generateNodesFromDOM } from "@lexical/html";
import { JSDOM } from "jsdom";
import { marked } from "marked";

export async function migrateToLexical(content: string) {
  let html = content;

  // 1️⃣ Detect + convert markdown → HTML
  if (content.includes("#") || content.includes("**")) {
    html = await marked.parse(content);
  }

  // 2️⃣ Plain text → wrap in paragraph
  if (!html.trim().startsWith("<")) {
    html = `<p>${content}</p>`;
  }

  // 3️⃣ Create DOM
  const dom = new JSDOM(html);
  const document = dom.window.document;

  // 4️⃣ Create Lexical editor
  const editor = createEditor();

  let json: string = "";

  editor.update(() => {
    const nodes = $generateNodesFromDOM(editor as any, document);

    const root = $getRoot();
    root.clear();
    root.append(...Array.from(nodes) as any);

    json = JSON.stringify(editor.getEditorState().toJSON());
  });

  return json;
}