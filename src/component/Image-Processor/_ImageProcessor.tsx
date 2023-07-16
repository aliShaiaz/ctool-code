import { useState } from "react";
import ImgUploadBtn from "./ImgUploadBtn";

import "../../css/ImageProcessor.css";
import ReactAreaSelector from "./React-Area-Selector/_ReactAreaSelector";

const ImageProcessor = () => {
  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    undefined
  );
  const [scaledImage, setScaledImage] = useState<string | undefined>(undefined);

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const file = event.target.files?.[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setScaledImage(e.target?.result as string);
      };

      reader.readAsDataURL(file);
    }
  }

  return (
    <>
      <div id="image-processor">
        <ImgUploadBtn handleChange={handleImageChange} />
        <ReactAreaSelector image={selectedImage} />
      </div>
    </>
  );
};

export default ImageProcessor;
