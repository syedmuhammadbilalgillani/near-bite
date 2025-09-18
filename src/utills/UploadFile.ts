import s3Client from "@/lib/minioConfig";
import { env } from "@/env";

const UploadFile = async(file: File)=>{
    
    try {
        // Convert the Blob to Buffer
        const buffer = Buffer.from(await file.arrayBuffer());

        const fileName = `${new Date().getTime()}_${file.name.replaceAll(" ","_").toLocaleLowerCase()}`;
        const uploadParams = {
            Bucket: env.MINIO_BUCKET_NAME,
            Key: fileName,
            Body: buffer,
            ContentType: file.type,
        };    
        const uploadResult = await s3Client.upload(uploadParams).promise();
        const fileUrl = uploadResult.Location;
        return fileUrl;
      } catch (err) {
        console.error("Error uploading file:", err);
        return false;
      }
}
export default UploadFile;