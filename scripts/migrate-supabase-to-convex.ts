import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { ConvexHttpClient } from "convex/browser";
import { Client } from "pg";

const required = (name: string) => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

const readTable = async (client: Client, table: string) => {
  const result = await client.query(`SELECT * FROM public.${table}`);
  return result.rows;
};

const main = async () => {
  const supabaseDbUrl = required("SUPABASE_DB_URL");
  const convexUrl = required("CONVEX_URL");
  const convexDeployKey = required("CONVEX_DEPLOY_KEY");
  const migrationSecret = required("MIGRATION_SECRET");

  const pgClient = new Client({ connectionString: supabaseDbUrl });
  await pgClient.connect();

  try {
    console.log("Reading Supabase tables...");

    const [profiles, events, resources, tags, resource_tags, rsvps] =
      await Promise.all([
        readTable(pgClient, "profiles"),
        readTable(pgClient, "events"),
        readTable(pgClient, "resources"),
        readTable(pgClient, "tags"),
        readTable(pgClient, "resource_tags"),
        readTable(pgClient, "rsvps"),
      ]);

    const snapshot = {
      profiles,
      events,
      resources,
      tags,
      resource_tags,
      rsvps,
    };

    const snapshotPath = process.env.MIGRATION_SNAPSHOT_PATH;
    if (snapshotPath) {
      const outputPath = resolve(snapshotPath);
      writeFileSync(outputPath, JSON.stringify(snapshot, null, 2), "utf-8");
      console.log(`Snapshot saved to ${outputPath}`);
    }

    const convex = new ConvexHttpClient(convexUrl);
    convex.setAdminAuth(convexDeployKey);

    console.log("Importing snapshot into Convex...");

    const importResult = await convex.mutation(
      "migrations:importSnapshot" as any,
      {
        secret: migrationSecret,
        clear_existing: process.env.CLEAR_EXISTING === "true",
        snapshot,
      },
    );

    const counts = await convex.query("migrations:getTableCounts" as any, {});

    console.log("Import result:", importResult);
    console.log("Current Convex table counts:", counts);
  } finally {
    await pgClient.end();
  }
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
