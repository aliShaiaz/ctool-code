import { motion } from "framer-motion";
import "../../css/ImgUploadBtn.css";
import { CustomIcons } from "../../icons/_index";

type props = {
  handleChange(event: React.ChangeEvent<HTMLInputElement>): void;
};

const ImgUploadBtn = (props: props) => {
  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      id="img-upload-btn"
    >
      <input
        className="imgUpload"
        id="imgUpload"
        type="file"
        accept="image/*"
        onChange={props.handleChange}
      />
      <label htmlFor="imgUpload">Load Image</label>
    </motion.div>
  );
};

export default ImgUploadBtn;
