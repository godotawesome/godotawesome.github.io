/**
 * Shared slugify for categories/tags/archives.
 * trim → NFC → lower → spaces/_ → - → strip unsafe chars
 */
export function slugify(input: string): string {
  return input
    .normalize("NFC")
    .trim()
    .toLowerCase()
    .replace(/[_\s]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
