import { S3 } from 'aws-sdk';
import { env } from "@/env";

const s3Client = new S3({
    endpoint:env.MINIO_ENDPOINT,
    accessKeyId:env.MINIO_ACCESS_KEY,
    secretAccessKey: env.MINIO_SECRET_KEY,    
    region: "us-east-1",
    s3ForcePathStyle:true
});
export default s3Client;