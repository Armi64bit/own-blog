export const hiddenSlugs = new Set<string>([]);
export const isVisible = (slug: string) => !hiddenSlugs.has(slug);
