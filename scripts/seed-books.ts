/**
 * scripts/seed-books.ts
 * High-performance batch seeder script to populate thousands of top books
 * across 40+ major categories from Open Library API into PostgreSQL.
 *
 * Usage:
 *   npx tsx scripts/seed-books.ts
 */

import { prisma } from '../lib/prisma';
import { fetchBooksBySubject, ExternalBook } from '../lib/book-api';

const EXTENDED_SUBJECTS = [
  'fiction',
  'mystery',
  'thriller',
  'fantasy',
  'science_fiction',
  'romance',
  'historical_fiction',
  'crime',
  'horror',
  'adventure',
  'young_adult',
  'biography',
  'autobiography',
  'memoir',
  'history',
  'psychology',
  'philosophy',
  'business',
  'finance',
  'economics',
  'self-help',
  'personal_development',
  'science',
  'technology',
  'computer_science',
  'mathematics',
  'physics',
  'art',
  'music',
  'poetry',
  'drama',
  'comics',
  'graphic_novels',
  'children',
  'classic',
  'religion',
  'spirituality',
  'politics',
  'travel',
  'cooking',
  'health',
  'fitness',
  'parenting',
  'education',
  'nature',
  'design',
];

// Number of offsets per subject (e.g. 5 offsets x 100 books = 500 books per subject)
const OFFSETS_PER_SUBJECT = [0, 100, 200, 300, 400];

async function seedMassiveBooksCatalog() {
  console.log('🚀 Starting Massive Book Catalog Seeding from Open Library API...');
  const startTime = Date.now();

  let totalInsertedCount = 0;

  for (const subject of EXTENDED_SUBJECTS) {
    console.log(`\n📚 [Category] Processing subject: "${subject}"...`);

    for (const offset of OFFSETS_PER_SUBJECT) {
      const books: ExternalBook[] = await fetchBooksBySubject(subject, 100, offset);

      if (books.length === 0) continue;

      // Prepare batch payload for fast prisma.createMany
      const recordsToInsert = books.map((b) => ({
        external_id: b.external_id,
        name: b.name,
        author: b.author,
        genre: b.genre,
        image: b.image,
        description: b.description,
        is_pinned: true,
        search_count: 5,
        last_accessed_at: new Date(),
      }));

      try {
        const result = await prisma.book.createMany({
          data: recordsToInsert,
          skipDuplicates: true,
        });

        totalInsertedCount += result.count;
        process.stdout.write(`  ↳ Offset ${offset}: inserted ${result.count} new books.\n`);
      } catch (err) {
        // Fallback for individual upserts if createMany fails
        for (const b of recordsToInsert) {
          try {
            await prisma.book.upsert({
              where: { external_id: b.external_id },
              update: { last_accessed_at: new Date() },
              create: b,
            });
            totalInsertedCount++;
          } catch {
            // ignore duplicate
          }
        }
      }

      // Small delay between requests to respect Open Library API rate limits
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
  }

  const durationSeconds = Math.round((Date.now() - startTime) / 1000);
  const dbTotal = await prisma.book.count();

  console.log('\n================================================================');
  console.log(`🎉 Massive Book Catalog Seeding Completed in ${durationSeconds}s!`);
  console.log(` 📥 Newly inserted books in this run: ${totalInsertedCount}`);
  console.log(` 📚 Total books stored in PostgreSQL: ${dbTotal}`);
  console.log('================================================================\n');

  await prisma.$disconnect();
}

seedMassiveBooksCatalog().catch(async (e) => {
  console.error('❌ Massive seeding failed with error:', e);
  await prisma.$disconnect();
  process.exit(1);
});
