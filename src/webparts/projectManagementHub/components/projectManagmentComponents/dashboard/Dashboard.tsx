import * as React from "react";
import { observer } from "mobx-react-lite";
import { RootStore } from "../../RootStore";
import "../../styles.css";
import { AddTaskModal } from "../tasks/AddTaskModal";
import { AddDocumentModal } from "../documents/AddDocumentModal";
import { ProjectsOverview } from "./ProjectsOverview";
import { ProjectDetails } from "./ProjectDetails";

export const Dashboard = observer(({ rootStore }: { rootStore: RootStore }) => {
  const selectedProject = rootStore.selectedProject;

  return (
    <div className="dashboard-container">
      {!selectedProject ? (
        <ProjectsOverview rootStore={rootStore} />
      ) : (
        <ProjectDetails
          rootStore={rootStore}
          selectedProject={selectedProject}
        />
      )}
      <AddTaskModal newTaskStore={rootStore.newTaskStore} />
      <AddDocumentModal newDocumentStore={rootStore.newDocumentStore} />
    </div>
  );
});
