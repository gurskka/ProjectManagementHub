import * as React from "react";
import { observer } from "mobx-react-lite";
import { Text } from "@fluentui/react";
import { RootStore } from "../../RootStore";
import { ProjectStatus } from "../../IProjectManagementHubProps";
import "../../styles.css";

export const ProjectsOverview = observer(
  ({ rootStore }: { rootStore: RootStore }) => {
    const [selectedFilter, setSelectedFilter] = React.useState<
      "all" | "inProgress" | "completed"
    >("all");

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
            style={{
              backgroundColor: "#0f6cbd",
              boxShadow:
                selectedFilter === "inProgress"
                  ? "0 0 15px rgba(15, 108, 189, 0.8)"
                  : "none",
            }}
            onClick={() => setSelectedFilter("inProgress")}
          >
            <Text variant="large" block className="card-text-large white-text">
              Vykdomi
            </Text>
            <Text variant="xxLarge" className="card-text-xxLarge white-text">
              {inProgress}
            </Text>
          </div>

          <div
            className={`hoverable-card card ${
              selectedFilter === "completed" ? "active" : ""
            }`}
            style={{
              backgroundColor: "#107c10",
              boxShadow:
                selectedFilter === "completed"
                  ? "0 0 15px rgba(16, 124, 16, 0.8)"
                  : "none",
            }}
            onClick={() => setSelectedFilter("completed")}
          >
            <Text variant="large" block className="card-text-large white-text">
              Baigti
            </Text>
            <Text variant="xxLarge" className="card-text-xxLarge white-text">
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
                let borderColor = "#616161";
                if (p.status === ProjectStatus.InProgress)
                  borderColor = "#0f6cbd";
                if (p.status === ProjectStatus.Completed)
                  borderColor = "#107c10";

                return (
                  <li
                    key={p.id}
                    className="project-item"
                    onClick={() => rootStore.setSelectedProject(p)}
                    style={{
                      borderLeftColor: borderColor,
                      background: `${borderColor}20`,
                    }}
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
    );
  }
);
