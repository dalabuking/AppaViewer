import IFCModel from "web-ifc-three/IFC/components/IFCModel";
import { IfcViewerAPI } from "web-ifc-viewer";
import { MeshLambertMaterial } from "three";

export function togglePickable(
  viewer: IfcViewerAPI,
  mesh: any,
  isPickable: Boolean
) {
  const pickable = viewer.context.items.pickableIfcModels;
  

  if (isPickable) {
    pickable.push(mesh);
  } else {
    const index = pickable.indexOf(mesh);
    pickable.splice(index, 1);
  }
}


export function toggleAllMeshPickable(
  isMaterial : Boolean,
  viewer: IfcViewerAPI,
){

  const preselectMat = new MeshLambertMaterial({
    transparent: true,
    opacity: 0.6,
    color: 0xade6d8,
    depthTest: false,
  });

  const selectMat = new MeshLambertMaterial({
    transparent: true,
    opacity: 0.6,
    color: 0x00008b,
    depthTest: false,
  });

  if (isMaterial) {
    viewer.IFC.selector.preselection.material = preselectMat
    viewer.IFC.selector.selection.material = selectMat
  }
  else {
    viewer.IFC.selector.preselection.material = null
    viewer.IFC.selector.selection.material = null

  }


}
