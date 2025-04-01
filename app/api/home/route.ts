import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI!;
const client = new MongoClient(uri);

export async function GET() {
  try {
    await client.connect();
    const database = client.db(process.env.MONGODB_DB!);

    // Fetch all collections in parallel
    const [projects, testimonials, companies, workExperience, socialMedia] =
      await Promise.all([
        database.collection("projects").find({}).toArray(),
        database.collection("testimonials").find({}).toArray(),
        database.collection("companies").find({}).toArray(),
        database.collection("workExperience").find({}).toArray(),
        database.collection("socialMedia").find({}).toArray(),
      ]);

    return NextResponse.json({
      success: true,
      data: {
        projects,
        testimonials,
        companies,
        workExperience,
        socialMedia,
      },
    });
  } catch (error) {
    console.error("Error fetching home data:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch home data" },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
