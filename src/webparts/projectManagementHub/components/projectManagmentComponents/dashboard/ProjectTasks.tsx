import * as React from "react";
import { observer } from "mobx-react-lite";
import { Persona, PersonaSize } from "@fluentui/react";
import { TaskStatus } from "../../IProjectManagementHubProps";
import { Project } from "../../projectManagmentStores/Project";
import "../../styles.css";

export const ProjectTasks = observer(
  ({ selectedProject }: { selectedProject: Project }) => {
    return (
      <>
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
                  let borderColor = "#616161";
                  let statusColor = "#616161";

                  if (task.Status === TaskStatus.InProgress) {
                    statusText = "Vykdoma";
                    borderColor = "#0f6cbd";
                    statusColor = "#0f6cbd";
                  }

                  if (task.Status === TaskStatus.Completed) {
                    statusText = "Baigta";
                    borderColor = "#107c10";
                    statusColor = "#107c10";
                  }

                  return (
                    <li
                      key={task.ID}
                      className="task-item"
                      style={{
                        borderLeftColor: borderColor,
                        background: `${borderColor}20`,
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
      </>
    );
  }
);
