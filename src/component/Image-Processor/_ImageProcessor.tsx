import { EventHandler, useEffect, useState } from "react";
import ImgUploadBtn from "./ImgUploadBtn";

import "../../css/ImageProcessor.css";
import ReactAreaSelector from "./React-Area-Selector/_ReactAreaSelector";
import { motion } from "framer-motion";

const ImageProcessor = () => {
  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    undefined
  );
  const [scaledImage, setScaledImage] = useState<string | undefined>(undefined);
  const [scaleRatio, setScaleRatio] = useState<number>(1);

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>): void {
    setScaleRatio(1);
    const file = event.target.files?.[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };

      reader.readAsDataURL(file);
    }
  }

  async function scaleImage(
    selectedImage: string,
    scale: number
  ): Promise<HTMLCanvasElement> {
    // Create a new image element
    const image = new Image();

    // Create a promise to resolve when the image has loaded
    const imageLoaded = new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = (error) => reject(error);
    });

    // Set the source of the image to the selected image URL
    image.src = selectedImage;

    // Wait for the image to load
    await imageLoaded;

    // Create a canvas element
    const canvas = document.createElement("canvas");

    // Calculate the scaled dimensions
    const scaledWidth = image.width * scale;
    const scaledHeight = image.height * scale;

    // Set the canvas dimensions
    canvas.width = scaledWidth;
    canvas.height = scaledHeight;

    // Draw the scaled image on the canvas
    const context = canvas.getContext("2d");

    if (context) {
      context.drawImage(image, 0, 0, scaledWidth, scaledHeight);
    } else {
      throw new Error("Unable to get 2D context from canvas.");
    }

    // Return the scaled image as a canvas element
    return canvas;
  }
  async function processImageRatio() {
    try {
      const scale = scaleRatio; // Specify the desired scale factor

      // Call the scaleImage function with the selected image URL
      const scaledImage = await scaleImage(selectedImage!, scale);

      // Update the state with the scaled image
      setScaledImage(scaledImage.toDataURL()); // Assuming you want to store the scaled image as a data URL
    } catch (error) {
      console.error("Error scaling image:", error);
    }
  }

  // async function cropImage(
  //   selectedImage: string,
  //   x: number,
  //   y: number,
  //   width: number,
  //   height: number
  // ): Promise<HTMLCanvasElement> {
  //   // Create a new image element
  //   const image = new Image();

  //   // Create a promise to resolve when the image has loaded
  //   const imageLoaded = new Promise<void>((resolve, reject) => {
  //     image.onload = () => resolve();
  //     image.onerror = (error) => reject(error);
  //   });

  //   // Set the source of the image to the selected image URL
  //   image.src = selectedImage;

  //   // Wait for the image to load
  //   await imageLoaded;

  //   // Create a canvas element
  //   const canvas = document.createElement("canvas");

  //   // Set the canvas dimensions to the cropped size
  //   canvas.width = width;
  //   canvas.height = height;

  //   // Draw the cropped image on the canvas
  //   const context = canvas.getContext("2d");
  //   if (context) {
  //     context.drawImage(image, x, y, width, height, 0, 0, width, height);
  //   } else {
  //     throw new Error("Unable to get 2D context from canvas.");
  //   }

  //   // Return the cropped image as a canvas element
  //   return canvas;
  // }

  function downloadCroppedImage(
    selectedImage: string,
    x: number,
    y: number,
    width: number,
    height: number
  ): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const image = new Image();

      image.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const context = canvas.getContext("2d");
        if (context) {
          context.drawImage(image, x, y, width, height, 0, 0, width, height);
          canvas.toBlob((blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error("Unable to create Blob."));
            }
          });
        } else {
          reject(new Error("Unable to get 2D context from canvas."));
        }
      };

      image.onerror = (error) => reject(error);

      image.src = selectedImage;
    });
  }

  async function processSelectionCrop(
    x: number,
    y: number,
    width: number,
    height: number
  ) {
    try {
      // const x = 100; // X-coordinate of the top-left corner of the cropped area
      // const y = 100; // Y-coordinate of the top-left corner of the cropped area
      // const width = 200; // Width of the cropped area
      // const height = 150; // Height of the cropped area

      // Call the downloadCroppedImage function with the selected image URL and crop parameters
      const croppedImageBlob = await downloadCroppedImage(
        selectedImage!,
        x / scaleRatio,
        y / scaleRatio,
        width / scaleRatio,
        height / scaleRatio
      );

      // Create a download link element
      const downloadLink = document.createElement("a");
      downloadLink.href = URL.createObjectURL(croppedImageBlob);
      downloadLink.download = "cropped_image.png";

      // Programmatically click the download link
      downloadLink.click();

      // Clean up the object URL after the download has started
      URL.revokeObjectURL(downloadLink.href);

      // Update the state with the cropped image
      // setScaledImage(croppedImage.toDataURL()); // Assuming you want to store the cropped image as a data URL
    } catch (error) {
      console.error("Error cropping image:", error);
    }
  }

  // Call the function when the selected image changes
  useEffect(() => {
    if (selectedImage) {
      processImageRatio();
      // processSelectionCrop();
    }
  }, [selectedImage]);

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        id="image-processor"
      >
        <ImgUploadBtn handleChange={handleImageChange} />
        {selectedImage && (
          <ReactAreaSelector
            image={scaledImage}
            downloadSelection={processSelectionCrop}
          />
        )}
        <input
          type="range"
          id="ratioSlider"
          min="1"
          max="75"
          value={scaleRatio * 25}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setScaleRatio(parseInt(e.target.value) / 25);
            processImageRatio();
          }}
        />
      </motion.div>
    </>
  );
};

export default ImageProcessor;
