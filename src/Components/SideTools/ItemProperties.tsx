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
         padding: "5px",
         width: "23vw",
          marginTop : "10px"
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
            width: "25vw",
            height: "42vh",
            flexGrow: 1,
            maxWidth: "25vw",
            maxHeight: "42vh",
            overflowY: "auto",
            border: "1px solid grey",
            borderTop : "20px  solid grey",
            
            //border: "1px solid grey",
            //padding: "7px",
    
          }}
          >
            <div style={{padding : "10px" ,
             fontSize : 25, 
             borderBottom : "1px solid grey" , 
             }}>
            Properties
            </div>
     
      {propList}
      <div style={{ textAlign : "right"}}>
      <Button type = "submit"   sx = {
        {color : "#736F71",
        padding: '2px 20px',
        fontSize : 20,
        border: '1px solid',
        marginTop : "10px",
        marginBottom : "10px",
        marginRight : "1vw"
        
        }}>
       Apply
     </Button>
      </div>

     </TreeView>
    </form>

  );
}
