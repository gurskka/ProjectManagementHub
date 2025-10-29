import * as React from "react";
import { observer } from "mobx-react-lite";
import {
  PrimaryButton,
  IconButton,
  Stack,
  Text,
  IColumn,
  ShimmeredDetailsList,
  SelectionMode,
  Dropdown,
} from "@fluentui/react";
import { NewDocumentStore } from "../projectManagmentStores/NewDocumentStore";
import { AddDocumentModal } from "./AddDocumentModal";
import { UpdateDocumentModal } from "./UpdateDocumentModal";

export const DocumentsList = observer(
  ({
    newDocumentStore,
  }: {
    newDocumentStore: NewDocumentStore;
  }): JSX.Element => {
    const columns: IColumn[] = [
      { key: "name", name: "Pavadinimas", fieldName: "Name", minWidth: 200 },
      {
        key: "project",
        name: "Susijęs projektas",
        fieldName: "RelatedProjectTitle",
        minWidth: 200,
      },
      {
        key: "actions",
        name: "Veiksmai",
        minWidth: 250,
        onRender: (item) => (
          <Stack horizontal tokens={{ childrenGap: 8 }}>
            <IconButton
              iconProps={{ iconName: "Download" }}
              onClick={() => item.download()}
              disabled={newDocumentStore.rootStore.loading}
            />
            <IconButton
              iconProps={{ iconName: "Edit" }}
              onClick={() => item.openUpdateDocumentModal(item)}
              disabled={newDocumentStore.rootStore.loading}
            />
            <IconButton
              iconProps={{ iconName: "Delete" }}
              onClick={() => item.delete()}
              disabled={newDocumentStore.rootStore.loading}
            />
          </Stack>
        ),
      },
    ];

    return (
      <div>
        <h2>Dokumentų biblioteka</h2>

        <Stack
          horizontal
          tokens={{ childrenGap: 8 }}
          verticalAlign="center"
          style={{ marginBottom: 12 }}
        >
          <PrimaryButton
            text="Įkelti dokumentą"
            onClick={() => newDocumentStore.openAddDocumentModal()}
            disabled={newDocumentStore.rootStore.loading}
          />
        </Stack>

        <Dropdown
          placeholder="Filtruoti pagal projektą"
          label="Filtruoti pagal projektą"
          options={[
            { key: 0, text: "Visi projektai" },
            ...newDocumentStore.rootStore.projects.map((p) => ({
              key: p.id,
              text: p.title,
            })),
          ]}
          selectedKey={
            newDocumentStore.rootStore.selectedProject
              ? newDocumentStore.rootStore.selectedProject.id
              : 0
          }
          onChange={(e, option) => {
            const project = newDocumentStore.rootStore.projects.find(
              (p) => p.id === option?.key
            );
            newDocumentStore.rootStore.setSelectedProject(project ?? undefined);
          }}
          styles={{ dropdown: { width: 300, marginBottom: 12 } }}
        />

        {newDocumentStore.rootStore.documents.length > 0 ||
        newDocumentStore.rootStore.loading ? (
          <ShimmeredDetailsList
            items={newDocumentStore.rootStore.filteredDocuments}
            columns={columns}
            selectionMode={SelectionMode.none}
            enableShimmer={newDocumentStore.rootStore.loading}
          />
        ) : (
          <Text>Nerasta dokumentų.</Text>
        )}

        <AddDocumentModal newDocumentStore={newDocumentStore} />
        {newDocumentStore.rootStore.documents.map((doc) => (
          <UpdateDocumentModal key={doc.Id} store={doc} />
        ))}
      </div>
    );
  }
);
