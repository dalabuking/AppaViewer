import TreeView from "@mui/lab/TreeView";
import TextField from "@mui/material/TextField";
import React from "react";

import Button from "@mui/material/Button";
import { IfcViewerAPI } from "web-ifc-viewer";
import "web-ifc";
import { CommentsDisabledOutlined } from "@mui/icons-material";

type ItemPropertiesProps = {
  properties: any;
  viewer: IfcViewerAPI;
  setItemProperties: React.Dispatch<React.SetStateAction<any | null>>;
};

export function ItemProperties(props: ItemPropertiesProps): React.ReactElement {
  //const [itemProps, setItemProps] = React.useState<any>(props.properties);
  const manager = props.viewer.IFC.loader.ifcManager;
   console.log(props.properties)
  const changeProps = async (event, key: string, objectKey: string) => {
    props.setItemProperties((prevState) => {
      let newState = Object.assign({}, prevState);
      
      let newValue;
      if (newState[key] === null) {
        newValue = {type : "1" , value : String(event.target.value)};
        newState[key] = newValue;
      } else if (objectKey === "") {
        newValue = convertStringToVariableType(
          event.target.value,
          newState[key]
        );

        newState[key] = newValue;
      } else {
        newValue = convertStringToVariableType(
          event.target.value,
          newState[objectKey][key]
        );
        newState[objectKey][key] = newValue;
      }

      return newState;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newData = await manager.getItemProperties(0, props.properties.expressID);
    const keys = Object.keys(newData);
    for (const key of keys) {
      //let value = convertStringToVariableType(itemProps[key] , newData[key] );
      newData[key] =  props.properties[key];
    }

    await manager.ifcAPI.WriteLine(0, newData);
  };

  function flattenObject(obj, values = [], objectKey = "") {
    // Loop through each key-value pair in the object
    for (let [key, value] of Object.entries(obj)) {
      // Check if the value is an object
      if (typeof value === "object" && value !== null) {
        // Recursively flatten the nested object into the values array
        flattenObject(value, values, key);
      } else {
        // Convert the value to a string and add it to the values array

        if(key === "type"){
          continue
        }
         let lbl ;
        if( objectKey !== "" ){
          lbl = objectKey
        }
        else {
          lbl = String(key)
        }
        let disabled = false ; 
        if (String(value) === "null" || String(value) === "undefined"){
          disabled = true;
        }




        const propReact = (
          <TextField
            disabled = {disabled}
            sx={{
              padding: "5px",
              width: "23vw",
              marginTop: "10px",
            }}
            key={objectKey + " " + key}
            id={String(value)}
            value={String(value)}
            label={lbl}
            size="small"
            onChange={(event) => changeProps(event, key, objectKey)}
          />
        );
        values.push(propReact);
      }
    }

    // Return the values array
    return values;
  }

  let propList = flattenObject(props.properties);

  return (
    <form onSubmit={handleSubmit}>
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
          borderTop: "20px  solid grey",
        }}
      >
        <div
          style={{
            padding: "10px",
            fontSize: 25,
            borderBottom: "1px solid grey",
          }}
        >
          Properties
        </div>

        {propList}
        <div style={{ textAlign: "right" }}>
          <Button
            type="submit"
            sx={{
              color: "#736F71",
              padding: "2px 20px",
              fontSize: 20,
              border: "1px solid",
              marginTop: "10px",
              marginBottom: "10px",
              marginRight: "1vw",
            }}
          >
            Apply
          </Button>
        </div>
      </TreeView>
    </form>
  );
}

function convertStringToVariableType(str, variable) {
  let type = typeof variable;
  switch (type) {
    case "string":
      return String(str);
    case "number":
      return Number(str);
    case "boolean":
      return Boolean(str);
    case "object":
      if (variable === null) {
        return "-";
      } else if (Array.isArray(variable)) {
        return str.split(",");
      } else {
        try {
          return JSON.parse(str);
        } catch (error) {
          return str;
        }
      }
    case "undefined":
      return str;
    default:
      return str;
  }
}

function flattenObject(obj, values = []) {
  // Loop through each key-value pair in the object
  for (const [key, value] of Object.entries(obj)) {
    // Check if the value is an object
    if (typeof value === "object" && value !== null) {
      // Recursively flatten the nested object into the values array
      flattenObject(value, values);
    } else {
      // Convert the value to a string and add it to the values array
      values.push(String(value));
    }
  }

  // Return the values array
  return values;
}

function convertObjectToStrings(obj) {
  // Loop through the keys of the object
  for (let key in obj) {
    // Check if the current value is an object with a "value" key
    if (
      typeof obj[key] === "object" &&
      obj[key] !== null &&
      obj[key].hasOwnProperty("value")
    ) {
      obj[key] = obj[key].value.toString();
    } else if (typeof obj[key] === "undefined") {
      obj[key] = "undefined";
    } else {
      obj[key] = obj[key].toString();
    }
  }
  return obj;
}


