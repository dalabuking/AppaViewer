import { Checkbox } from "@mui/material";
import TreeItem from "@mui/lab/TreeItem";
import { IfcViewerAPI } from "web-ifc-viewer";
import { Box } from "@mui/material";
import TreeView from "@mui/lab/TreeView";
import ExpandMoreIcon from "@mui/material/SvgIcon";
import ChevronRightIcon from "@mui/material/SvgIcon";
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon';
//import ChevronRightIcon from "@mui/icons-material";
//import { ChevronRightIcon } from '@mui/material';
import IFCModel from "web-ifc-three/IFC/components/IFCModel";
import {
  setItemVisibilty,
  setCategoryVisibilty,
} from "../../Functions/visibilty";

export function CategoryTree(
  viewer: IfcViewerAPI,
  subsets: Array<IFCModel.IFCModel>,
  setSubsets: React.Dispatch<React.SetStateAction<Array<IFCModel.IFCModel>>>,
  setItemProperties: React.Dispatch<React.SetStateAction<any | null>>
) {
  const selectComponent = async (_event, id) => {
    await viewer.IFC.selector.pickIfcItemsByID(0, [id], true);
    const props = await viewer.IFC.getProperties(0, id, false);
    setItemProperties(props);
  };
  const preSelectComponent = async (_event, id) => {
    await viewer.IFC.selector.prepickIfcItemsByID(0, [id]);
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
      let itemName = item.name;
      const ItemId = item.id;

      Items.push(
        <Box sx={{ border: "1px solid grey" }} key={ItemId}>
          <Box
            sx={boxsx}
            onClick={(event) => selectComponent(event, ItemId)}
            onMouseEnter={(event) => preSelectComponent(event, ItemId)}
          >
            {ItemId + " - " + itemName}
          </Box>
          Item Visibility
          <Checkbox
            color="default"
            //disabled={!subset.userData.checked}
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
        sx={{
          width: "23vw",
          ".MuiTreeItem-content": {
            "&:hover": {
              backgroundColor: "#b2cbd6",
              borderColor: "#0062cc",
            },
          },
        }}
      >
        Category Visibility
        <Checkbox
          color="default"
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
      defaultCollapseIcon={<MinusSquare />}
      defaultExpandIcon={<PlusSquare />}
      sx={{
        width: "25vw",
        height: "auto",
        flexGrow: 1,
        maxWidth: "25vw",
        maxHeight: "40vh",
        overflowY: "auto",
        border: "1px solid grey",
      }}
    >
      {Categories}
    </TreeView>
  );
}

const boxsx = {
  cursor: "pointer",
  "&:hover": {
    backgroundColor: "#b2cbd6",
    borderColor: "#0062cc",
  },
};


function MinusSquare(props: SvgIconProps) {
  return (
    <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 11.023h-11.826q-.375 0-.669.281t-.294.682v0q0 .401.294 .682t.669.281h11.826q.375 0 .669-.281t.294-.682v0q0-.401-.294-.682t-.669-.281z" />
    </SvgIcon>
  );
}

function PlusSquare(props: SvgIconProps) {
  return (
    <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
      {/* tslint:disable-next-line: max-line-length */}
      <path d="M22.047 22.074v0 0-20.147 0h-20.12v0 20.147 0h20.12zM22.047 24h-20.12q-.803 0-1.365-.562t-.562-1.365v-20.147q0-.776.562-1.351t1.365-.575h20.147q.776 0 1.351.575t.575 1.351v20.147q0 .803-.575 1.365t-1.378.562v0zM17.873 12.977h-4.923v4.896q0 .401-.281.682t-.682.281v0q-.375 0-.669-.281t-.294-.682v-4.896h-4.923q-.401 0-.682-.294t-.281-.669v0q0-.401.281-.682t.682-.281h4.923v-4.896q0-.401.294-.682t.669-.281v0q.401 0 .682.281t.281.682v4.896h4.923q.401 0 .682.281t.281.682v0q0 .375-.281.669t-.682.294z" />
    </SvgIcon>
  );
}
