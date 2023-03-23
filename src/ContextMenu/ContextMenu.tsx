import React from 'react'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { IfcViewerAPI } from "web-ifc-viewer";
import IFCModel from "web-ifc-three/IFC/components/IFCModel";
import { setItemVisibilty , setCategoryVisibilty } from "../Functions/visibilty";
import Intersection from 'three'


interface ContextMenuType  {
    mouseX: number;
    mouseY: number;
    item: Intersection.Intersection<Intersection.Object3D<Intersection.Event>>;
    expressID : number
 }


type ContextMenuProps = {
    setContextMenu : React.Dispatch<React.SetStateAction<ContextMenuType|null>>
    contextMenu : ContextMenuType | null;
    setSubsets: React.Dispatch<React.SetStateAction<Array<IFCModel.IFCModel>>>
    subsets: Array<IFCModel.IFCModel>,
    viewer : IfcViewerAPI
 

}


export default function ContextMenu(props : ContextMenuProps){


    const handleClose = () => {
        props.setContextMenu(null);
    }
    const hideItem =() => {


        const clonedSubsets =  setItemVisibilty(props.subsets, 
                                props.contextMenu.item.object.userData.category , 
                                props.contextMenu.expressID, 
                                false, props.viewer)
       
        props.setSubsets(clonedSubsets);
        props.setContextMenu(null);
        props.viewer.context.renderer.postProduction.update();
    }

    const hideAllCategory = () => {
        const clonedSubsets =  setCategoryVisibilty(props.subsets, 
            props.contextMenu.item.object.userData.category , 
            false,
            props.viewer)
        props.setSubsets(clonedSubsets);
        props.setContextMenu(null);
        props.viewer.context.renderer.postProduction.update();
    }





    return (
        

        <Menu
            open = {props.contextMenu !== null }
            onClose = {handleClose}
            anchorReference = "anchorPosition"
            anchorPosition = {
                props.contextMenu !== null ? 
                {top : props.contextMenu.mouseY, 
                left : props.contextMenu.mouseX } : undefined
                }
        >
          <MenuItem onClick = {hideItem}> Hide Item </MenuItem>
          <MenuItem onClick = {hideAllCategory}> Hide Category
           {props.contextMenu ? (" " +  props.contextMenu.item.object.userData.name ): ""} </MenuItem>
        </Menu>
   
    )


}