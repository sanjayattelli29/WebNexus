import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import fs from "fs";
import path from "path";

const uri = process.env.MONGODB_URI!;
const client = new MongoClient(uri);

export async function GET() {
  try {
    await client.connect();
    const database = client.db(process.env.MONGODB_DB!);

    // Read the current data/index.ts file
    const dataFilePath = path.join(process.cwd(), "data", "index.ts");
    let currentContent = fs.readFileSync(dataFilePath, "utf8");

    // Sync each section
    const sections = [
      "projects",
      "testimonials",
      "workExperience",
      "socialMedia",
    ];

    for (const section of sections) {
      const collection = database.collection(section);
      const items = await collection.find({}).toArray();

      // Find the section in the file
      const sectionStartRegex = new RegExp(`export const ${section} = \\[`);
      const sectionEndRegex = new RegExp(`\\];(\\r?\\n\\n)?export const`);

      const startMatch = currentContent.match(sectionStartRegex);
      const endMatch = currentContent.match(sectionEndRegex);

      if (!startMatch || !endMatch) {
        console.warn(`Could not find ${section} section in data file`);
        continue;
      }

      // Generate the new content
      let itemsContent = items
        .map((item) => {
          // Remove MongoDB specific fields
          const { _id, __v, ...cleanItem } = item;

          // Convert the item to a string representation
          return `  {
    ${Object.entries(cleanItem)
      .map(([key, value]) => {
        if (Array.isArray(value)) {
          return `${key}: [${value.map((v) => `"${v}"`).join(", ")}]`;
        }
        return `${key}: "${value}"`;
      })
      .join(",\n    ")}
  }`;
        })
        .join(",\n");

      // Replace the section in the content
      const startIndex = startMatch.index! + startMatch[0].length;
      const endIndex = endMatch.index!;

      currentContent =
        currentContent.slice(0, startIndex) +
        "\n" +
        itemsContent +
        "\n" +
        currentContent.slice(endIndex);
    }

    // Write the updated content back to the file
    fs.writeFileSync(dataFilePath, currentContent, "utf8");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error syncing data:", error);
    return NextResponse.json(
      { success: false, message: "Failed to sync data" },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}

export async function POST(req: Request) {
  try {
    const { projects } = await req.json();

    // Read the current index.ts file
    const indexPath = path.join(process.cwd(), "data", "index.ts");
    let content = fs.readFileSync(indexPath, "utf-8");

    // Find the projects array in the content
    const projectsStart = content.indexOf("export const projects = [");
    const projectsEnd = content.indexOf("];", projectsStart) + 2;

    // Format the new projects array
    const formattedProjects = JSON.stringify(projects, null, 2)
      .replace(/"([^"]+)":/g, "$1:") // Convert "key": to key:
      .replace(/"/g, "'"); // Convert double quotes to single quotes

    // Create the new projects section
    const newProjectsSection = `export const projects = ${formattedProjects};`;

    // Replace the old projects section with the new one
    const newContent =
      content.substring(0, projectsStart) +
      newProjectsSection +
      content.substring(projectsEnd);

    // Write the updated content back to index.ts
    fs.writeFileSync(indexPath, newContent);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error syncing projects:", error);
    return NextResponse.json(
      { success: false, error: "Failed to sync projects" },
      { status: 500 }
    );
  }
}
