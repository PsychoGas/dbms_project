import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Use environment variables for database connection
const connectionString = process.env.DATABASE_URL || '';

// Create postgres client
const client = postgres(connectionString);

// Create drizzle instance
export const db = drizzle(client, { schema });
