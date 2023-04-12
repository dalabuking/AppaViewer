import TreeView from "@mui/lab/TreeView";
import Button from "@mui/material/Button";
import { IfcViewerAPI } from "web-ifc-viewer";

type PlansProps = {
  viewer: IfcViewerAPI;
};

export function Plans(props: PlansProps) {
  let planButtons = [];
  const allPlans = props.viewer.plans.getAll(0);
  const ListOfPlans = props.viewer.plans.planLists[0];

  console.log(ListOfPlans);

  const goToPlanView = (event, plan) => {
    props.viewer.plans.goTo(0, plan);
    props.viewer.edges.toggle("plansedges", true);
  };
  const goToModelView = (event) => {
    props.viewer.plans.exitPlanView();
    props.viewer.edges.toggle("plansedges", false);
  };

  for (const plan of allPlans) {
    const planObject = ListOfPlans[plan];
    const planButton = (
      <div key={planObject.expressID}>
        <Button sx = {buttonSx} onClick={(event) => goToPlanView(event, plan)}>
          {planObject.name + "-" + planObject.expressID}
        </Button>
      </div>
    );
    planButtons.push(planButton);
  }

  return (
    <TreeView
      aria-label="file system navigator"
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
      {planButtons}

      <Button   onClick={(event) => goToModelView(event)}>GoTo Model View </Button>
    </TreeView>
  );
}

const buttonSx = {
  //width : "23vw",
  color : "black",
  cursor: "pointer",

  "&:hover": {
    backgroundColor: "#b2cbd6",
    borderColor: "#0062cc",
  },
  "&:focus": {
    backgroundColor: "#b2cbd6",
    borderColor: "#0062cc",
  },
};
