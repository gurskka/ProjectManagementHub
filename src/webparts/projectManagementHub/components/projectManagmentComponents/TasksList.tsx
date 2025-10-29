import * as React from "react";
import { observer } from "mobx-react-lite";
import {
  Label,
  IColumn,
  Stack,
  SelectionMode,
  IconButton,
  PrimaryButton,
  ShimmeredDetailsList,
  IDropdownOption,
  Dropdown,
} from "@fluentui/react";
import { NewTaskStore } from "../projectManagmentStores/NewTaskStore";

import { AddTaskModal } from "./AddTaskModal";
import { UpdateTaskModal } from "./UpdateTaskModal";

export const TasksList = observer(
  ({ newTaskStore }: { newTaskStore: NewTaskStore }): JSX.Element => {
    const columns: IColumn[] = [
      {
        key: "col1",
        name: "Pavadinimas",
        fieldName: "Title",
        minWidth: 120,
        isResizable: true,
      },
      {
        key: "col2",
        name: "Projektas",
        fieldName: "ProjectTitle",
        minWidth: 150,
        isResizable: true,
      },
      {
        key: "col3",
        name: "Atsakingas",
        fieldName: "AssignedTo",
        minWidth: 150,
        onRender: (item) =>
          item.AssignedTo
            ? item.AssignedTo.map((a: { Title: string }) => a.Title).join(", ")
            : "",
      },
      {
        key: "col4",
        name: "Terminas",
        fieldName: "DueDate",
        minWidth: 100,
        onRender: (item) =>
          item.DueDate ? new Date(item.DueDate).toLocaleDateString() : "",
      },
      { key: "col5", name: "Statusas", fieldName: "Status", minWidth: 100 },
      {
        key: "col6",
        name: "Veiksmai",
        minWidth: 80,
        onRender: (item) => (
          <Stack horizontal tokens={{ childrenGap: 8 }}>
            <IconButton
              iconProps={{ iconName: "Edit" }}
              onClick={() => item.openUpdateTaskModal()}
              disabled={newTaskStore.rootStore.loading}
            />
            <IconButton
              iconProps={{ iconName: "Delete" }}
              onClick={() => item.delete()}
              disabled={newTaskStore.rootStore.loading}
            />
          </Stack>
        ),
      },
    ];

    const projectOptions: IDropdownOption[] = [
      { key: 0, text: "Visi projektai" },
      ...newTaskStore.rootStore.projects.map((p) => ({
        key: p.id,
        text: p.title,
      })),
    ];

    return (
      <div>
        <h2>Užduočių sąrašas</h2>
        <PrimaryButton
          text="Pridėti naują užduotį"
          onClick={() => newTaskStore.openAddTaskModal()}
          disabled={newTaskStore.rootStore.loading}
        />

        <AddTaskModal newTaskStore={newTaskStore} />
        {newTaskStore.rootStore.tasks.map((task) => (
          <UpdateTaskModal key={task.ID} store={task} />
        ))}

        <Dropdown
          placeholder="Pasirinkite projektą"
          label="Filtruoti pagal projektą"
          options={projectOptions}
          selectedKey={
            newTaskStore.rootStore.selectedProject
              ? newTaskStore.rootStore.selectedProject.id
              : 0
          }
          onChange={(e, option) => {
            const project = newTaskStore.rootStore.projects.find(
              (p) => p.id === option?.key
            );
            newTaskStore.rootStore.setSelectedProject(project ?? undefined);
          }}
          styles={{ dropdown: { width: 300, marginBottom: 12 } }}
        />

        {newTaskStore.rootStore.tasks.length > 0 ||
        newTaskStore.rootStore.loading ? (
          <ShimmeredDetailsList
            items={newTaskStore.rootStore.filteredTasks}
            columns={columns}
            selectionMode={SelectionMode.none}
            enableShimmer={newTaskStore.rootStore.loading}
          />
        ) : (
          <Label>Nerasta užduočių.</Label>
        )}
      </div>
    );
  }
);
