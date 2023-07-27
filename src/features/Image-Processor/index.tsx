import { useEffect, useState } from "react";
import ImgUploadBtn from "./components/ImgUploadBtn";

import ReactAreaSelector from "./components/ReactAreaSelector";
import { motion } from "framer-motion";
import { IArea } from "@bmunozg/react-image-area";
import Toolbar from "./components/Toolbar";
import ImageUtils from "./utils/ImageUtils";

import "./styles/ImageProcessor.css";
import SelectionsUtils from "./utils/SelectionsUtils";

const ImageProcessor = () => {
  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);
  const [scaledImage, setScaledImage] = useState<string | undefined>(undefined);
  const [scaleRatio, setScaleRatio] = useState<number>(1);
  const [areas, setAreas] = useState<IArea[]>([]);
  const [areasBackup, setAreasBackup] = useState<IArea[]>([]);
  const [degree, setDegree] = useState<number>(0);

  const imageUtil = new ImageUtils();
  const selectionUtil = new SelectionsUtils();

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

        promises.push(imageUtil.rotate(selectedImage, 90));
        if (scaledImage) {
          promises.push(imageUtil.rotate(scaledImage, 90));
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
        setScaledImage(await imageUtil.rotate(selectedImage, degrees));
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

  // scaleImage //

  async function processImageRatio() {
    if (selectedImage) {
      try {
        const scale = scaleRatio; // Specify the desired scale factor

        // Call the scaleImage function with the selected image URL
        const scaledImage = await imageUtil.scale(selectedImage!, scale);

        // Call the scaleSelection function with all selections 'areas' and the ratio
        const newScaledAreas: IArea[] = await selectionUtil.scale(areasBackup, scale);

        // Update the state with the scaled image
        setScaledImage(scaledImage!.toDataURL()); // Assuming you want to store the scaled image as a data URL
        setAreas(newScaledAreas);
      } catch (error) {
        console.error("Error scaling image:", error);
      }
    }
  }

  async function handleSetAreas(newAreas: IArea[]): Promise<void> {
    setAreas(newAreas);
    setAreasBackup(await selectionUtil.scale(newAreas, scaleRatio));
  }

  async function processSelectionCrop(areaNumber: number) {
    try {
      const isSelection: IArea | null = await selectionUtil.find(areasBackup, areaNumber);

      if (isSelection && selectedImage) {
        // Downscale the selection
        const selection: IArea | undefined = await selectionUtil.scale(isSelection, scaleRatio);
        // Load Original Uploaded Image
        const image: string | undefined = await imageUtil.rotate(selectedImage, degree);

        if (selection && image) {
          const croppedImageBlob = await imageUtil.crop(
            image,
            selection.x,
            selection.y,
            selection.width,
            selection.height
          );

          // Create a download link element
          const downloadLink = document.createElement("a");
          downloadLink.href = URL.createObjectURL(croppedImageBlob);
          downloadLink.download = "cropped_image.png";

          // Programmatically click the download link
          downloadLink.click();

          // Clean up the object URL after the download has started
          URL.revokeObjectURL(downloadLink.href);
        }
      }
    } catch (error) {
      console.error("Error cropping image:", error);
    }
  }

  // function downloadCroppedImage(
  //   selectedImage: string,
  //   x: number,
  //   y: number,
  //   width: number,
  //   height: number
  // ): Promise<Blob> {
  //   return new Promise((resolve, reject) => {
  //     const image = new Image();

  //     image.onload = () => {
  //       const canvas = document.createElement("canvas");
  //       canvas.width = width;
  //       canvas.height = height;

  //       const context = canvas.getContext("2d");
  //       if (context) {
  //         context.drawImage(image, x, y, width, height, 0, 0, width, height);
  //         canvas.toBlob((blob) => {
  //           if (blob) {
  //             resolve(blob);
  //           } else {
  //             reject(new Error("Unable to create Blob."));
  //           }
  //         });
  //       } else {
  //         reject(new Error("Unable to get 2D context from canvas."));
  //       }
  //     };

  //     image.onerror = (error) => reject(error);

  //     image.src = selectedImage;
  //   });
  // }

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
