export const CATEGORIES = [
  { id: 1, name: "Technology", postCount: 0 },
  { id: 2, name: "Design", postCount: 0 },
  { id: 3, name: "Culture", postCount: 0 },
  { id: 4, name: "Business", postCount: 0 },
  { id: 5, name: "Science", postCount: 0 },
  { id: 6, name: "Health", postCount: 0 },
  { id: 7, name: "Career", postCount: 0 },
  { id: 8, name: "Politics", postCount: 0 },
  { id: 9, name: "Opinion", postCount: 0 },
  { id: 10, name: "Lifestyle", postCount: 0 },
];

export const TAGS = [
  { id: 1, name: "webdev", postCount: 2 },
  { id: 2, name: "javascript", postCount: 2 },
  { id: 3, name: "ai", postCount: 3 },
  { id: 4, name: "design", postCount: 2 },
  { id: 5, name: "trends", postCount: 1 },
  { id: 6, name: "ux", postCount: 1 },
  { id: 7, name: "startup", postCount: 1 },
  { id: 8, name: "climate", postCount: 1 },
];

export const REACTIONS = [
  { type: "like", emoji: "👍", label: "Like" },
  { type: "love", emoji: "❤️", label: "Love" },
  { type: "clap", emoji: "👏", label: "Clap" },
  { type: "fire", emoji: "🔥", label: "Fire" },
  { type: "wow", emoji: "😮", label: "Wow" },
];

export const supportedLanguages = [
  { label: "JavaScript", value: "javascript", aliases: ["js"] },
  { label: "TypeScript", value: "typescript", aliases: ["ts"] },
  { label: "JSX", value: "jsx", aliases: [] },
  { label: "TSX", value: "tsx", aliases: [] },
  { label: "HTML", value: "html", aliases: ["markup"] },
  { label: "CSS", value: "css", aliases: [] },
  { label: "JSON", value: "json", aliases: [] },
  { label: "Python", value: "python", aliases: ["py"] },
  { label: "Java", value: "java", aliases: [] },
  { label: "C", value: "c", aliases: [] },
  { label: "C++", value: "cpp", aliases: ["c++"] },
  { label: "C#", value: "csharp", aliases: ["cs", "c#"] },
  { label: "PHP", value: "php", aliases: [] },
  { label: "Ruby", value: "ruby", aliases: ["rb"] },
  { label: "Go", value: "go", aliases: ["golang"] },
  { label: "Rust", value: "rust", aliases: ["rs"] },
  { label: "SQL", value: "sql", aliases: [] },
  { label: "Bash", value: "bash", aliases: ["sh", "shell"] },
  { label: "PowerShell", value: "powershell", aliases: ["ps1"] },
  { label: "YAML", value: "yaml", aliases: ["yml"] },
  { label: "Markdown", value: "markdown", aliases: ["md"] },
  { label: "React", value: "jsx", aliases: ["react"] },
];

export const languageAliases: Record<string, string> = {
  js: "javascript",
  jsx: "jsx",
  ts: "typescript",
  tsx: "tsx",
  html: "markup",
  xml: "markup",
  shell: "bash",
  sh: "bash",
  py: "python",
  rb: "ruby",
  cs: "csharp",
  "c#": "csharp",
  cpp: "cpp",
  "c++": "cpp",
};

export const ADMIN_TABS = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/posts", label: "Posts" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/comments", label: "Comments" },
];
