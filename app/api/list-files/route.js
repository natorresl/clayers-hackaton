import { Storage } from "@google-cloud/storage";

const storage = new Storage({
  projectId: process.env.GCP_PROJECT_ID,
  credentials: {
    client_email: process.env.GCP_CLIENT_EMAIL,
    private_key: process.env.GCP_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  },
});

const BUCKET_NAME = "hackathon-clayers";

export async function GET() {
  try {
    // 1. Get all files in the bucket
    const [files] = await storage.bucket(BUCKET_NAME).getFiles();

    // 2. Filter files to include only model types
    const modelFiles = files.filter(f =>
      f.name.endsWith(".obj") ||
      f.name.endsWith(".fbx") ||
      f.name.endsWith(".glb") ||
      f.name.endsWith(".gltf")
    );

    // 3. Generate a signed URL for each model
    const models = await Promise.all(
      modelFiles.map(async f => {
        const [url] = await f.getSignedUrl({
          version: "v4",
          action: "read",
          expires: Date.now() + 15 * 60 * 1000, // expires in 15 min
        });
        return {
          name: f.name,
          url,
          size: f.metadata.size,
          contentType: f.metadata.contentType,
        };
      })
    );

    // 4. Return array of models with URLs
    return new Response(JSON.stringify(models), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error listing files:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}