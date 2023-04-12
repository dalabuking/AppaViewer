import React, { useEffect, useState } from "react";
import createViewer from "./Functions/viewer";
import { MainNavbar } from "./Components/MainNavbar";
import { IfcViewerAPI } from "web-ifc-viewer";

import Intersection from "three";
import SideTools from "./Components/SideTools/SideTools";
import { Box, CircularProgress, Typography } from "@mui/material";
import IFCModel from "web-ifc-three/IFC/components/IFCModel";
import ContextMenu from "./ContextMenu/ContextMenu";

import selectionManager from "./Functions/selection";

interface ContextMenuType {
  mouseX: number;
  mouseY: number;
  item: Intersection.Intersection<Intersection.Object3D<Intersection.Event>>;
  expressID: number;
}

function App() {
  const [viewer, setViewer] = useState<IfcViewerAPI>();
  const [model, setModel] = useState<IFCModel.IFCModel>();
  const [ifcProject, setIfcProject] = useState<Object>();
  const [isLoading, setisLoading] = useState(false);
  const [subsets, setSubsets] = useState<Array<IFCModel.IFCModel>>();

  // right click on item menu
  const [contextMenu, setContextMenu] = useState<ContextMenuType | null>(null);
  // show propeties tree if item is picked
  const [itemProperties, setItemProperties] = React.useState<any | null>(null);
  // is measuring tool on ?
  const [measuring, setMeasuring] = React.useState<Boolean>(false);

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    const pickedItem = viewer.context.castRayIfc();
    if (pickedItem === null) return;
    const index = pickedItem.faceIndex;
    const subset: IFCModel.IFCModel = subsets.find((categorySubset) => {
      if (
        categorySubset.userData.category === pickedItem.object.userData.category
      ) {
        return categorySubset;
      }
    });
    const itemId = viewer.IFC.loader.ifcManager.getExpressId(
      subset.geometry,
      index
    );
    const contextmen: ContextMenuType = {
      mouseX: event.clientX + 2,
      mouseY: event.clientY - 6,
      item: pickedItem,
      expressID: itemId,
    };

    setContextMenu(contextMenu === null ? contextmen : null);
  };


  useEffect(() => {
    const viewer = createViewer();
    setViewer(viewer);
    selectionManager(viewer, setItemProperties);
  }, []);

  return (
    <>
      <MainNavbar
        viewer={viewer!}
        setModel={setModel}
        setIfcProject={setIfcProject}
        setisLoading={setisLoading}
        setSubsets={setSubsets}
        setMeasuring={setMeasuring}
        subsets={subsets}
      />

      <div
        onContextMenu={handleContextMenu}
        id="viewer-container"
        style={{
          position: "fixed",
          height: window.innerHeight,
          width: window.innerWidth,
          display: "flex",
        }}
      >
        {!measuring && (
          <ContextMenu
            contextMenu={contextMenu}
            setContextMenu={setContextMenu}
            subsets={subsets}
            setSubsets={setSubsets}
            viewer={viewer}
          />
        )}
        {isLoading && CircularProgressWithContent()}
        <div
          style={{
            position: "fixed",
          }}
        >
          {ifcProject !== undefined && !measuring &&  (
            <SideTools
              ifcProject={ifcProject!}
              viewer={viewer!}
              subsets={subsets}
              setSubsets={setSubsets}
              itemProperties={itemProperties}
              setItemProperties={setItemProperties}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default App;

function CircularProgressWithContent() {
  return (
    <div
      style={{
        position: "fixed",
        height: "100%",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <Box>
        <CircularProgress size="20vh" />
        <Typography
          top={0}
          left={0}
          bottom={0}
          right={0}
          position="absolute"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          {"Laoding"}
        </Typography>
      </Box>
    </div>
  );
}
