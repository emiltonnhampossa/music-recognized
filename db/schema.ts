import { pgTable, serial, varchar, integer } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const musicTable = pgTable('musics', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),  
  artist: varchar('artist', { length: 255 }).notNull(), 
  album: varchar('album', { length: 255 }).notNull(),   
  playCount: integer('play_count').notNull().default(0), 
});
