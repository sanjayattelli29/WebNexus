import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";

const uri = process.env.MONGODB_URI!;
const client = new MongoClient(uri);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, des, img, iconLists, link } = body;

    await client.connect();
    const database = client.db(process.env.MONGODB_DB!);
    const collection = database.collection("projects");

    const result = await collection.insertOne({
      title,
      des,
      img,
      iconLists,
      link,
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true, data: result }, { status: 201 });
  } catch (error) {
    console.error("Error saving project:", error);
    return NextResponse.json(
      { success: false, message: "Failed to save project" },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}

export async function GET() {
  try {
    await client.connect();
    const database = client.db(process.env.MONGODB_DB!);
    const collection = database.collection("projects");

    const projects = await collection.find({}).toArray();

    return NextResponse.json({ success: true, data: projects });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch projects" },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
