import { v4 } from "uuid";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { bucket } from ".";

export async function uploadImage(file:any) {
  try {
    console.log("Uploading image")
    const fileName = `${v4()}_${file.name}`;
    
    // Create a reference to the location where we want to upload the file
    const storageRef = ref(bucket, `gig_images/${fileName}`);

    // Upload the file
    const snapshot = await uploadBytes(storageRef, file);

    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);

    return downloadURL;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
}