## The idea

Most workout trackers are either fast but flat, or gamified but slow to log. Mettle tries to be both: **logging comes first, the game second**. Showing up earns steady XP, crossing real strength and running benchmarks earns a lot of it, and everyone climbs from **E rank to S rank** (six ranks, five levels each).

Benchmarks are relative, not absolute: they're normalised for bodyweight, age and sex, so a 75 kg lifter benching bodyweight is compared fairly with a 120 kg one. The rules also avoid rewarding unhealthy behaviour: cardio XP has diminishing returns and rest days don't break streaks.

## How it works

- **Offline-first logging:** workouts are written to SQLite on the phone (Drizzle ORM), because gyms often have bad reception. Signing in is optional; when you do, data syncs to Supabase.
- **One XP engine, two places:** XP is derived from logged sets by a pure TypeScript engine. The same code runs in a Supabase Edge Function, so leaderboard XP is recomputed server-side and can't be edited on the phone.
- **Real standards:** 325 exercises (public-domain catalogue plus Mettle's own), strength and rep standards, and WMA/USATF age-graded running tables decide benchmark tiers and your starting rank.
- **Social:** friend groups with weekly leaderboards, profiles with goals, and routines you can share by code.
- **Security:** Postgres row-level security on every cloud table, Google or email-code sign-in, and full account deletion.

## Stack

React Native + Expo (TypeScript), expo-router, Reanimated, expo-sqlite + Drizzle, Zustand, Supabase (Postgres, Auth, RLS, Edge Functions), Jest with 220 tests across the engine, SQLite integration, sync and server.

## Status

In active development and not public yet. Builds go to a small group of testers through EAS. If you'd like to try the beta, use the button below.
