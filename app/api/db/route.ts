import { NextResponse } from "next/server";
import { connectToDatabase, collections } from "@/app/lib/mongodb";



import { ObjectId } from "mongodb";

// API Routes
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const collection = searchParams.get("collection");

    if (!collection || !collections[collection as keyof typeof collections]) {
      return NextResponse.json(
        { success: false, error: "Invalid collection name" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const data = await db
      .collection(collections[collection as keyof typeof collections])
      .find({})
      .toArray();

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { collection, data } = await request.json();

    if (!collection || !collections[collection as keyof typeof collections]) {
      return NextResponse.json(
        { success: false, error: "Invalid collection name" },
        { status: 400 }
      );
    }

    if (!data || typeof data !== "object") {
      return NextResponse.json(
        { success: false, error: "Invalid data format" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const result = await db
      .collection(collections[collection as keyof typeof collections])
      .insertOne(data);

    return NextResponse.json(
      { success: true, data: { ...data, _id: result.insertedId } },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { collection, id, data } = await request.json();

    if (!collection || !collections[collection as keyof typeof collections]) {
      return NextResponse.json(
        { success: false, error: "Invalid collection name" },
        { status: 400 }
      );
    }

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid ID format" },
        { status: 400 }
      );
    }

    if (!data || typeof data !== "object") {
      return NextResponse.json(
        { success: false, error: "Invalid data format" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const result = await db
      .collection(collections[collection as keyof typeof collections])
      .updateOne({ _id: new ObjectId(id) }, { $set: data });

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: { ...data, _id: id } });
  } catch (error: any) {
    console.error("PUT Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const collection = searchParams.get("collection");
    const id = searchParams.get("id");

    if (!collection || !collections[collection as keyof typeof collections]) {
      return NextResponse.json(
        { success: false, error: "Invalid collection name" },
        { status: 400 }
      );
    }

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid ID format" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const result = await db
      .collection(collections[collection as keyof typeof collections])
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error("DELETE Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
