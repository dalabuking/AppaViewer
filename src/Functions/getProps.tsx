
import { IfcViewerAPI } from "web-ifc-viewer";


export async function getProps(viewer : IfcViewerAPI, expressID : number){
        const props = await viewer.IFC.getProperties(0, expressID, false);
  
        return props
}