import * as React from "react";
import { observer } from "mobx-react-lite";
import {
  Stack,
  Text,
  Persona,
  PersonaSize,
  PrimaryButton,
} from "@fluentui/react";
import { RootStore } from "../RootStore";
import { ProjectStatus, TaskStatus } from "../IProjectManagementHubProps";
import "../styles.css";
import { AddTaskModal } from "./AddTaskModal";
import { AddDocumentModal } from "./AddDocumentModal";

export const Dashboard = observer(({ rootStore }: { rootStore: RootStore }) => {
  const [selectedFilter, setSelectedFilter] = React.useState<
    "all" | "inProgress" | "completed"
  >("all");

  const selectedProject = rootStore.selectedProject;

  const totalProjects = rootStore.projects.length;

  const inProgress = rootStore.projects.filter(
    (p) => p.status === ProjectStatus.InProgress
  ).length;

  const completed = rootStore.projects.filter(
    (p) => p.status === ProjectStatus.Completed
  ).length;

  let filteredProjects = rootStore.projects;

  if (selectedFilter !== "all") {
    const statusMap = {
      inProgress: ProjectStatus.InProgress,
      completed: ProjectStatus.Completed,
    };

    filteredProjects = rootStore.projects.filter(
      (p) => p.status === statusMap[selectedFilter]
    );
  }

  return (
    <div className="dashboard-container">
      {!selectedProject ? (
        <>
          <h2>Projektų apžvalga</h2>

          <div className="cards-stack">
            <div
              className={`hoverable-card card ${
                selectedFilter === "all" ? "active" : ""
              }`}
              onClick={() => setSelectedFilter("all")}
            >
              <Text variant="large" block className="card-text-large">
                Visi projektai
              </Text>
              <Text variant="xxLarge" className="card-text-xxLarge">
                {totalProjects}
              </Text>
            </div>

            <div
              className={`hoverable-card card ${
                selectedFilter === "inProgress" ? "active" : ""
              }`}
              style={{ backgroundColor: "#8367c7" }}
              onClick={() => setSelectedFilter("inProgress")}
            >
              <Text variant="large" block className="card-text-large">
                Vykdomi
              </Text>
              <Text variant="xxLarge" className="card-text-xxLarge">
                {inProgress}
              </Text>
            </div>

            <div
              className={`hoverable-card card ${
                selectedFilter === "completed" ? "active" : ""
              }`}
              style={{ backgroundColor: "#b3e9c7" }}
              onClick={() => setSelectedFilter("completed")}
            >
              <Text variant="large" block className="card-text-large">
                Baigti
              </Text>
              <Text variant="xxLarge" className="card-text-xxLarge">
                {completed}
              </Text>
            </div>
          </div>

          <div className="projects-list">
            <h3 className="projects-list-title">
              {selectedFilter === "all"
                ? "Visi projektai"
                : selectedFilter === "inProgress"
                ? "Vykdomi projektai"
                : "Baigti projektai"}
            </h3>

            {filteredProjects.length > 0 ? (
              <ul className="project-list">
                {filteredProjects.map((p) => {
                  let borderColor = "#abb8c3";
                  if (p.status === ProjectStatus.InProgress)
                    borderColor = "#8367c7";
                  if (p.status === ProjectStatus.Completed)
                    borderColor = "#b3e9c7";

                  return (
                    <li
                      key={p.id}
                      className="project-item"
                      onClick={() => rootStore.setSelectedProject(p)}
                      style={{ borderLeftColor: borderColor }}
                    >
                      <div>
                        <div className="project-name">{p.title}</div>
                        <div className="project-info">
                          Užduotys: {p.tasks.length} · Dokumentai:{" "}
                          {p.documents.length}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="no-projects">Nėra projektų pagal šį filtrą.</p>
            )}
          </div>
        </>
      ) : (
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

          <Stack
            horizontal
            horizontalAlign="space-evenly"
            tokens={{ childrenGap: 20 }}
          >
            <div className="info-card">
              <Text variant="medium" block className="info-title">
                Projektas
              </Text>
              <Text variant="xLarge" className="info-value">
                {selectedProject.status}
              </Text>
            </div>

            <div className="info-card">
              <Text variant="medium" block className="info-title">
                Užduotys
              </Text>
              <Text variant="xLarge" className="info-value">
                {selectedProject.tasks.length}
              </Text>
            </div>

            <div className="info-card">
              <Text variant="medium" block className="info-title">
                Dokumentai
              </Text>
              <Text variant="xLarge" className="info-value">
                {selectedProject.documents.length}
              </Text>
            </div>
          </Stack>

          {selectedProject.tasks.length > 0 && (
            <div className="tasks-container">
              <h4>Užduotys</h4>
              <ul>
                {selectedProject.tasks
                  .sort(
                    (a, b) =>
                      (a.DueDate ? new Date(a.DueDate).getTime() : 0) -
                      (b.DueDate ? new Date(b.DueDate).getTime() : 0)
                  )
                  .map((task) => {
                    let statusText = "Nepradėta";
                    let borderColor = "#abb8c3";
                    let statusColor = "#abb8c3";

                    if (task.Status === TaskStatus.InProgress) {
                      statusText = "Vykdoma";
                      borderColor = "#8367c7";
                      statusColor = "#8367c7";
                    }

                    if (task.Status === TaskStatus.Completed) {
                      statusText = "Baigta";
                      borderColor = "#b3e9c7";
                      statusColor = "#b3e9c7";
                    }

                    return (
                      <li
                        key={task.ID}
                        className="task-item"
                        style={{
                          borderLeftColor: borderColor,
                        }}
                      >
                        <div>
                          <div className="task-title">
                            {task.AssignedTo?.length ? (
                              <div className="assigned-users">
                                {task.AssignedTo.map((u) => (
                                  <Persona
                                    key={u.Id}
                                    text={u.Title}
                                    size={PersonaSize.size32}
                                  />
                                ))}
                              </div>
                            ) : (
                              <>Atsakingas: —</>
                            )}
                            <br />
                            {task.Title}
                          </div>
                          <div className="task-due-date">
                            Terminas:{" "}
                            {task.DueDate
                              ? new Date(task.DueDate).toLocaleDateString()
                              : "—"}
                          </div>
                        </div>
                        <span
                          className="task-status"
                          style={{ backgroundColor: statusColor }}
                        >
                          {statusText}
                        </span>
                      </li>
                    );
                  })}
              </ul>
            </div>
          )}

          {selectedProject.documents.length > 0 && (
            <div className="documents-container">
              <h4>Dokumentai</h4>
              <div className="documents-list">
                {selectedProject.documents.map((doc) => (
                  <div key={doc.Id} className="document-item">
                    {doc.Name}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <AddTaskModal newTaskStore={rootStore.newTaskStore} />

      <AddDocumentModal newDocumentStore={rootStore.newDocumentStore} />
    </div>
  );
});
