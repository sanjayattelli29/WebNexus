import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";

const uri = process.env.MONGODB_URI!;
const client = new MongoClient(uri);

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await client.connect();
    const database = client.db(process.env.MONGODB_DB!);
    const collection = database.collection("workExperience");

    const result = await collection.deleteOne({
      _id: new ObjectId(params.id),
    });

    if (result.deletedCount === 1) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { success: false, message: "Experience not found" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error deleting experience:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete experience" },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
