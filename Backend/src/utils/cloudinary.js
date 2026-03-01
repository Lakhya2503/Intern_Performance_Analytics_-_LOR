import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import ApiError from './ApiError.js';


cloudinary.config({
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
});



const uploadFiles = async function (localFilePath) {
    try {
        if (!localFilePath) {
            throw new ApiError(404, "localFile not found")
        }
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto'
        })
        //  (`localFilePath was ${response.url}`);
        return response
    } catch (error) {
        fs.unlinkSync(localFilePath)
        throw new ApiError(404, error.message || 'local file not found')
    }


}

export default uploadFiles
