import { TreeButton } from "../TreeButton";
import React from "react";
import { IfcViewerAPI } from "web-ifc-viewer";
import { CategoryTree } from "./CategoryTree";
import IFCModel from "web-ifc-three/IFC/components/IFCModel";
import { ItemProperties } from "./ItemProperties";

type SideToolProps = {
  ifcProject: Object | undefined;
  viewer: IfcViewerAPI;
  subsets: Array<any>;
  setSubsets: React.Dispatch<React.SetStateAction<Array<IFCModel.IFCModel>>>;
  itemProperties : Object | null;
  
};

export function SideTools(props: SideToolProps): React.ReactElement {
  //const [isTree, setIsTree] = React.useState(true);
  

  const [isCategories, setIsCategories] = React.useState(true);

  // const setToTree = (_event: React.MouseEvent<HTMLButtonElement>) => {
  //   setIsTree(true);
  //   seIsCategories(false);
  // };
 
  const setToCategories = (_event: React.MouseEvent<HTMLButtonElement>) => {
    //setIsTree(false);
  
    setIsCategories(true);
  };

  return (
    
    <>
      {/* <TreeButton variant="outlined" onClick={setToTree}>
        IFC Tree
      </TreeButton> */}
      <TreeButton variant="outlined" onClick={setToCategories}>
        IFC Categories
      </TreeButton>
      {/* Choose Which three will be shown*/}
      
      {isCategories &&
        CategoryTree(props.viewer, props.subsets, props.setSubsets)}
        { props.itemProperties !== null && 
          <ItemProperties 
          properties = {props.itemProperties}
          />

        }
        
    </>
  );
}
export default SideTools;
