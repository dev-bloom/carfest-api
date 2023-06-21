import {Blob} from 'buffer';
import {
  FirebaseStorage,
  UploadMetadata,
  getStorage,
  ref,
  uploadBytes,
} from 'firebase/storage';

let storage: FirebaseStorage;

export async function uploadBase64ToFirebase(
  base64: string,
  refPath: string,
  contentType = '',
) {
  if (!storage) storage = getStorage();
  const PDFRef = ref(storage, refPath);

  // Convert base64 to a Buffer
  const buffer = Buffer.from(base64, 'base64');

  const metadata: UploadMetadata = {
    contentType: contentType,
  };

  // Upload the buffer to Firebase Storage
  const snapshot = await uploadBytes(PDFRef, buffer, metadata);
  console.log('Uploaded a blob or file!');
  return snapshot;
}

export const base64ToBlob = (base64: string, contentType = ''): Blob => {
  const byteCharacters = Buffer.from(base64, 'base64');
  return new Blob([byteCharacters], {type: contentType});
};
