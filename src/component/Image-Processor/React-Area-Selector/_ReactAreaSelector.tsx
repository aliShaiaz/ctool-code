import {
  AreaSelector,
  IArea,
  IAreaRendererProps,
} from "@bmunozg/react-image-area";
import { useCallback, useEffect, useState } from "react";
import ContextMenu from "./ContextMenu";
import "../../../css/ReactAreaSelector.css";

type props = {
  image: string | undefined;
};

export default function ReactAreaSelector(porps: props) {
  const [areas, setAreas] = useState<IArea[]>([]);
  const [activeArea, setActiveArea] = useState<number | null>(null);

  const handleOnChange = (areas: IArea[]) => {
    setAreas(areas);
    setActiveArea(areas.length - 1);
  };

  const handleDelete = (areaNumber: number) => {
    const newAreas: IArea[] = areas.filter(
      (area, index) => index != areaNumber - 1
    );
    setAreas(newAreas);
  };

  function handleActiveArea(areaNumber: number) {
    setActiveArea(areaNumber);
  }

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
    <div id="react-area-selector">
      <AreaSelector
        areas={areas}
        onChange={handleOnChange}
        customAreaRenderer={customRender}
      >
        {porps.image && (
          <img id="selected-image" src={porps.image} alt="my image" />
        )}
      </AreaSelector>
    </div>
  );
}
