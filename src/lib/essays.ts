import { getCollection } from 'astro:content';

export async function getEssays() {
  const essays = await getCollection('essays', ({ data }) => import.meta.env.DEV || !data.draft);
  return essays.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export function formatDate(date: Date) {
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', timeZone: 'UTC' });
}
