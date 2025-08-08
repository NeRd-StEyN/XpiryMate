export const uploadToCloudinary = async (imageUri) => {
  const data = new FormData();
  data.append('file', {
    uri: imageUri,
    type: 'image/jpeg',
    name: 'profile.jpg',
  });
  data.append('upload_preset', 'unsigned_preset');

  const res = await fetch('https://api.cloudinary.com/v1_1/dwzvlijky/image/upload', {
    method: 'POST',
    body: data,
  });

  const result = await res.json();
  return result.secure_url;
};
