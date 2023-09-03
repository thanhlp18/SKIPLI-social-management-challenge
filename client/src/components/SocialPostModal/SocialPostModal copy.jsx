import React, { useState } from "react";
import { createFacebookPost, postToFacebook } from "../../api/socialApi";

function FacebookPostForm() {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);

  const handleCaptionChange = (e) => {
    setCaption(e.target.value);
  };

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    console.log(selectedImage);
    setImage(selectedImage);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Call the API function to post to Facebook
      const data = await createFacebookPost(image, caption, "+795442122");
      console.log(data);

      // Reset form fields or show a success caption
      setCaption("");
      setImage(null);
    } catch (error) {
      console.error("Failed to post to Facebook:", error);
      // Handle and display the error to the user
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="text-black">
        <label htmlFor="caption">Your caption:</label>
        <textarea
          id="caption"
          name="caption"
          value={caption}
          onChange={handleCaptionChange}
        />
      </div>
      <div>
        <label htmlFor="image">Your image:</label>
        <input
          type="file"
          id="image"
          name="image"
          accept="image/*"
          onChange={handleImageChange}
        />
      </div>
      <div>
        <button type="submit" className="text-black">
          Upload
        </button>
      </div>
    </form>
  );
}

export default FacebookPostForm;
