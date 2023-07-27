import { useEffect, useState } from "react";
import ImgUploadBtn from "./components/ImgUploadBtn";

import ReactAreaSelector from "./components/ReactAreaSelector";
import { motion } from "framer-motion";
import { IArea } from "@bmunozg/react-image-area";
import Toolbar from "./components/Toolbar";
import ImageUtils from "./utils/ImageUtils";

import "./styles/ImageProcessor.css";

const ImageProcessor = () => {
  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);
  const [scaledImage, setScaledImage] = useState<string | undefined>(undefined);
  const [scaleRatio, setScaleRatio] = useState<number>(1);
  const [areas, setAreas] = useState<IArea[]>([]);
  const [areasBackup, setAreasBackup] = useState<IArea[]>([]);
  const [degree, setDegree] = useState<number>(0);

  const imageUtil = new ImageUtils();

  function view_scaleRatio(): number {
    return scaleRatio;
  }
  function update_scaleRatio(newRatio: number): void {
    setScaleRatio(newRatio);
  }
  function view_degree(): number {
    return degree;
  }
  function update_degree(newDegree: number): void {
    setDegree(newDegree);
  }

  async function rotate90() {
    if (selectedImage)
      try {
        const promises: Promise<string | undefined>[] = [];

        promises.push(imageUtil.rotateImage(selectedImage, 90));
        if (scaledImage) {
          promises.push(imageUtil.rotateImage(scaledImage, 90));
        }

        const [rotatedSelectedImage, rotatedScaledImage] = await Promise.all(promises);

        // Handle rotatedSelectedImage and rotatedScaledImage updates
        if (rotatedSelectedImage) {
          setSelectedImage(rotatedSelectedImage);
        }
        if (rotatedScaledImage) {
          setScaledImage(rotatedScaledImage);
        }
      } catch (error) {
        console.error("Error rotating 90 deg right: ", error);
      }
  }

  async function rotate(degrees: number) {
    if (selectedImage) {
      try {
        setScaledImage(await imageUtil.rotateImage(selectedImage, degrees));
      } catch (error) {
        console.error("Error rotating:", error);
      }
    }
  }

  function clearSelection(): void {
    setAreas([]);
  }
  function clearCanvas(): void {
    setScaledImage(undefined);
    setSelectedImage(undefined);
    setScaleRatio(1);
    setAreas([]);
    setAreasBackup([]);
  }

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>): void {
    // Default Actions on Image Load
    clearCanvas();
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

  // To Optimize // // // // // // // // //
  async function scaleImage(selectedImage: string, scale: number): Promise<HTMLCanvasElement> {
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
    if (selectedImage) {
      try {
        const scale = scaleRatio; // Specify the desired scale factor

        // Call the scaleImage function with the selected image URL
        const scaledImage = await scaleImage(selectedImage!, scale);

        // Call the scaleSelection function with all selections 'areas' and the ratio
        const newScaledAreas: IArea[] = await scaleSelections(areasBackup, scale);

        // Update the state with the scaled image
        setScaledImage(scaledImage.toDataURL()); // Assuming you want to store the scaled image as a data URL
        setAreas(newScaledAreas);
      } catch (error) {
        console.error("Error scaling image:", error);
      }
    }
  }

  async function scaleSelections(selections: IArea[], scale: number): Promise<IArea[]> {
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
    setAreas(newAreas);
    setAreasBackup(await scaleSelections(newAreas, scaleRatio));
  }

  async function processSelectionCrop(x: number, y: number, width: number, height: number) {
    try {
      // Call the downloadCroppedImage function with the selected image URL and crop parameters
      const newImage: string | undefined = scaledImage && (await imageUtil.rotateImage(scaledImage, degree));
      const croppedImageBlob = await downloadCroppedImage(
        newImage!,
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

  // Call the function when the selectedImage or Ratio changes //
  useEffect(() => {
    processImageRatio();
  }, [selectedImage, scaleRatio]);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0 }}
        id="image-processor"
      >
        {!selectedImage ? (
          <ImgUploadBtn handleChange={handleImageChange} trigger={false} />
        ) : (
          <>
            <ImgUploadBtn handleChange={handleImageChange} trigger={true} />
            <ReactAreaSelector
              image={scaledImage}
              downloadSelection={processSelectionCrop}
              areas={areas}
              setAreas={handleSetAreas}
            />

            <Toolbar
              getRatio={view_scaleRatio}
              setRatio={update_scaleRatio}
              getDegree={view_degree}
              setDegree={update_degree}
              rotate={rotate}
              rotate90={rotate90}
              clearSelection={clearSelection}
              clearCanvas={clearCanvas}
            />
          </>
        )}
      </motion.div>
    </>
  );
};

export default ImageProcessor;
