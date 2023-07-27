import { motion } from "framer-motion";
import React from "react";
import { CustomIcons } from "../../../icons/_index";
import "../styles/Toolbar.css";

interface ToolbarProps {
  getRatio(): number;
  setRatio(newRatio: number): void;
  getDegree(): number;
  setDegree(newRatio: number): void;

  rotate(degree: number): void;
  clearSelection(): void;
  clearCanvas(): void;
}

interface ToolbarState {
  ratio: number;
  degree: number;
}

class Toolbar extends React.Component<ToolbarProps, ToolbarState> {
  constructor(props: ToolbarProps) {
    super(props);
    this.state = {
      ratio: props.getRatio(),
      degree: props.getDegree(),
    };
  }

  componentDidUpdate(
    prevProps: Readonly<ToolbarProps>,
    prevState: Readonly<ToolbarState>,
    snapshot?: any
  ) {
    const { ratio, degree } = this.state;
    const { ratio: prevRatio, degree: prevDegree } = prevState;

    // Ratio Monitoring //
    if (ratio != prevRatio) {
      this.props.setRatio(ratio);
    }
    // . . . //

    // Rotation Monitoring //
    if (degree != prevDegree) {
      console.log(degree);
      this.props.rotate(degree);
      // this.setState({ degree: 0 });
    }
    // . . . //
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

  handleRotationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const degree = parseInt(e.target.value);
    this.setState({ degree });
  };
  handleRotationReset = () => {
    this.setState({ degree: 0 });
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

        <div>
          <button
            className="btn-icon"
            onClick={() => {
              const { degree } = this.state;
              this.setState({ degree: degree + 1 });
            }}
          >
            +
          </button>
          <input
            id="imageRotationDial"
            type="range"
            min={-45}
            max={45}
            step={1}
            value={this.state.degree}
            onChange={this.handleRotationChange}
          />
          <button
            className="btn-icon"
            onClick={() => {
              const { degree } = this.state;
              this.setState({ degree: degree - 1 });
            }}
          >
            -
          </button>
        </div>
        <label htmlFor="imageRotationDial" onClick={this.handleRotationReset}>
          Reset
        </label>
      </motion.div>
    );
  }
}

export default Toolbar;
