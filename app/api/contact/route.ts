import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI!;
const client = new MongoClient(uri);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    await client.connect();
    const database = client.db(process.env.MONGODB_DB!);
    const collection = database.collection("contacts");

    const result = await collection.insertOne({
      name,
      email,
      message,
      date: new Date().toLocaleString(),
    });

    return NextResponse.json(
      { success: true, message: "Message sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error saving contact form:", error);
    return NextResponse.json(
      { success: false, message: "Failed to send message" },
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
    const collection = database.collection("contacts");

    const contacts = await collection.find({}).toArray();

    return NextResponse.json({ success: true, data: contacts });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch contacts" },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
