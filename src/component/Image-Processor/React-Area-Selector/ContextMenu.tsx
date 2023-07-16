import { CustomIcons } from "../../../files/_index";
import "../../../css/ContextMenu.css";

const ContextMenu = ({ handleDelete }: any) => {
  return (
    <div className="contextMenu">
      <button className="btn-icon">
        <img className="icon" src={CustomIcons.Analyze} alt="Analyze" />
      </button>
      <button className="btn-icon" onClick={handleDelete}>
        <img className="icon" src={CustomIcons.Delete} alt="Delete" />
      </button>
      <button className="btn-icon">
        <img className="icon" src={CustomIcons.View} alt="Delete" />
      </button>
    </div>
  );
};

export default ContextMenu;
