import { motion } from "framer-motion";
import React from "react";
import { CustomIcons } from "../../icons/_index";
import "../../css/Toolbar.css";

interface ToolbarProps {
  getRatio(): number;
  setRatio(newRatio: number): void;

  rotate(degree: number): void;
  clearSelection(): void;
  clearCanvas(): void;
}

interface ToolbarState {
  ratio: number;
}

class Toolbar extends React.Component<ToolbarProps, ToolbarState> {
  constructor(props: ToolbarProps) {
    super(props);
    this.state = {
      ratio: props.getRatio(),
    };
  }

  componentDidUpdate(
    prevProps: Readonly<ToolbarProps>,
    prevState: Readonly<ToolbarState>,
    snapshot?: any
  ): void {
    const { ratio } = this.state;
    const { ratio: prevRatio } = prevState;

    if (ratio != prevRatio) {
      this.props.setRatio(ratio);
    }
  }

  handleRatioUpdate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const ratio = parseInt(e.target.value) / 25;
    this.setState({ ratio });
  };

  handleScaleRatioReset = () => {
    const ratio = 1;
    this.setState({ ratio });
  };
  handleResetSelection = () => {
    this.props.clearSelection();
  };

  handleRotateRight = () => {
    this.props.rotate(90);
  };

  handleClearCanvas = () => {
    this.props.clearCanvas();
  };

  render() {
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
          value={this.state.ratio * 25}
          onChange={this.handleRatioUpdate}
        />
        <label htmlFor="radioSlider" onClick={this.handleScaleRatioReset}>
          Reset Zoom
        </label>

        <button className="btn-icon" onClick={this.handleResetSelection}>
          <img title="Reset Selection" className="icon" src={CustomIcons.Reset} alt="Reset" />
        </button>
        <button className="btn-icon" onClick={this.handleRotateRight}>
          <img
            title="Rotate Right"
            className="icon"
            src={CustomIcons.RotateRight}
            alt="Rotate-Right"
          />
        </button>
        <button id="rmImg" className="btn-icon hoverRed" onClick={this.handleClearCanvas}>
          <img title="Remove Image" className="icon" src={CustomIcons.Delete} alt="Remove Image" />
        </button>
      </motion.div>
    );
  }
}

export default Toolbar;
