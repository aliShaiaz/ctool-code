import {
  AreaSelector,
  IArea,
  IAreaRendererProps,
} from "@bmunozg/react-image-area";
import { useCallback, useEffect, useState } from "react";
import ContextMenu from "./ContextMenu";
import "../../../css/ReactAreaSelector.css";
import { motion } from "framer-motion";

type props = {
  image: string | undefined;
  downloadSelection(x: number, y: number, width: number, height: number): void;
};

export default function ReactAreaSelector(porps: props) {
  const [areas, setAreas] = useState<IArea[]>([]);
  const [activeArea, setActiveArea] = useState<number | null>(null);

  const handleOnChange = (a: IArea[]) => {
    setAreas(a);
    if (a.length > areas.length) {
      setActiveArea(areas.length);
    }
  };

  function handleActiveArea(areaNumber: number): void {
    setActiveArea(areaNumber);
  }

  const handleDelete = (areaNumber: number): void => {
    const newAreas: IArea[] = areas.filter(
      (area, index) => index != areaNumber - 1
    );
    setAreas(newAreas);
  };

  const customRender = (areaProps: IAreaRendererProps) => {
    if (!areaProps.isChanging) {
      return (
        <div
          key={areaProps.areaNumber}
          className="selectedArea"
          onBlur={() => alert(100)}
        >
          <div
            className="blank"
            onClick={() => handleActiveArea(areaProps.areaNumber - 1)}
          />
          {areaProps.areaNumber - 1 === activeArea && (
            <ContextMenu
              handleDelete={() => handleDelete(areaProps.areaNumber)}
              info={areaProps}
              downloadSelection={() =>
                porps.downloadSelection(
                  areaProps.x,
                  areaProps.y,
                  areaProps.width,
                  areaProps.height
                )
              }
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      id="react-area-selector"
    >
      <AreaSelector
        areas={areas}
        onChange={handleOnChange}
        customAreaRenderer={customRender}
      >
        {porps.image && (
          <img id="selected-image" src={porps.image} alt="my image" />
        )}
      </AreaSelector>
    </motion.div>
  );
}
