import {Blob} from 'buffer';
import {
  FirebaseStorage,
  UploadMetadata,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from 'firebase/storage';

let storage: FirebaseStorage;

export async function uploadBase64ToFirebase(
  uploadString: string,
  refPath: string,
): Promise<string> {
  if (!storage) storage = getStorage();
  const [contentType, base64, fileExt] = uploadString.split(',');
  const fileRef = ref(storage, `${refPath}.${fileExt}`);

  // Convert base64 to a Buffer
  const buffer = Buffer.from(base64, 'base64');

  const metadata: UploadMetadata = {
    contentType: contentType.replace('data:', '').replace(';base64', ''),
  };

  // Upload the buffer to Firebase Storage
  const snapshot = await uploadBytes(fileRef, buffer, metadata);
  return getDownloadURL(snapshot.ref);
}

export const base64ToBlob = (base64: string, contentType = ''): Blob => {
  const byteCharacters = Buffer.from(base64, 'base64');
  return new Blob([byteCharacters], {type: contentType});
};
