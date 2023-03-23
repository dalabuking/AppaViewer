
import TreeItem from "@mui/lab/TreeItem";
import { IfcViewerAPI } from "web-ifc-viewer";
import TreeView from "@mui/lab/TreeView";
import ExpandMoreIcon from "@mui/material/SvgIcon";
import ChevronRightIcon from "@mui/material/SvgIcon";



export function TreeComponent(ifcProject: Object, viewer: IfcViewerAPI) {
    const selectComponent = (_event, id) => {
      viewer.IFC.selector.pickIfcItemsByID(0, [id], true);
    };
    const preSelectComponent = (_event, id) => {
      viewer.IFC.selector.prepickIfcItemsByID(0, [id]);
    };
  
    let expandedNodes = [];
  
    const treeitem = createSubItems(ifcProject, 1);
    function createSubItems(item, lastindex) {
      let subItem = item.children.map((child, index) =>
        child.children.length === 0 ? (
          <TreeItem
            onClick={(event) => selectComponent(event, child.expressID)}
            onMouseEnter={(event) => preSelectComponent(event, child.expressID)}
            key={index + lastindex + 1}
            nodeId={String(child.expressID)}
            label={child.type}
          />
        ) : (
          expandedNodes.push(String(index + lastindex + 1)) && (
            <TreeItem
              key={index + lastindex + 1}
              nodeId={String(index + lastindex + 1)}
              label={child.type}
            >
              {createSubItems(child, lastindex + 1)}
            </TreeItem>
          )
        )
      );
      return subItem;
    }
    return (
      <TreeView
        aria-label="file system navigator"
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
        expanded={expandedNodes}
        sx={{
          fontSize: 10,
          width: 400,
          height: 1 / 2,
          flexGrow: 1,
          maxWidth: 1000,
          maxHeight: 400,
          overflowY: "auto",
          //backgroundColor: "white",
        }}
      >
        {treeitem}
      </TreeView>
    );
  }
  