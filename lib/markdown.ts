import { marked } from "marked";

marked.setOptions({
  gfm: true,
  breaks: true, // 👈 fixes your paragraph issue
});

export default marked;