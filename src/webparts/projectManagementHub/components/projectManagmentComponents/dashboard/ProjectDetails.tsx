import * as React from "react";
import { observer } from "mobx-react-lite";
import { PrimaryButton } from "@fluentui/react";
import { RootStore } from "../../RootStore";
import { Project } from "../../projectManagmentStores/Project";
import "../../styles.css";
import { ProjectStats } from "./ProjectStats";
import { ProjectTasks } from "./ProjectTasks";
import { ProjectDocuments } from "./ProjectDocuments";

export const ProjectDetails = observer(
  ({
    selectedProject,
    rootStore,
  }: {
    selectedProject: Project;
    rootStore: RootStore;
  }) => {
    return (
      <>
        <div
          className="back-button"
          onClick={() => rootStore.setSelectedProject(undefined)}
        >
          ← Atgal į projektų sąrašą
        </div>

        <div style={{ float: "right", marginTop: "-35px" }}>
          <PrimaryButton
            onClick={() =>
              rootStore.newTaskStore.openAddTaskModal(selectedProject.id)
            }
          >
            + Pridėti užduotį
          </PrimaryButton>{" "}
          <PrimaryButton
            onClick={() =>
              rootStore.newDocumentStore.openAddDocumentModal(
                selectedProject.id
              )
            }
          >
            + Pridėti dokumentą
          </PrimaryButton>
        </div>

        <div className="project-dates">
          <strong>Terminas: </strong>
          {selectedProject.startDate
            ? new Date(selectedProject.startDate).toLocaleDateString()
            : "-"}{" "}
          -{" "}
          {selectedProject.endDate
            ? new Date(selectedProject.endDate).toLocaleDateString()
            : "—"}
        </div>

        <div className="project-header">
          <h1 className="project-title">{selectedProject.title}</h1>
          <p className="project-description">
            {selectedProject.description || "Nėra aprašymo"}
          </p>
        </div>
        <ProjectStats selectedProject={selectedProject} />
        <ProjectTasks selectedProject={selectedProject} />
        <ProjectDocuments
          selectedProject={selectedProject}
          rootStore={rootStore}
        />
      </>
    );
  }
);
