import { MeshLambertMaterial } from "three";
import { IfcViewerAPI } from "web-ifc-viewer";
import { Color } from "three";

function createViewer() : IfcViewerAPI   {
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
  
    const container = document.getElementById("viewer-container")!;
    const viewer = new IfcViewerAPI({
      container,
      backgroundColor: new Color(0xd3d3d3),
    });
    viewer.IFC.selector.preselection.material = preselectMat
    viewer.IFC.selector.selection.material = selectMat
    

  
    viewer.grid.setGrid();
    viewer.axes.setAxes();
  
    return viewer;
  }
  
export default createViewer