import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { v4 } from "uuid"
import { bucket } from "./index"
import axios from "axios";
import dotenv from "dotenv"
import { getSession } from "next-auth/react";
dotenv.config()

const backendUrl = process.env.NEXT_PUBLIC_SOCKET_URL || ""

export const uploadImageToFirebase = async (id : number , img:React.ComponentState) =>{
    const imgRef = ref(bucket , `ProfilePics/${v4()}`);
    const defaultImage = process.env.NEXT_PUBLIC_defaultPic || ""
    const session = await getSession()
    if(session){
      try {
        // Upload new image
        const res = await uploadBytes(imgRef, img);
    
        // Delete old image if it exists and is not default
        const oldImage = await getImageUrlWithId(id);
        const oldImagePath = oldImage && oldImage.path !== defaultImage ? oldImage.path : null;
        if (oldImagePath) {
          const oldImageRef = ref(bucket, oldImagePath);
          try{
            await deleteObject(oldImageRef);
          }
          catch(e){
            console.error("Error deleting old image", e)
          }
        } else {
          console.log("Old image not deleted or was default");
        }
    
        // Get download url for the new image
        const downloadUrl = await getDownloadURL(ref(bucket , res.metadata.fullPath));
    
        // Update user data with new image URL
        const resp = await axios.post(`${backendUrl}/user/data`, { id, path : res.metadata.fullPath , url : downloadUrl });
    
        if (resp.data) {
          console.log(res);
          return true;
        }

        console.log(resp);
        
        return false; // Handle cases where resp.data is false
      } catch (error) {
        console.error('Error updating profile picture:', error);
        return false;
      }
    }
}

interface Image {
    url: string;
    path : string
}
  
export const getImageUrlWithId = async (id: number): Promise<Image | null> => {
  const session = await getSession()
  console.log("session from bucket",session)
    if(session){
      console.log(session)
      const res = await axios.get(`${backendUrl}/user/data?id=${id}`)
      console.log(res)
      const ImagePath = res.data.pfp.path
      // const imageRef = ref(bucket, ImagePath);
      try {
          // const url = await getDownloadURL(imageRef);
          return {
              url : res.data.pfp.link,
              path : res.data.pfp.path
          };
      }
      catch (error) {
          console.error("Error fetching image");
          return null;
      }
    }
    else{
      return null
    }
}
export const getImageUrlWithPath = async(ImagePath : string)=>{
  const session = await getSession()
    const imageRef = ref(bucket, ImagePath);
    if(session){
      try {
        const url = await getDownloadURL(imageRef);

        return {
            url
        };
      }
      catch (error) {
          console.error("Error fetching image");
          return null;
      }
    }
}