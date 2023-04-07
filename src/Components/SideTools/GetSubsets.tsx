import { IfcViewerAPI } from "web-ifc-viewer";
import IFCModel from "web-ifc-three/IFC/components/IFCModel";
import { togglePickable } from "../../Functions/togglePickable";
import { getProps } from "../../Functions/getProps";
import {
  IFCWALLSTANDARDCASE,
  IFCSLAB,
  IFCDOOR,
  IFCWINDOW,
  IFCFURNISHINGELEMENT,
  IFCMEMBER,
  IFCPLATE,
  IFCBUILDINGELEMENTPROXY,
  IFCFLOWFITTING,
  IFCBEAM,
  IFCROOF
  
} from "web-ifc";

// List of categories names
const categories = {
  IFCWALLSTANDARDCASE,
  IFCSLAB,
  IFCFURNISHINGELEMENT,
  IFCDOOR,
  IFCWINDOW,
  IFCPLATE,
  IFCMEMBER,
  IFCBUILDINGELEMENTPROXY,
  IFCFLOWFITTING,
  IFCBEAM,
  IFCROOF
  
};

type Item = {
  id : number ,
  visibility : boolean,
  name : string,

  
}

type subsetItems = {
   subsetName : string,
   items :  Item[]
}


export const GetSubsets = async (viewer: IfcViewerAPI 
  , ifcProject : any
  
  ) => {

   
  const scene = viewer.context.getScene();
 

   const modelCategories = []; 
   const allCategories = Object.keys(categories);

   function getUsedCategories(ifcProject){
      let type = ifcProject.type;
      if(allCategories.indexOf(type) !== -1){
        if(modelCategories.indexOf(categories[type]) === -1 ){
          modelCategories.push(categories[type]);
        }
      }
      if(ifcProject.children.length !== 0) {
          for(const item of ifcProject.children) {
            getUsedCategories(item)
          }
      }
      }
   getUsedCategories(ifcProject)


  function getName(category) {
    const names = Object.keys(categories);
    return names.find((name) => categories[name] === category);
  }
  async function getAll(category) {
    return viewer.IFC.loader.ifcManager.getAllItemsOfType(0, category, false);
  }
  async function getAllItemsIds(category) {
    const list : Array<any>= await viewer.IFC.loader.ifcManager.getAllItemsOfType(
      0, 
      category,
      false
    );
    return list;
  }
  async function getItemId(id) {
    const item = await viewer.IFC.loader.ifcManager.byId(0, id);
    return item;
  }
  async function newSubsetOfType(category) {
    //const empty = []
    const ids = await getAll(category);
    return viewer.IFC.loader.ifcManager.createSubset({
      modelID: 0,
      scene,
      ids : ids,
      removePrevious: true,
      customID: category.toString(),
    }) as IFCModel.IFCModel;
  }

  const subsets = [];
  let IfcSubsets : Array<IFCModel.IFCModel> = [];
  
 
  async function setUpSubsets() {
    for (let i = 0; i < modelCategories.length; i++) {
      const category = modelCategories[i];
    
      const subset  = await newSubsetOfType(category);
  
      togglePickable(viewer, subset , true);
      
      subset.userData.category = category.toString();
      subset.userData.name = getName(category);
      subset.userData.checked = true;
      

      subsets[category] = subset;
   
      const itemsIds = await getAllItemsIds(category);
      let Items : Item[] =[];
      for(const itemid of itemsIds){

        let props : Object = await getProps(viewer, itemid);
        

        let Item : Item = {
          visibility : true ,
          id : itemid,
          name : props["Name"].value
         
        }
        Items.push(Item)
      }
      let subsetItems :  subsetItems = {
          subsetName : getName(category),
          items : Items
      }
      subset.userData.subSubsets = subsetItems;
      scene.add(subset);

      IfcSubsets.push(subset);
     
      
  }
  return IfcSubsets  ;
}
IfcSubsets = await setUpSubsets();
  return IfcSubsets;
};
