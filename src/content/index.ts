import MiniSearch from 'minisearch';
import { BookMetaSchema, type BookMeta, type WingId } from '@/lib/schema';
import { BOOKS_EM } from './booksEm';
import { BOOKS_FRONTIERS } from './booksFrontiers';
import { BOOKS_MECHANICS } from './booksMechanics';
import { BOOKS_QUANTUM } from './booksQuantum';
import { BOOKS_RELATIVITY } from './booksRelativity';
import { BOOKS_STUBS } from './booksStubs';
import { BOOKS_THERMAL } from './booksThermal';
import { GLOSSARY, GLOSSARY_BY_ID, WINGS } from './wingsAndGlossary';

export { WINGS, GLOSSARY, GLOSSARY_BY_ID };

export const ALL_BOOKS: BookMeta[] = [
  ...BOOKS_MECHANICS,
  ...BOOKS_EM,
  ...BOOKS_THERMAL,
  ...BOOKS_RELATIVITY,
  ...BOOKS_QUANTUM,
  ...BOOKS_FRONTIERS,
  ...BOOKS_STUBS,
];

// Validate schema eagerly in dev/test
export function validateCatalogSchemas(): void {
  for (const book of ALL_BOOKS) {
    BookMetaSchema.parse(book);
  }
}

export const BOOKS_BY_ID: Record<string, BookMeta> = Object.fromEntries(
  ALL_BOOKS.map((b) => [b.id, b])
);

export const BOOKS_BY_WING: Record<WingId, BookMeta[]> = {
  mechanics: ALL_BOOKS.filter((b) => b.wing === 'mechanics'),
  electromagnetism: ALL_BOOKS.filter((b) => b.wing === 'electromagnetism'),
  thermal: ALL_BOOKS.filter((b) => b.wing === 'thermal'),
  relativity: ALL_BOOKS.filter((b) => b.wing === 'relativity'),
  quantum: ALL_BOOKS.filter((b) => b.wing === 'quantum'),
  frontiers: ALL_BOOKS.filter((b) => b.wing === 'frontiers'),
};

export interface SearchDocument {
  id: string;
  bookId: string;
  pageNumber: number;
  wing: WingId;
  status: 'published' | 'stub';
  title: string;
  subtitle: string;
  body: string;
}

const searchDocs: SearchDocument[] = [];
for (const book of ALL_BOOKS) {
  if (book.status === 'published' && book.pages) {
    for (const page of book.pages) {
      const textParts: string[] = [page.chapterTitle, page.heading];
      for (const blk of page.blocks) {
        if (blk.kind === 'prose') textParts.push(...blk.paragraphs);
        else if (blk.kind === 'eq') textParts.push(blk.label ?? '', blk.tex);
        else if (blk.kind === 'callout') textParts.push(blk.title, blk.body);
        else if (blk.kind === 'exercise') textParts.push(blk.title, blk.prompt);
      }
      searchDocs.push({
        id: `${book.id}::${page.pageNumber}`,
        bookId: book.id,
        pageNumber: page.pageNumber,
        wing: book.wing,
        status: book.status,
        title: `${book.title} — ${page.heading}`,
        subtitle: page.chapterTitle,
        body: textParts.join(' '),
      });
    }
  } else {
    searchDocs.push({
      id: `${book.id}::1`,
      bookId: book.id,
      pageNumber: 1,
      wing: book.wing,
      status: book.status,
      title: book.title,
      subtitle: book.subtitle,
      body: `${book.summary} ${book.plannedChapters.join(' ')}`,
    });
  }
}

export const librarySearch = new MiniSearch<SearchDocument>({
  fields: ['title', 'subtitle', 'body'],
  storeFields: ['bookId', 'pageNumber', 'wing', 'status', 'title', 'subtitle'],
  searchOptions: {
    boost: { title: 3, subtitle: 2 },
    fuzzy: 0.2,
    prefix: true,
  },
});

librarySearch.addAll(searchDocs);
