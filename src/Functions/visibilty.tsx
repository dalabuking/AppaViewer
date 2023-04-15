import { togglePickable } from "./togglePickable";

export  function setItemVisibilty(
  subsets,
  category,
  expressID,
  visible,
  viewer
) {
  const scene = viewer.context.getScene();
  const clonedSubsets = [...subsets];
  clonedSubsets.find((clonedSubset) => {
    if (clonedSubset.userData.category === category) {
      clonedSubset.userData.subSubsets.items.find((item) => {
        if (item.id === expressID) {
          if (visible) {
            item.visibility = true;
            const newSubset = CreateSubsetAgainForItem(clonedSubset, viewer);
            clonedSubset.removeFromParent();
            scene.add(newSubset);

            togglePickable(viewer, newSubset, true);
 
          } else {
            item.visibility = false;

            viewer.IFC.loader.ifcManager.removeFromSubset(
              0,
              [expressID],
              clonedSubset.userData.category
            );
           
            togglePickable(viewer, clonedSubset, true);
            
          }
        }
        return;
      });
    }
    
    return;
  });

  return clonedSubsets;
}

export function setCategoryVisibilty(subsets, category, visible, viewer) {
  const scene = viewer.context.getScene();
  const clonedSubsets = [...subsets];
  clonedSubsets.find((clonedSubset) => {
    if (clonedSubset.userData.category === category) {
      if (visible) {
        clonedSubset.userData.checked = true;
        for (const item of clonedSubset.userData.subSubsets.items) {
          item.visibility = true;
        }
        const newSubset = createSubsetAgain(clonedSubset, viewer);
        clonedSubset.removeFromParent();
        scene.add(newSubset);
        
        togglePickable(viewer, newSubset, true);
      
      } else {
        clonedSubset.userData.checked = false;
        for (const item of clonedSubset.userData.subSubsets.items) {
          item.visibility = false;
        }
        

        togglePickable(viewer, clonedSubset, false);
        clonedSubset.removeFromParent();
      

      }
    }
    return;
  });
 
  return clonedSubsets;
}

function createSubsetAgain(oldSubset, viewer) {
  let ids = [];
  const scene = viewer.context.getScene();
  for (const item of oldSubset.userData.subSubsets.items) {
    if (item.visibility) {
      ids.push(item.id);
    }
  }

  const newSubset = viewer.IFC.loader.ifcManager.createSubset({
    modelID: 0,
    scene,
    ids: ids,
    removePrevious: true,
    customID: oldSubset.userData.category,
  });
  newSubset.userData.category = oldSubset.userData.category;
  newSubset.userData.subSubset = oldSubset.userData.subSubset;
  newSubset.userData.name = oldSubset.userData.name;
  newSubset.userData.checked = oldSubset.userData.checked;
  return newSubset;
}


function CreateSubsetAgainForItem(oldSubset, viewer){
  let ids = [];
  const scene = viewer.context.getScene();
  for (const item of oldSubset.userData.subSubsets.items) {
    
      ids.push(item.id);
    
  }

  const newSubset = viewer.IFC.loader.ifcManager.createSubset({
    modelID: 0,
    scene,
    ids: ids,
    removePrevious: true,
    customID: oldSubset.userData.category,
  });

  newSubset.userData.category = oldSubset.userData.category;
  newSubset.userData.subSubset = oldSubset.userData.subSubset;
  newSubset.userData.name = oldSubset.userData.name;
  newSubset.userData.checked = oldSubset.userData.checked;

  for (const item of oldSubset.userData.subSubsets.items) {
    if(item.visibility === false){
      viewer.IFC.loader.ifcManager.removeFromSubset(
        0,
        [item.id],
        oldSubset.userData.category
      );

    }
    
}
 
  return newSubset;

}
