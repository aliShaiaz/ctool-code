export default class ImageUtils {
  constructor() {}

  private loadImage(imageUrl: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = (error) => reject(error);
      image.src = imageUrl;
    });
  }

  private getRotatedImageDimensions(image: HTMLImageElement, degrees: number): { width: number; height: number } {
    const radians = (degrees * Math.PI) / 180;
    const sin = Math.abs(Math.sin(radians));
    const cos = Math.abs(Math.cos(radians));
    const newWidth = image.width * cos + image.height * sin;
    const newHeight = image.width * sin + image.height * cos;
    return { width: newWidth, height: newHeight };
  }

  private createCanvas(width: number, height: number): HTMLCanvasElement {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    return canvas;
  }

  private drawImage(
    canvas: HTMLCanvasElement,
    image: HTMLImageElement,
    x: number,
    y: number,
    width: number,
    height: number,
    degrees: number
  ): void {
    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("Unable to get 2D context from canvas.");
    }

    context.translate(canvas.width / 2, canvas.height / 2);
    context.rotate((degrees * Math.PI) / 180);
    context.drawImage(image, x, y, width, height, -width / 2, -height / 2, width, height);
    context.setTransform(1, 0, 0, 1, 0, 0); // Reset the transform
  }

  // Public Methods //
  // * * *

  public async rotate(imageUrl: string, degrees: number): Promise<string | undefined> {
    try {
      const image = await this.loadImage(imageUrl);
      const { width, height } = this.getRotatedImageDimensions(image, degrees);
      const canvas = this.createCanvas(width, height);
      this.drawImage(canvas, image, 0, 0, image.width, image.height, degrees);
      // Return the rotated image as a data URL
      return canvas.toDataURL();
    } catch (error) {
      console.error("Error rotating image:", error);
      return undefined;
    }
  }

  public async scale(selectedImage: string, scale: number): Promise<HTMLCanvasElement | undefined> {
    try {
      // Load the image
      const image = await this.loadImage(selectedImage);
      // Calculate the scaled dimensions
      const scaledWidth = image.width * scale;
      const scaledHeight = image.height * scale;
      // Create a canvas element
      const canvas = this.createCanvas(scaledWidth, scaledHeight);
      // Draw the scaled image on the canvas
      const context = canvas.getContext("2d");
      if (!context) {
        throw new Error("Unable to get 2D context from canvas.");
      }
      context.drawImage(image, 0, 0, scaledWidth, scaledHeight);
      // Return the scaled image as a canvas element
      return canvas;
    } catch (error) {
      console.error("Error scaling image:", error);
      return undefined;
    }
  }

  public async crop(image: string, x: number, y: number, width: number, height: number): Promise<Blob> {
    try {
      // Load the image
      const newImage = await this.loadImage(image);
      // Create a canvas element
      const canvas = this.createCanvas(width, height);
      // Draw the cropped image on the canvas
      this.drawImage(canvas, newImage, x, y, width, height, 0);
      // Convert the canvas to a Blob and return it
      return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Unable to create Blob."));
          }
        });
      });
    } catch (error) {
      console.error("Error downloading cropped image:", error);
      throw error; // Propagate the error to the caller
    }
  }
}
