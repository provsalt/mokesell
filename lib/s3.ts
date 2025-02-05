// lib/s3.ts
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

const s3 = new S3Client({
  region: "US",
  endpoint: process.env.S3_BUCKET_URL,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_KEY!,
  },
  forcePathStyle: true,
});

export const uploadToS3 = async (
  fileBuffer: Buffer,
  fileName: string,
  mimeType: string,
) => {
  const key = `listings/${uuidv4()}-${fileName}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
      Body: fileBuffer,
      ContentType: mimeType,
      ACL: "public-read",
    }),
  );

  return `${process.env.NEXT_PUBLIC_S3_CDN_URL}/${key}`;
};

export const deleteFromS3 = async (
  images: {
    url: string;
    createdAt: Date;
    id: number;
    position: number;
    listingId: number;
  }[],
) => {
  const keys = images.map((image) => {
    const url = new URL(image.url);
    return decodeURIComponent(url.pathname.substring(1));
  });
  keys.forEach((key) => {
    s3.send(
      new DeleteObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
      }),
    );
  });
};
