import { motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

interface CustomSliderProps {
  min: number;
  max: number;
}

export default function CustomSlider(props: CustomSliderProps) {
  const [temp, setTemp] = useState(0);
  const x = useMotionValue(0);
  const xInput = [-45, 0, 45];
  const variable = useTransform(x, xInput, [
    () => {
      alert(x);
    },
    () => {
      setTemp(0);
    },
    () => {
      setTemp(45);
    },
  ]);

  const color = useTransform(x, xInput, ["rgb(211, 9, 225)", "rgb(68, 0, 255)", "rgb(3, 209, 0)"]);
  const tickPath = useTransform(x, [10, 100], [0, 1]);
  const crossPathA = useTransform(x, [-10, -55], [0, 1]);
  const crossPathB = useTransform(x, [-50, -100], [0, 1]);

  useEffect(() => {
    return console.log(variable);
  }, [variable]);

  return (
    <motion.div className="custom-slider" style={{}}>
      <motion.div className="box" style={{ x }} drag="x" dragConstraints={{ left: 0, right: 0 }}>
        <svg className="progress-icon" viewBox="0 0 50 50">
          <motion.path
            fill="none"
            strokeWidth="2"
            stroke={color}
            d="M 0, 20 a 20, 20 0 1,0 40,0 a 20, 20 0 1,0 -40,0"
            style={{ translateX: 5, translateY: 5 }}
          />

          <motion.path
            fill="none"
            strokeWidth="2"
            stroke={color}
            d="M 36 25.25 L 18 12"
            strokeDasharray="0 1"
            style={{ pathLength: tickPath }}
          />
          <motion.path
            fill="none"
            strokeWidth="2"
            stroke={color}
            d="M 36 24.75 L 18 38"
            strokeDasharray="0 1"
            style={{ pathLength: tickPath }}
          />

          <motion.path
            fill="none"
            strokeWidth="2"
            stroke={color}
            d="M 14 25.25 L 32 12"
            strokeDasharray="0 1"
            style={{ pathLength: crossPathA }}
          />
          <motion.path
            fill="none"
            strokeWidth="2"
            stroke={color}
            d="M 14 24.75 L 32 38"
            strokeDasharray="0 1"
            style={{ pathLength: crossPathA }}
          />
        </svg>
      </motion.div>
    </motion.div>
  );
}
