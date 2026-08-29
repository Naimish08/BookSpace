/**
 * lib/book-api.ts
 * Helper utility for querying external free Book APIs (Open Library API).
 */

export interface ExternalBook {
  external_id: string;
  name: string;
  author: string;
  genre: string;
  image: string;
  description: string;
}

const DEFAULT_COVER = "https://covers.openlibrary.org/b/id/10521270-L.jpg";

/**
 * Normalizes Open Library search doc into our Book model format.
 */
function normalizeOpenLibraryDoc(doc: any, fallbackGenre = "General"): ExternalBook | null {
  if (!doc || !doc.title) return null;

  const title = doc.title.trim();
  const author = Array.isArray(doc.author_name) && doc.author_name.length > 0
    ? doc.author_name[0].trim()
    : "Unknown Author";

  const genre = Array.isArray(doc.subject) && doc.subject.length > 0
    ? doc.subject[0].trim()
    : fallbackGenre;

  // Cover image handling
  let coverUrl = DEFAULT_COVER;
  if (doc.cover_i) {
    coverUrl = `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`;
  } else if (Array.isArray(doc.isbn) && doc.isbn.length > 0) {
    coverUrl = `https://covers.openlibrary.org/b/isbn/${doc.isbn[0]}-L.jpg`;
  }

  // Work key or fallback ID
  const external_id = doc.key || (doc.isbn && doc.isbn[0] ? `ISBN:${doc.isbn[0]}` : `OL:${title.toLowerCase().replace(/[^a-z0-9]/g, '-')}`);

  const firstSentence = Array.isArray(doc.first_sentence) && doc.first_sentence.length > 0
    ? doc.first_sentence[0]
    : null;

  const description = firstSentence || `${title} by ${author}. Explore this book on BookSpace.`;

  return {
    external_id,
    name: title,
    author,
    genre,
    image: coverUrl,
    description,
  };
}

/**
 * Searches Open Library for books matching query string.
 */
export async function searchOpenLibrary(query: string, limit = 15): Promise<ExternalBook[]> {
  try {
    const encodedQuery = encodeURIComponent(query.trim());
    const url = `https://openlibrary.org/search.json?q=${encodedQuery}&limit=${limit}`;

    const res = await fetch(url, {
      headers: {
        'User-Agent': 'BookSpace/1.0 (community-reading-app)',
      },
    });

    if (!res.ok) {
      console.warn(`Open Library search HTTP error ${res.status}`);
      return [];
    }

    const data = await res.json();
    if (!data.docs || !Array.isArray(data.docs)) return [];

    const results: ExternalBook[] = [];
    for (const doc of data.docs) {
      const normalized = normalizeOpenLibraryDoc(doc);
      if (normalized) results.push(normalized);
    }

    return results;
  } catch (error) {
    console.error('Error fetching from Open Library API:', error);
    return [];
  }
}

/**
 * Fetches top books for a given subject/genre from Open Library with pagination support.
 */
export async function fetchBooksBySubject(subject: string, limit = 100, offset = 0): Promise<ExternalBook[]> {
  try {
    const cleanSubject = encodeURIComponent(subject.toLowerCase().replace(/\s+/g, '_'));
    const url = `https://openlibrary.org/subjects/${cleanSubject}.json?limit=${limit}&offset=${offset}`;

    const res = await fetch(url, {
      headers: {
        'User-Agent': 'BookSpace/1.0 (community-reading-app)',
      },
    });

    if (!res.ok) return [];

    const data = await res.json();
    if (!data.works || !Array.isArray(data.works)) return [];

    const results: ExternalBook[] = [];
    for (const work of data.works) {
      if (!work.title) continue;

      const coverUrl = work.cover_id
        ? `https://covers.openlibrary.org/b/id/${work.cover_id}-L.jpg`
        : DEFAULT_COVER;

      const author = Array.isArray(work.authors) && work.authors[0]?.name
        ? work.authors[0].name
        : "Unknown Author";

      const formattedGenre = subject.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

      results.push({
        external_id: work.key || `OL-WORK:${work.title}`,
        name: work.title.trim(),
        author: author.trim(),
        genre: formattedGenre,
        image: coverUrl,
        description: `${work.title} by ${author}. Essential reading in ${formattedGenre}.`,
      });
    }

    return results;
  } catch (error) {
    console.error(`Error fetching subject ${subject}:`, error);
    return [];
  }
}
