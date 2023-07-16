import { useState } from "react";
import ReactCrop, { type Crop } from "react-image-crop";

import "react-image-crop/dist/ReactCrop.css";

export default function ReactImageCrop() {
  const src = require("../demo_img.png");
  const [crop, setCrop] = useState<Crop>();
  return (
    <ReactCrop crop={crop} onChange={(c) => setCrop(c)}>
      <img src={src} />
    </ReactCrop>
  );
}
