import { motion } from "framer-motion";
import "../../css/ImgUploadBtn.css";

type props = {
  handleChange(event: React.ChangeEvent<HTMLInputElement>): void;
  trigger: boolean;
};

const ImgUploadBtn = ({ handleChange, trigger }: props) => {
  interface Styles {
    // Define your styles here
    width: string;
    height: string;
    display: string;
    alignItems: string;
    justifyContent: string;
  }
  const styles: Styles = {
    width: "100vw",
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  interface Styles2 {
    // Define your styles here
    top: string;
    left: string;
  }

  const styles2: Styles2 = {
    top: "20px",
    left: "20px",
  };

  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      animate={
        !trigger
          ? {
              scale: [1, 2, 2, 1, 1],
              rotate: [0, 0, 270, 270, 0],
              borderRadius: ["20%", "20%", "50%", "50%", "20%"],
            }
          : { opacity: 1, scale: 1 }
      }
      initial={trigger ? { opacity: 0, scale: 0 } : {}}
      exit={trigger ? { opacity: 0, scale: 0 } : {}}
      id="img-upload-btn"
      style={trigger ? styles2 : styles}
    >
      <input
        className="imgUpload"
        id="imgUpload"
        type="file"
        accept="image/*"
        onChange={handleChange}
      />
      <label htmlFor="imgUpload">Load Image</label>
    </motion.div>
  );
};

export default ImgUploadBtn;
