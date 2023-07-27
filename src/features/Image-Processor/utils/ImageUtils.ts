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

  private drawRotatedImage(canvas: HTMLCanvasElement, image: HTMLImageElement, degrees: number): void {
    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("Unable to get 2D context from canvas.");
    }

    context.translate(canvas.width / 2, canvas.height / 2);
    context.rotate((degrees * Math.PI) / 180);
    context.drawImage(image, -image.width / 2, -image.height / 2);
    context.setTransform(1, 0, 0, 1, 0, 0); // Reset the transform
  }

  // Public Methods //
  // * * *
  public async rotateImage(imageUrl: string, degrees: number): Promise<string | undefined> {
    try {
      const image = await this.loadImage(imageUrl);

      const { width, height } = this.getRotatedImageDimensions(image, degrees);

      const canvas = this.createCanvas(width, height);

      this.drawRotatedImage(canvas, image, degrees);

      // Return the rotated image as a data URL
      return canvas.toDataURL();
    } catch (error) {
      console.error("Error rotating image:", error);
      return undefined;
    }
  }
}
