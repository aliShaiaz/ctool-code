import { CustomIcons } from "../../../icons/_index";
import "../../../css/ContextMenu.css";
import { motion } from "framer-motion";

type props = {
  handleDelete(): void;
  info: object;
  downloadSelection(): void;
};

const ContextMenu = ({ handleDelete, info, downloadSelection }: props) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="contextMenu"
    >
      <button className="btn-icon">
        <img
          title="Analyze"
          className="icon"
          src={CustomIcons.Analyze}
          alt="Analyze"
        />
      </button>
      <button className="btn-icon" onClick={handleDelete}>
        <img
          title="Delete"
          className="icon"
          src={CustomIcons.Delete}
          alt="Delete"
        />
      </button>
      <button className="btn-icon" onClick={downloadSelection}>
        <img
          title="Download"
          className="icon"
          src={CustomIcons.Download}
          alt="Download"
        />
      </button>
    </motion.div>
  );
};

export default ContextMenu;
