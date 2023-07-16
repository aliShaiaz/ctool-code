import "../../css/ImgUploadBtn.css";
import { CustomIcons } from "../../files/_index";

type props = {
  handleChange(event: React.ChangeEvent<HTMLInputElement>): void;
};

const ImgUploadBtn = (props: props) => {
  return (
    <div id="img-upload-btn">
      <input
        className="imgUpload"
        id="imgUpload"
        type="file"
        accept="image/*"
        onChange={props.handleChange}
      />
      <label htmlFor="imgUpload">Load Image</label>
    </div>
  );
};

export default ImgUploadBtn;
