import { CustomIcons } from "../../../files/_index";
import "../../../css/ContextMenu.css";

type props = {
  handleDelete(): void;
  info: object;
  downloadSelection(): void;
};

const ContextMenu = ({ handleDelete, info, downloadSelection }: props) => {
  return (
    <div className="contextMenu">
      <button className="btn-icon">
        <img className="icon" src={CustomIcons.Analyze} alt="Analyze" />
      </button>
      <button className="btn-icon" onClick={handleDelete}>
        <img className="icon" src={CustomIcons.Delete} alt="Delete" />
      </button>
      {/* <button className="btn-icon" onClick={() => console.log(info)}> */}
      <button className="btn-icon" onClick={downloadSelection}>
        <img className="icon" src={CustomIcons.Download} alt="Delete" />
      </button>
    </div>
  );
};

export default ContextMenu;
