import 'dotenv/config';
import { ProductionDB } from './production-db';
import { AlRufqahDataStore } from './db';

if (process.env.NODE_ENV === 'production' && process.env.SEED_CATALOG === 'false') {
  throw new Error('SEED_CATALOG must not be disabled before the database is initialized.');
}

const db = await ProductionDB.create();
const seed = new AlRufqahDataStore();
const inserted = await db.seedIfEmpty({
  cars: seed.cars,
  branches: seed.branches,
  blog: seed.blogPosts,
  users: [],
  bookings: [],
  roadside: [],
  inspections: [],
  corporate: [],
  audits: []
});
console.log(inserted ? 'Catalogue seed inserted.' : 'Database is not empty; seed skipped.');