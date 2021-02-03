import * as firebase from 'firebase';
/**
 * Upload the image to the specific firebase path
 * @param {String} uri Uri of the image
 * @param {String} name Name of the image
 * @param {String} firebasePath Firebase image path to store
 */
export default async function uploadImage (uri, name, firebasePath) {
  const response = await fetch(uri);
  const blob = await response.blob();
  
  const imageRef = firebase.storage().ref().child(`${firebasePath}/${name}`)

  await imageRef.put(blob).catch((error) => { throw error })
  
  const url = await imageRef.getDownloadURL().catch((error) => { throw error });
  return url
}