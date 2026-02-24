import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { auth } from "@clerk/nextjs/server";
import { convexQuery } from "@/lib/convex/server";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f(
    {
      image: {
        maxFileSize: "4MB",
        maxFileCount: 1,
      },
    },
    {
      awaitServerData: false,
    },
  )
    .middleware(async () => {
      const session = await auth();
      if (!session.userId) {
        throw new UploadThingError("Unauthorized");
      }

      const isAdmin = await convexQuery("users:getIsAdmin");
      if (!isAdmin) {
        throw new UploadThingError("Only admins can upload files");
      }

      return { userId: session.userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.ufsUrl);

      return { uploadedBy: metadata.userId, ufsUrl: file.ufsUrl };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
