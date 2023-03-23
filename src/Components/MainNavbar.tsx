import { AppBar, Toolbar, Input } from "@mui/material";
import { ReactElement, ChangeEvent } from "react";
import { IfcViewerAPI } from "web-ifc-viewer";
import React from "react";
import IFCModel from "web-ifc-three/IFC/components/IFCModel";
import {GetSubsets} from "./SideTools/GetSubsets"


type MainNavbarProps = {
  viewer: IfcViewerAPI;
  setModel: React.Dispatch<React.SetStateAction<IFCModel.IFCModel >>;
  setIfcProject: React.Dispatch<React.SetStateAction<Object >>;
  setisLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setSubsets : React.Dispatch<React.SetStateAction<Array<IFCModel.IFCModel>>>;

};

export function MainNavbar(props: MainNavbarProps): ReactElement {
  const handleLoadFile = async (e: ChangeEvent<HTMLInputElement>) => {
    props.setisLoading(true)
    const target = e.target as HTMLInputElement;
    const file: File = (target.files as FileList)[0];
    const model: IFCModel.IFCModel = await props.viewer.IFC.loadIfc(file);
    model.removeFromParent();

    const pickable = props.viewer.context.items.pickableIfcModels;
    const index = pickable.indexOf(model);
    pickable.splice(index,1)

    props.setModel(model);

    //await props.viewer.shadowDropper.renderShadow(model.modelID);
    
    const ifcProject = await props.viewer.IFC.getSpatialStructure(
      model.modelID
    );
    
    props.setIfcProject(ifcProject);

    const subsets = await GetSubsets(props.viewer, ifcProject);
    props.setSubsets(subsets);

 

    props.viewer.context.renderer.postProduction.active = true;
    props.setisLoading(false);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <label
          className="buttonnav"
          style={{
            display: "inline-block",
            padding: "6px 12px",
            cursor: "pointer",
          }}
        >
          <Input
            onChange={handleLoadFile}
            type="file"
            style={{ display: "none" }}
          />
          Load Model
        </label>
      </Toolbar>
    </AppBar>
  );
}
