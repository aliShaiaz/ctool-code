import { CustomIcons } from "../../../icons/_index";
import "../styles/ContextMenu.css";
import { motion } from "framer-motion";
import { IAreaRendererProps } from "@bmunozg/react-image-area";

type props = {
  handleDelete(): void;
  info: IAreaRendererProps;
  downloadSelection(): void;
};

const ContextMenu = ({ handleDelete, info, downloadSelection }: props) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0 }}
      className="contextMenu"
    >
      <button className="btn-icon">
        <img title="Analyze" className="icon" src={CustomIcons.Analyze} alt="Analyze" />
      </button>
      <button className="btn-icon hoverRed" onClick={handleDelete}>
        <img title="Delete" className="icon" src={CustomIcons.Delete} alt="Delete" />
      </button>
      <button className="btn-icon" onClick={downloadSelection}>
        <img title="Download" className="icon" src={CustomIcons.Download} alt="Download" />
      </button>
      {/* <button
        className="btn-icon"
        onClick={() => {
          alert(
            info.x + "\n" + info.y + "\n" + info.height + "\n" + info.width
          );
        }}
      >
        <img
          title="Download"
          className="icon"
          src={CustomIcons.Download}
          alt="Download"
        />
      </button> */}
    </motion.div>
  );
};

export default ContextMenu;
