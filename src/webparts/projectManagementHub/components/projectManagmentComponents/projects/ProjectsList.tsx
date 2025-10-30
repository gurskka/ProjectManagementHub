import * as React from "react";
import { observer } from "mobx-react-lite";
import {
  Label,
  PrimaryButton,
  Stack,
  IconButton,
  IColumn,
  ShimmeredDetailsList,
  SelectionMode,
} from "@fluentui/react";
import { NewProjectStore } from "../../projectManagmentStores/NewProjectStore";
import { AddProjectModal } from "./AddProjectModal";
import { UpdateProjectModal } from "./UpdateProjectModal";

export const ProjectsList = observer(
  ({ newProjectStore }: { newProjectStore: NewProjectStore }) => {
    const columns: IColumn[] = [
      {
        key: "col1",
        name: "Pavadinimas",
        fieldName: "title",
        minWidth: 120,
        isResizable: true,
      },
      {
        key: "col2",
        name: "Aprašymas",
        fieldName: "description",
        minWidth: 200,
        isResizable: true,
      },
      {
        key: "col3",
        name: "Pradžia",
        fieldName: "startDate",
        minWidth: 100,
        onRender: (item) =>
          item.startDate ? new Date(item.startDate).toLocaleDateString() : "",
      },
      {
        key: "col4",
        name: "Pabaiga",
        fieldName: "endDate",
        minWidth: 100,
        onRender: (item) =>
          item.endDate ? new Date(item.endDate).toLocaleDateString() : "",
      },
      { key: "col5", name: "Statusas", fieldName: "status", minWidth: 100 },
      {
        key: "col6",
        name: "Veiksmai",
        minWidth: 80,
        onRender: (item) => (
          <Stack horizontal tokens={{ childrenGap: 8 }}>
            <IconButton
              iconProps={{ iconName: "Edit" }}
              onClick={() => item.openUpdateProjectModal()}
              disabled={newProjectStore.rootStore.loading}
            />
            <IconButton
              iconProps={{ iconName: "Delete" }}
              onClick={() => item.delete()}
              disabled={newProjectStore.rootStore.loading}
            />
          </Stack>
        ),
      },
    ];

    return (
      <div>
        <h2>Projektų sąrašas</h2>

        <PrimaryButton
          text="Pridėti naują projektą"
          onClick={() => newProjectStore.openAddProjectModal()}
          disabled={newProjectStore.rootStore.loading}
          style={{ marginBottom: 12 }}
        />

        <AddProjectModal newProjectStore={newProjectStore} />
        {newProjectStore.rootStore.projects.map((project) => (
          <UpdateProjectModal key={project.id} store={project} />
        ))}

        {newProjectStore.rootStore.projects.length > 0 ||
        newProjectStore.rootStore.loading ? (
          <ShimmeredDetailsList
            items={newProjectStore.rootStore.projects}
            columns={columns}
            selectionMode={SelectionMode.none}
            enableShimmer={newProjectStore.rootStore.loading}
          />
        ) : (
          <Label>Nerasta projektų.</Label>
        )}
      </div>
    );
  }
);
