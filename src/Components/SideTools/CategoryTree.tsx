import { Checkbox } from "@mui/material";
import TreeItem from "@mui/lab/TreeItem";
import { IfcViewerAPI } from "web-ifc-viewer";
import { Box } from "@mui/material";
import TreeView from "@mui/lab/TreeView";
import ExpandMoreIcon from "@mui/material/SvgIcon";
import ChevronRightIcon from "@mui/material/SvgIcon";
import IFCModel from "web-ifc-three/IFC/components/IFCModel";
import {
  setItemVisibilty,
  setCategoryVisibilty,
} from "../../Functions/visibilty";

export function CategoryTree(
  viewer: IfcViewerAPI,
  subsets: Array<IFCModel.IFCModel>,
  setSubsets: React.Dispatch<React.SetStateAction<Array<IFCModel.IFCModel>>>
) {
  const selectComponent = (_event, id) => {
    viewer.IFC.selector.pickIfcItemsByID(0, [id], true);
  };
  const  preSelectComponent =  (_event, id ) => {

     viewer.IFC.selector.prepickIfcItemsByID(0, [id]);
  };
  let expandedNodes = [];
  let Categories = [];
  const setVisibilty = (
    event: React.ChangeEvent<HTMLInputElement>,
    subset: IFCModel.IFCModel
  ) => {
    const checked = event.target.checked;
    if (checked) {
      const clonedSubsets = setCategoryVisibilty(
        subsets,
        subset.userData.category,
        true,
        viewer
      );
      setSubsets(clonedSubsets);
    } else {
      const clonedSubsets = setCategoryVisibilty(
        subsets,
        subset.userData.category,
        false,
        viewer
      );
      setSubsets(clonedSubsets);
    }
   
  };

  const setItemVisibility = (
    event: React.ChangeEvent<HTMLInputElement>,
    subset: IFCModel.IFCModel,
    item: any
  ) => {
    const checked = event.target.checked;
    if (checked) {
      const clondedSubsets = setItemVisibilty(
        subsets,
        subset.userData.category,
        item.id,
        true,
        viewer
      );
      setSubsets(clondedSubsets);
     
    } else {
      const clondedSubsets = setItemVisibilty(
        subsets,
        subset.userData.category,
        item.id,
        false,
        viewer
      );
      setSubsets(clondedSubsets);

    }
   
  };

  let i = 1;
  viewer.context.renderer.postProduction.update();
  for (const subset of subsets) {
    expandedNodes.push(String(subset.userData.category));
    const subsetName = subset.userData.name;
    let Items = [];
    for (const item of subset.userData.subSubsets.items) {
      //let itemName = item.props["Name"].value;
      const ItemId = item.id;
      
   
      Items.push(
        <Box key={ItemId} sx={boxsx} 
        onClick={(event) => selectComponent(event, ItemId)}
        onMouseEnter={(event) => preSelectComponent(event, ItemId)}
        
        >
          {"itemName" + "-" + ItemId}
          <Checkbox
            disabled={!subset.userData.checked}
            checked={item.visibility}
            onChange={(event) => setItemVisibility(event, subset, item)}
          />
        </Box>
      );
    }
    Categories.push(
      <TreeItem
        key={i}
        nodeId={String(subset.userData.category)}
        label={subset.userData.name}
      >
        Visibility
        <Checkbox
          checked={subset.userData.checked}
          onChange={(event) => setVisibilty(event, subset)}
        />
        {Items}
      </TreeItem>
    );
    i++;
  }
  return (
    <TreeView
 
      aria-label="file system navigator"
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      sx={{
        width: 400,
        height: 300, 
        flexGrow: 1,
        maxWidth: 400,
        maxHeight: 400,
        overflowY: "auto",
        border: "1px solid grey",
      }}
    >
      {Categories}
    </TreeView>
  );
}


const boxsx = {
    border: "1px solid grey",
    '&:hover': {
      backgroundColor: '#ADD8E6',
      borderColor: '#0062cc',
     
    }

}