import { IfcViewerAPI } from "web-ifc-viewer";
import React from "react";



function selectionManager(viewer: IfcViewerAPI,
   setItemProperties :React.Dispatch<React.SetStateAction<Object>>) {
  window.ondblclick = async () => {
  
    if(viewer.dimensions.active === false){
      const selectedItem = await viewer.IFC.selector.pickIfcItem(true);
       if (selectedItem !== null) {
        const props = await viewer.IFC.getProperties(0, selectedItem.id, false);
        setItemProperties(props);
     
      }
  
      if (selectedItem === null) {
        viewer.IFC.selector.unpickIfcItems();
        setItemProperties(null);
      }
    }
    else {
     

 
      viewer.dimensions.create();
    }
   
  
    
  };
  window.onmousemove = async () => {
    if(viewer.dimensions.active === false){
    const preselectedItem = await viewer.IFC.selector.prePickIfcItem();
    if (preselectedItem === null) {
      viewer.IFC.selector.unPrepickIfcItems();
    }}
  };
}




export default selectionManager;
