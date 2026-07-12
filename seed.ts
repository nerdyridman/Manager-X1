import { db } from "./index";
import { users, players, matches, events, squadSelections } from "./schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function seed() {
  // Check if already seeded
  const existingUsers = await db.select().from(users).limit(1);
  if (existingUsers.length > 0) return;

  // Create demo user
  const hash = await bcrypt.hash("password123", 10);
  await db.insert(users).values({
    name: "Alex Ferguson",
    email: "alex@managerx.com",
    passwordHash: hash,
    role: "manager",
  });

  // Create players
  const playerData = [
    { name: "David Martinez", number: 1, position: "goalkeeper" as const, status: "available" as const, age: 28, nationality: "Spain", goals: 0, assists: 0, appearances: 34 },
    { name: "James Wilson", number: 2, position: "defender" as const, status: "available" as const, age: 25, nationality: "England", goals: 2, assists: 5, appearances: 30 },
    { name: "Carlos Mendes", number: 3, position: "defender" as const, status: "available" as const, age: 27, nationality: "Brazil", goals: 1, assists: 3, appearances: 32 },
    { name: "Pierre Dubois", number: 4, position: "defender" as const, status: "injured" as const, age: 30, nationality: "France", goals: 0, assists: 2, appearances: 20, injuryNote: "Hamstring strain - Expected return in 3 weeks" },
    { name: "Marco Rossi", number: 5, position: "defender" as const, status: "available" as const, age: 24, nationality: "Italy", goals: 3, assists: 4, appearances: 28 },
    { name: "Luka Kovač", number: 6, position: "midfielder" as const, status: "available" as const, age: 26, nationality: "Croatia", goals: 8, assists: 12, appearances: 33 },
    { name: "Kenji Tanaka", number: 7, position: "forward" as const, status: "available" as const, age: 23, nationality: "Japan", goals: 15, assists: 7, appearances: 31 },
    { name: "Ahmed Hassan", number: 8, position: "midfielder" as const, status: "available" as const, age: 29, nationality: "Egypt", goals: 5, assists: 9, appearances: 30 },
    { name: "Oliver Schmidt", number: 10, position: "midfielder" as const, status: "suspended" as const, age: 27, nationality: "Germany", goals: 10, assists: 14, appearances: 29 },
    { name: "Rafael Santos", number: 9, position: "forward" as const, status: "available" as const, age: 26, nationality: "Brazil", goals: 22, assists: 6, appearances: 34 },
    { name: "Thomas Berg", number: 11, position: "forward" as const, status: "available" as const, age: 22, nationality: "Norway", goals: 11, assists: 8, appearances: 27 },
    { name: "Finn O'Brien", number: 14, position: "midfielder" as const, status: "available" as const, age: 21, nationality: "Ireland", goals: 3, assists: 6, appearances: 18 },
    { name: "Yusuf Demir", number: 15, position: "defender" as const, status: "injured" as const, age: 24, nationality: "Turkey", goals: 1, assists: 1, appearances: 15, injuryNote: "Knee ligament - Out for the season" },
    { name: "Noah Andersen", number: 16, position: "goalkeeper" as const, status: "available" as const, age: 22, nationality: "Denmark", goals: 0, assists: 0, appearances: 4 },
    { name: "Lucas Fontaine", number: 17, position: "midfielder" as const, status: "resting" as const, age: 31, nationality: "France", goals: 4, assists: 7, appearances: 25 },
    { name: "Mateo García", number: 19, position: "forward" as const, status: "available" as const, age: 20, nationality: "Argentina", goals: 6, assists: 3, appearances: 14 },
    { name: "Samuel Okafor", number: 20, position: "defender" as const, status: "available" as const, age: 23, nationality: "Nigeria", goals: 0, assists: 2, appearances: 12 },
    { name: "Erik Lindberg", number: 22, position: "midfielder" as const, status: "available" as const, age: 25, nationality: "Sweden", goals: 2, assists: 5, appearances: 20 },
  ];

  await db.insert(players).values(playerData);

  // Create matches
  const now = new Date();
  const matchData = [
    {
      opponent: "FC Barcelona B",
      venue: "Home Stadium",
      date: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
      status: "upcoming" as const,
      competition: "League Cup",
      isHome: true,
    },
    {
      opponent: "Ajax Youth",
      venue: "Amsterdam Arena",
      date: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000),
      status: "upcoming" as const,
      competition: "Champions League",
      isHome: false,
    },
    {
      opponent: "Real Sociedad B",
      venue: "Home Stadium",
      date: new Date(now.getTime() + 17 * 24 * 60 * 60 * 1000),
      status: "upcoming" as const,
      competition: "League",
      isHome: true,
    },
    {
      opponent: "Sporting CP II",
      venue: "Home Stadium",
      date: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
      status: "completed" as const,
      competition: "League",
      isHome: true,
      homeScore: 3,
      awayScore: 1,
    },
    {
      opponent: "Dortmund II",
      venue: "Signal Iduna Park",
      date: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      status: "completed" as const,
      competition: "Friendly",
      isHome: false,
      homeScore: 2,
      awayScore: 2,
    },
    {
      opponent: "Lyon Academy",
      venue: "Home Stadium",
      date: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000),
      status: "completed" as const,
      competition: "League Cup",
      isHome: true,
      homeScore: 4,
      awayScore: 0,
    },
  ];

  const insertedMatches = await db.insert(matches).values(matchData).returning();

  // Add squad selections for the next match
  const allPlayers = await db.select().from(players);
  const nextMatch = insertedMatches.find((m) => m.status === "upcoming");
  if (nextMatch) {
    const availablePlayers = allPlayers.filter((p) => p.status === "available");
    const starters = availablePlayers.slice(0, 11);
    const subs = availablePlayers.slice(11);

    const selections = [
      ...starters.map((p) => ({
        matchId: nextMatch.id,
        playerId: p.id,
        isStarter: true,
      })),
      ...subs.map((p) => ({
        matchId: nextMatch.id,
        playerId: p.id,
        isStarter: false,
      })),
    ];

    await db.insert(squadSelections).values(selections);
  }

  // Create events
  const eventData = [
    {
      title: "Morning Training Session",
      description: "Tactical drills and set-piece practice",
      type: "training" as const,
      date: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000),
      endDate: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000),
      location: "Training Ground A",
      isAllDay: false,
    },
    {
      title: "Team Tactics Meeting",
      description: "Review opponent analysis and game plan for FC Barcelona B",
      type: "meeting" as const,
      date: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
      endDate: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000 + 1 * 60 * 60 * 1000),
      location: "Conference Room",
      isAllDay: false,
    },
    {
      title: "Team Building Day",
      description: "Bowling and dinner for team bonding",
      type: "social" as const,
      date: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
      location: "City Bowling Center",
      isAllDay: true,
    },
    {
      title: "Away Trip - Ajax Youth",
      description: "Travel to Amsterdam for Champions League match",
      type: "travel" as const,
      date: new Date(now.getTime() + 9 * 24 * 60 * 60 * 1000),
      endDate: new Date(now.getTime() + 11 * 24 * 60 * 60 * 1000),
      location: "Airport Terminal 2",
      isAllDay: true,
    },
    {
      title: "Pierre Dubois - Physio Session",
      description: "Weekly physiotherapy session for hamstring recovery",
      type: "medical" as const,
      date: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000),
      endDate: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000 + 1 * 60 * 60 * 1000),
      location: "Medical Center",
      isAllDay: false,
    },
    {
      title: "Fitness Testing",
      description: "Pre-season fitness assessments for all players",
      type: "training" as const,
      date: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000),
      location: "Training Ground B",
      isAllDay: true,
    },
    {
      title: "Recovery Session",
      description: "Light recovery training after match day",
      type: "training" as const,
      date: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      endDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000),
      location: "Training Ground A",
      isAllDay: false,
    },
    {
      title: "Media Day",
      description: "Press conference and player interviews",
      type: "other" as const,
      date: new Date(now.getTime() + 6 * 24 * 60 * 60 * 1000),
      location: "Press Room",
      isAllDay: false,
    },
  ];

  await db.insert(events).values(eventData);

  console.log("✅ Database seeded successfully!");
}
