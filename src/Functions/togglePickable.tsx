import IFCModel from "web-ifc-three/IFC/components/IFCModel";
import { IfcViewerAPI } from "web-ifc-viewer";

export function togglePickable(
  viewer: IfcViewerAPI,
  mesh: any,
  isPicable: Boolean
) {
  const pickable = viewer.context.items.pickableIfcModels;
  

  if (isPicable) {
    pickable.push(mesh);
  } else {
    const index = pickable.indexOf(mesh);
    pickable.splice(index, 1);
  }
}
