import TreeView from "@mui/lab/TreeView";
import TextField from "@mui/material/TextField";
import React from "react";

type ItemPropertiesProps = {
  properties: Object;
};

export function ItemProperties(props: ItemPropertiesProps): React.ReactElement {
  
  const [itemProps , setItemProps] = React.useState(props.properties);

  // const changeProps = (event, key : string) => {

  //   setItemProps((prevState)=> {
     
  //         prevState[key].value = event.target.value
       
  //      return prevState
  //   })      
  //}
  let propList = [];
  const keys = Object.keys(props.properties);
 
  for (const key of keys) {
    let value = "";
    let disabled = false ; 

    if (props.properties[key] === null) {
      value = "null";
      if (key !== "Description"){
        disabled = true;
      }
    } else if (props.properties[key] === undefined) {
      value = "undefined";
     
      disabled = true;
    } else if (props.properties[key].value === undefined) {
      value = props.properties[key];
      if (key === "expressID" ||  key === "type" || key === "ObjectPlacement"
      || key === "PredefinedType"){
        disabled = true;
    }
    } else {
      value = props.properties[key].value;
      if (key === "GlobalId" || key === "OwnerHistory" || key === "ObjectPlacement"
      || key === "Representation" ){
        disabled = true;
    }
    
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
        //onChange={(event) => changeProps(event, key)} 
      />
    );
    propList.push(propReact);
  }

 

  return (
    <TreeView
      aria-label="file system navigator"
      sx={{
        width: 400,
        height: 200,
        flexGrow: 1,
        maxWidth: 1000,
        maxHeight: 200,
        overflowY: "auto",
        border: "1px solid grey",
        padding: "7px",
      }}
    >
      {propList}
    </TreeView>
  );
}
