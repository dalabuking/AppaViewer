import TreeView from "@mui/lab/TreeView";
import TextField from "@mui/material/TextField";
import React from "react";

import Button from "@mui/material/Button"
import { IfcViewerAPI } from "web-ifc-viewer";
import 'web-ifc';

type ItemPropertiesProps = {
  properties: any;
  viewer: IfcViewerAPI;
};

export function ItemProperties(props: ItemPropertiesProps): React.ReactElement {
  
  const [itemProps , setItemProps] = React.useState<any>(props.properties);
  const manager = props.viewer.IFC.loader.ifcManager;

  const changeProps = async (event, key : string ) => {

    setItemProps((prevState)=> {
      
          const newState = Object.assign({}, prevState);
          
          try{
            newState[key].value = event.target.value;
          }
          catch{
            newState[key] = event.target.value;
          }


       
       return newState;
    })      
  }

  const handleSubmit = async  (event) => {
    event.preventDefault();
    const newData = await manager.getItemProperties(0, itemProps.expressID)
     const keys = Object.keys(newData)
     for(const key of keys) {
      newData[key] = itemProps[key];
     }
    
     await manager.ifcAPI.WriteLine(0, newData);

  }



  let propList = [];
  const keys = Object.keys(props.properties);
 
  for (const key of keys) {
    let value = "";
    let disabled = false ; 

    if (props.properties[key] === null) {
      value = "null";
      // if (key !== "Description"){
      //   disabled = true;
      // }
    } else if (props.properties[key] === undefined) {
      value = "undefined";
     
      disabled = true;
    } else if (props.properties[key].value === undefined) {
      value = props.properties[key];
    //   if (key === "expressID" ||  key === "type" || key === "ObjectPlacement"
    //   || key === "PredefinedType"){
    //     disabled = true;
    // }
    } else {
      value = props.properties[key].value;
    //   if (key === "GlobalId" || key === "OwnerHistory" || key === "ObjectPlacement" ){
    //     disabled = true;
    // }
    
    }

    const propReact = (
   
      <TextField
      disabled = {disabled}
        sx={{
          padding: "7px",
          width: 350,
        }}
        key={key}
        id={String(value)}
        value={value}
        label={key}
        size="small"
        onChange={(event) => changeProps(event, key )} 
      />
    );
    propList.push(propReact);
  }

 

  return (
    <form
      onSubmit={handleSubmit}
    >
    <TreeView
          aria-label="file system navigator"
          sx={{
            width: 400,
            height: "42vh",
            flexGrow: 1,
            maxWidth: 1000,
            maxHeight: "42vh",
            overflowY: "auto",
            border: "1px solid grey",
            padding: "7px",
    
          }}
          >
      {propList}
     <Button type = "submit">
       Apply
     </Button>
     </TreeView>
    </form>

  );
}
