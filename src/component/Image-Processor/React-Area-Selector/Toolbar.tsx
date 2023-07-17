import { CustomIcons } from "../../../icons/_index";
import "../../../css/Toolbar.css";
import { motion } from "framer-motion";

type props = {
  scaleRatio: number;
  setScaleRatio(n: number): void;
  handleScaleRatioUpdate(newRatio: number): void;
  handleResetSelection(): void;
  handleRotate(degree: number): void;
  handleScaleRatioReset(): void;
  handleClearCanvas(): void;
};
const Toolbar = ({
  scaleRatio,
  setScaleRatio,
  handleScaleRatioUpdate,
  handleResetSelection,
  handleRotate,
  handleScaleRatioReset,
  handleClearCanvas,
}: props) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5 }}
      id="toolbar"
    >
      <input
        type="range"
        id="ratioSlider"
        min="1"
        max="75"
        value={scaleRatio * 25}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          handleScaleRatioUpdate(parseInt(e.target.value) / 25)
        }
      />
      <label htmlFor="radioSlider" onClick={handleScaleRatioReset}>
        Reset Zoom
      </label>

      <button className="btn-icon" onClick={handleResetSelection}>
        <img
          title="Reset Selection"
          className="icon"
          src={CustomIcons.Reset}
          alt="Reset"
        />
      </button>
      <button className="btn-icon" onClick={() => handleRotate(90)}>
        <img
          title="Rotate Right"
          className="icon"
          src={CustomIcons.RotateRight}
          alt="Rotate-Right"
        />
      </button>
      <button className="btn-icon" onClick={handleClearCanvas}>
        <img
          title="Remove Image"
          className="icon"
          src={CustomIcons.Delete}
          alt="Remove Image"
        />
      </button>
    </motion.div>
  );
};

export default Toolbar;
