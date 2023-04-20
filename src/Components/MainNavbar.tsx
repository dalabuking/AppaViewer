import { AppBar, Toolbar, Input } from "@mui/material";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { ReactElement, ChangeEvent, useState } from "react";
import { IfcViewerAPI } from "web-ifc-viewer";
import React from "react";
import IFCModel from "web-ifc-three/IFC/components/IFCModel";
import { GetSubsets } from "./SideTools/GetSubsets";
import { MeshBasicMaterial, LineBasicMaterial } from "three";
import { Save, UploadFile, Expand } from "@mui/icons-material";
import { toggleAllMeshPickable } from "../Functions/togglePickable";
import { Vector3 } from "three";


interface geometryValues {
  radius : number, 
  center : Vector3 ,
}


type MainNavbarProps = {
  viewer: IfcViewerAPI;
  setModel: React.Dispatch<React.SetStateAction<IFCModel.IFCModel>>;
  setGeometryValues: React.Dispatch<React.SetStateAction<geometryValues>>;
  setIfcProject: React.Dispatch<React.SetStateAction<Object>>;
  setisLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setSubsets: React.Dispatch<React.SetStateAction<Array<IFCModel.IFCModel>>>;
  setMeasuring: React.Dispatch<React.SetStateAction<Boolean>>;
  subsets: Array<IFCModel.IFCModel>;
};

export function MainNavbar(props: MainNavbarProps): ReactElement {
  const [loaded, setLoaded] = useState<Boolean>(false);

  const saveFile = async () => {
    const manager = props.viewer.IFC.loader.ifcManager;
    const data = await manager.ifcAPI.ExportFileAsIFC(0);
    const blob = new Blob([data]);
    const file = new File([blob], "modified.ifc");

    const link = document.createElement("a");
    link.download = "modified.ifc";
    link.href = URL.createObjectURL(file);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const measure = () => {
    //toogle picable items
    props.viewer.IFC.selector.unpickIfcItems();
    props.viewer.IFC.selector.unPrepickIfcItems();
    toggleAllMeshPickable(false, props.viewer);

    props.viewer.dimensions.active = true;
    props.viewer.dimensions.previewActive = true;
   
    

    props.setMeasuring(true);

 
  };

  const handleLoadFile = async (e: ChangeEvent<HTMLInputElement>) => {
    props.setisLoading(true);
    const target = e.target as HTMLInputElement;
    const file: File = (target.files as FileList)[0];
    const model: IFCModel.IFCModel = await props.viewer.IFC.loadIfc(file);
     
    setLoaded(true);

   const modelGeometry : any= await getGemoetryValues( model);
   props.setGeometryValues(modelGeometry);

    model.removeFromParent();
   
    const pickable = props.viewer.context.items.pickableIfcModels;
    const index = pickable.indexOf(model);
    pickable.splice(index, 1);

    //await props.viewer.shadowDropper.renderShadow(model.modelID);

    const ifcProject = await props.viewer.IFC.getSpatialStructure(
      model.modelID
    );
    // seting ifc project //spatial tree structure
    props.setIfcProject(ifcProject);
    // get all subset , category subsets

    const subsets = await GetSubsets(props.viewer, ifcProject);
    props.setSubsets(subsets);

    //generate plans
    await props.viewer.plans.computeAllPlanViews(model.modelID);




    window.onkeydown = (event) => {

      if (event.code === "Escape") {
        props.viewer.dimensions.active = false;
        props.viewer.dimensions.previewActive = false;
        props.viewer.dimensions.deleteAll();
        props.setMeasuring(false);
        toggleAllMeshPickable(true, props.viewer);

      } else if (event.code === "Delete") {
        props.viewer.dimensions.delete();
      }
      else if (event.code === "KeyM" ) {
        
        measure();
       }
    };


 
    props.setisLoading(false);
    props.setModel(model);
  };

  return (
    <AppBar position="static" sx={{ height: "8vh", background: "#736F71" }}>
      <Toolbar>
        {!loaded && (
          <Tooltip arrow title="Upload IFC">
            <IconButton aria-label="upload ifc" component="label">
              <input
                hidden
                accept=".ifc"
                onChange={handleLoadFile}
                type="file"
              />
              <UploadFile
                sx={{
                  fontSize: 40,
                }}
              />
            </IconButton>
          </Tooltip>
        )}
        {loaded && (
          <Tooltip arrow title="Save IFC">
            <IconButton onClick={saveFile}>
              <Save
                sx={{
                  fontSize: 40,
                }}
              />
            </IconButton>
          </Tooltip>
        )}
        {loaded && (
          <Tooltip
            arrow
            title={
              <div style={{textAlign : "center"}}>
                <div>Measure</div>
                <div>Double Click To Measure</div>
                <div>Delete Dimension With "Delete Button" Hovering On Dimension</div>
                <div>Turn Off With ESC Button</div>
            
              </div>
            }
          >
            <IconButton sx={{ color: "white" }} onClick={measure}>
              <Expand
                sx={{
                  color: "black",
                  fontSize: 40,
                }}
              />
            </IconButton>
          </Tooltip>
        )}
      </Toolbar>
    </AppBar>
  );
}



async function getGemoetryValues(model  : any){
  let modelGeometry : geometryValues ; 
  if ( model.geometry.boundingSphere != null ) {
      modelGeometry = {
      radius :   model.geometry.boundingSphere.radius,
      center :  model.geometry.boundingSphere.center
   }
  }
  return modelGeometry


}