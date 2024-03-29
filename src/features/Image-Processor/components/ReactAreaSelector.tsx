import { AreaSelector, IArea, IAreaRendererProps } from "@bmunozg/react-image-area";
import { useCallback, useEffect, useState } from "react";
import ContextMenu from "./ContextMenu";
import "../styles/ReactAreaSelector.css";
import { motion } from "framer-motion";

type props = {
  image: string | undefined;
  downloadSelection(areaNumber: number): void;
  areas: IArea[];
  setAreas(areas: IArea[]): void;
};

export default function ReactAreaSelector({ image, downloadSelection, areas, setAreas }: props) {
  const [activeArea, setActiveArea] = useState<number | null>(null);
  const selectionMinWidth: number = 80;
  const selectionMinHeight: number = 40;

  const handleOnChange = (a: IArea[]) => {
    // console.log("Calling Selection OnChange");

    // DEFAULT ACTIONS AFTER MARKING AN AREA //

    // minHeight % minWeight check
    if (a[a.length - 1].height < selectionMinHeight) a[a.length - 1].height = selectionMinHeight;
    if (a[a.length - 1].width < selectionMinWidth) a[a.length - 1].width = selectionMinWidth;
    // . //

    // . . . //

    setAreas(a);
    if (a.length > areas.length) {
      setActiveArea(areas.length);
    }
  };

  function handleActiveArea(areaNumber: number): void {
    setActiveArea(areaNumber);
  }

  const handleDelete = (areaNumber: number): void => {
    const newAreas: IArea[] = areas.filter((area, index) => index != areaNumber - 1);
    setAreas(newAreas);
  };

  const customRender = (areaProps: IAreaRendererProps) => {
    // if (
    //   areaProps.height < selectionMinHeight ||
    //   areaProps.width > selectionMinWidth
    // ) {
    //   // handleDelete(areaProps.areaNumber);
    //   // return;
    //   // console.log(areas);
    //   areas[areaProps.areaNumber].height = selectionMinHeight;
    //   areas[areaProps.areaNumber].width = selectionMinWidth;
    // }

    // . . . //

    if (!areaProps.isChanging) {
      return (
        <div key={areaProps.areaNumber} className="selectedArea" onBlur={() => alert(100)}>
          <div className="blank" onClick={() => handleActiveArea(areaProps.areaNumber - 1)} />
          {areaProps.areaNumber - 1 === activeArea && (
            <ContextMenu
              handleDelete={() => handleDelete(areaProps.areaNumber)}
              info={areaProps}
              downloadSelection={() => downloadSelection(--areaProps.areaNumber)}
            />
          )}
        </div>
      );
    }
  };

  const escFunction = useCallback((event: any) => {
    if (event.key === "Escape") {
      //Do whatever when esc is pressed
      setActiveArea(null);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", escFunction, false);

    return () => {
      document.removeEventListener("keydown", escFunction, false);
    };
  }, [escFunction]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0 }}
      id="react-area-selector"
    >
      <div id="canvas">
        <AreaSelector
          areas={areas}
          globalAreaStyle={{
            border: "3.5px dashed gray",
            backgroundColor: "rgba(173, 216, 230, 0.4)",
          }}
          onChange={handleOnChange}
          customAreaRenderer={customRender}
        >
          {image && <img id="selected-image" src={image} alt="my image" />}
        </AreaSelector>
      </div>
    </motion.div>
  );
}
