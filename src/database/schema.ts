import {
	type AnyPgColumn,
	type PgTimestampConfig,
	pgEnum,
	pgTable,
	uniqueIndex,
} from "drizzle-orm/pg-core";

const timestampConfig: PgTimestampConfig = {
	mode: "date",
	withTimezone: true,
};

export const OsuGradeEnum = pgEnum("osu_grade", [
	"SSH",
	"SS",
	"SH",
	"S",
	"A",
	"B",
	"C",
	"D",
]);
export const GoalTypeEnum = pgEnum("goal_type", [
	"acc",
	"misscount",
	"scoreV2",
]);

export const Users = pgTable("user", (table) => ({
	id: table.integer().generatedAlwaysAsIdentity().primaryKey(),
	osuId: table.integer().notNull().unique(),
	username: table.varchar().notNull().unique(),
	createdAt: table.timestamp(timestampConfig).defaultNow(),
}));

export const Beatmaps = pgTable("beatmap", (table) => ({
	beatmapId: table.integer().primaryKey(),
	title: table.varchar().notNull(),
	artist: table.varchar().notNull(),
	difficulty: table.varchar().notNull(),
	coverUrl: table.varchar().notNull(),
	cs: table.real().notNull().default(0),
	ar: table.real().notNull().default(0),
	od: table.real().notNull().default(0),
	bpm: table.real().notNull(),
	length: table.integer().notNull(),
	checksum: table.varchar().notNull(),
}));

export const Milestones = pgTable(
	"milestone",
	(table) => ({
		id: table.integer().generatedAlwaysAsIdentity().primaryKey(),
		beatmapId: table
			.integer()
			.notNull()
			.references(() => Beatmaps.beatmapId, { onDelete: "cascade" }),
		userId: table
			.integer()
			.notNull()
			.references(() => Users.id, { onDelete: "cascade" }),
		lastMilestoneSubmissionId: table
			.integer()
			.references(() => MilestoneSubmissions.id, {
				onUpdate: "cascade",
				onDelete: "set null",
			}),
		goalType: GoalTypeEnum().notNull(),
		createdAt: table.timestamp(timestampConfig).defaultNow(),
		lastUpdatedAt: table.timestamp(timestampConfig).defaultNow(),
		archived: table.timestamp(timestampConfig),
	}),
	(table) => [
		uniqueIndex("milestone_user_goal_udx").on(
			table.beatmapId,
			table.userId,
			table.goalType,
		),
	],
);

export const MilestoneSubmissions = pgTable(
	"milestone_submission",
	(table) => ({
		id: table.integer().generatedAlwaysAsIdentity().primaryKey(),
		milestoneId: table
			.integer()
			.notNull()
			.references((): AnyPgColumn => Milestones.id, { onDelete: "cascade" }),
		userId: table
			.integer()
			.notNull()
			.references(() => Users.id, { onDelete: "cascade" }),
		totalScore: table.integer().notNull(),
		misscount: table.integer().notNull(),
		accuracy: table.real().notNull(),
		rank: OsuGradeEnum().notNull(),
		createdAt: table.timestamp(timestampConfig).defaultNow(),
	}),
);
