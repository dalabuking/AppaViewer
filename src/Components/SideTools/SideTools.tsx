import { TreeButton } from "../TreeButton";
import React from "react";
import { IfcViewerAPI } from "web-ifc-viewer";
import { CategoryTree } from "./CategoryTree";
import IFCModel from "web-ifc-three/IFC/components/IFCModel";
import { ItemProperties } from "./ItemProperties";
import { Plans } from "./Plans";

type SideToolProps = {
  ifcProject: Object | undefined;
  viewer: IfcViewerAPI;
  subsets: Array<any>;
  setSubsets: React.Dispatch<React.SetStateAction<Array<IFCModel.IFCModel>>>;
  itemProperties : any | null;
  setItemProperties: React.Dispatch<React.SetStateAction<any | null>>;
};

export function SideTools(props: SideToolProps): React.ReactElement {
  const [isPlans, setIsPlans] = React.useState(false);
  const [isCategories, setIsCategories] = React.useState(true);

  const setToPlans = (_event: React.MouseEvent<HTMLButtonElement>) => {
    setIsPlans(true);
    setIsCategories(false);
   
  };
 
  const setToCategories = (_event: React.MouseEvent<HTMLButtonElement>) => {
    setIsPlans(false);
    setIsCategories(true);
  };

  return (
    
    <>
      
      <TreeButton variant="outlined" onClick={setToCategories}>
        IFC Categories
      </TreeButton>
      <TreeButton variant="outlined" onClick={setToPlans}>
        IFC Floorplans
      </TreeButton>
      {/* Choose Which three will be shown*/}
      
      {isCategories &&
        CategoryTree(props.viewer, props.subsets, props.setSubsets, props.setItemProperties)}
        { isPlans && <Plans   
            viewer = {props.viewer}
      
        
        />}

        {props.itemProperties !== null && 
          <ItemProperties 
          properties = {props.itemProperties}
          viewer = {props.viewer}
          setItemProperties = {props.setItemProperties}
          />

        }
        
    </>
  );
}
export default SideTools;
