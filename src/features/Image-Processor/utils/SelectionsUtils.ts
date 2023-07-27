import { IArea } from "@bmunozg/react-image-area";

export default class SelectionsUtils {
  constructor() {}

  private async scaleItem(selection: IArea, scale: number): Promise<IArea> {
    return {
      ...selection,
      x: selection.x * scale,
      y: selection.y * scale,
      width: selection.width * scale,
      height: selection.height * scale,
    };
  }

  // Overloaded function signatures
  public async scale(selection: IArea, scale: number): Promise<IArea>;
  public async scale(selections: IArea[], scale: number): Promise<IArea[]>;
  public async scale(selections: IArea[] | IArea, scale: number): Promise<IArea[] | IArea> {
    return Array.isArray(selections)
      ? await Promise.all(selections.map((selection) => this.scaleItem(selection, scale)))
      : await this.scaleItem(selections, scale);
  }

  public async find(selections: IArea[], selectionNumber: number): Promise<IArea | null> {
    const foundSelection: IArea | undefined = selections.find((selection, index) => index === selectionNumber);
    return foundSelection ? foundSelection : null;
  }
}
