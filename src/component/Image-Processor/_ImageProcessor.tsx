import { useEffect, useState } from "react";
import ImgUploadBtn from "./ImgUploadBtn";

import "../../css/ImageProcessor.css";
import ReactAreaSelector from "./React-Area-Selector/_ReactAreaSelector";
import { PresenceContext, motion } from "framer-motion";
import { IArea } from "@bmunozg/react-image-area";
import Toolbar from "./React-Area-Selector/Toolbar";

const ImageProcessor = () => {
  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    undefined
  );
  const [scaledImage, setScaledImage] = useState<string | undefined>(undefined);
  const [scaleRatio, setScaleRatio] = useState<number>(1);
  const [areas, setAreas] = useState<IArea[]>([]);
  const [areasBackup, setAreasBackup] = useState<IArea[]>([]);

  // R & D Zone //
  async function rotateImage(
    imageUrl: string,
    degrees: number
  ): Promise<string | undefined> {
    try {
      const image = new Image();

      // Create a promise to resolve when the image has loaded
      const imageLoaded = new Promise<void>((resolve, reject) => {
        image.onload = () => resolve();
        image.onerror = (error) => reject(error);
      });

      // Set the source of the image to the selected image URL
      image.src = imageUrl;

      // Wait for the image to load
      await imageLoaded;

      // Create a canvas element
      const canvas = document.createElement("canvas");

      // Calculate the new dimensions after rotation
      const { width, height } = getRotatedImageDimensions(image, degrees);

      // Set the canvas dimensions
      canvas.width = width;
      canvas.height = height;

      // Draw the rotated image on the canvas
      const context = canvas.getContext("2d");

      if (context) {
        context.translate(canvas.width / 2, canvas.height / 2);
        context.rotate((degrees * Math.PI) / 180);
        context.drawImage(image, -image.width / 2, -image.height / 2);
        context.setTransform(1, 0, 0, 1, 0, 0); // Reset the transform
      } else {
        throw new Error("Unable to get 2D context from canvas.");
      }

      // Return the rotated image as a data URL
      return canvas.toDataURL();
    } catch (error) {
      console.error("Error rotating image:", error);
      return undefined;
    }
  }

  function getRotatedImageDimensions(
    image: HTMLImageElement,
    degrees: number
  ): { width: number; height: number } {
    const radians = (degrees * Math.PI) / 180;
    const sin = Math.abs(Math.sin(radians));
    const cos = Math.abs(Math.cos(radians));
    const newWidth = image.width * cos + image.height * sin;
    const newHeight = image.width * sin + image.height * cos;
    return { width: newWidth, height: newHeight };
  }

  async function handleRotate(degrees: number) {
    try {
      if (selectedImage) {
        const rotatedSelectedImage = await rotateImage(selectedImage, degrees);
        setSelectedImage(rotatedSelectedImage);
      }

      if (scaledImage) {
        const rotatedScaledImage = await rotateImage(scaledImage, degrees);
        setScaledImage(rotatedScaledImage);
      }
    } catch (error) {
      console.error("Error rotating images:", error);
    }
  }

  function handleResetSelection(): void {
    setAreas([]);
  }

  // . . . //

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>): void {
    // Default Actions on Image Load
    setScaleRatio(1);
    setAreas([]);
    // . . . //

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

  async function scaleSelections(
    selections: IArea[],
    scale: number
  ): Promise<IArea[]> {
    return selections.map((selection) => {
      return {
        ...selection,
        x: selection.x * scale,
        y: selection.y * scale,
        width: selection.width * scale,
        height: selection.height * scale,
      };
    });
  }

  async function handleSetAreas(newAreas: IArea[]): Promise<void> {
    // setScaledAreas(newAreas);
    // setAreas(await scaleSelections(newAreas, scaleRatio));

    setAreas(newAreas);
    setAreasBackup(await scaleSelections(newAreas, scaleRatio));
  }

  async function processImageRatio() {
    if (selectedImage) {
      try {
        const scale = scaleRatio; // Specify the desired scale factor

        // Call the scaleImage function with the selected image URL
        const scaledImage = await scaleImage(selectedImage!, scale);

        // Call the scaleSelection function with all selections 'areas' and the ratio
        const newScaledAreas: IArea[] = await scaleSelections(
          areasBackup,
          scale
        );

        // Update the state with the scaled image
        setScaledImage(scaledImage.toDataURL()); // Assuming you want to store the scaled image as a data URL
        setAreas(newScaledAreas);
      } catch (error) {
        console.error("Error scaling image:", error);
      }
    }
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

  function handleScaleRatioUpdate(newRatio: number) {
    setScaleRatio(newRatio);
  }
  function handleScaledRatioReset(): void {
    setScaleRatio(1);
  }

  // Call the function when the selected image changes
  useEffect(() => {
    processImageRatio();
  }, [selectedImage, scaleRatio]);

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
          <>
            <ReactAreaSelector
              image={scaledImage}
              downloadSelection={processSelectionCrop}
              areas={areas}
              setAreas={handleSetAreas}
            />
            <Toolbar
              scaleRatio={scaleRatio}
              setScaleRatio={setScaleRatio}
              handleScaleRatioUpdate={handleScaleRatioUpdate}
              handleScaleRatioReset={handleScaledRatioReset}
              handleResetSelection={handleResetSelection}
              handleRotate={handleRotate}
            />
          </>
        )}
      </motion.div>
    </>
  );
};

export default ImageProcessor;
