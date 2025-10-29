import * as React from "react";
import { observer } from "mobx-react-lite";
import {
  PrimaryButton,
  DefaultButton,
  TextField,
  Dropdown,
  IDropdownOption,
  Stack,
  DatePicker,
  Modal,
  mergeStyleSets,
  IPersonaProps,
  NormalPeoplePicker,
  Label,
} from "@fluentui/react";
import { NewTaskStore } from "../projectManagmentStores/NewTaskStore";
import { TaskStatus } from "../IProjectManagementHubProps";

const modalStyles = mergeStyleSets({
  modal: { display: "flex", alignItems: "center", justifyContent: "center" },
  modalContent: {
    background: "white",
    padding: 20,
    minWidth: 400,
    borderRadius: 4,
  },
});

const statusOptions: IDropdownOption[] = [
  { key: TaskStatus.NotStarted, text: "Nepradėta" },
  { key: TaskStatus.InProgress, text: "Vykdoma" },
  { key: TaskStatus.Completed, text: "Baigta" },
];

export const AddTaskModal = observer(
  ({ newTaskStore }: { newTaskStore: NewTaskStore }) => {
    const projectOptions: IDropdownOption[] =
      newTaskStore.rootStore.projects.map((p) => ({
        key: p.id,
        text: p.title,
      }));

    return (
      <Modal
        isOpen={newTaskStore.isModalOpen}
        onDismiss={() => newTaskStore.closeAddTaskModal()}
        isBlocking={false}
        containerClassName={modalStyles.modal}
      >
        <div className={modalStyles.modalContent}>
          <Stack tokens={{ childrenGap: 10 }}>
            <TextField
              label="Pavadinimas"
              value={newTaskStore.title}
              onChange={(_, v) => newTaskStore.setTitle(v || "")}
              disabled={newTaskStore.rootStore.loading}
            />

            {newTaskStore.fixedProjectId ? (
              <TextField
                label="Projektas"
                value={
                  newTaskStore.rootStore.projects.find(
                    (p) => p.id === newTaskStore.fixedProjectId
                  )?.title || ""
                }
                disabled
              />
            ) : (
              <Dropdown
                label="Projektas"
                options={projectOptions}
                selectedKey={newTaskStore.projectId}
                onChange={(_, o) =>
                  newTaskStore.setProjectId(o ? Number(o.key) : undefined)
                }
                disabled={newTaskStore.rootStore.loading}
              />
            )}

            <Label>Atsakingas</Label>
            <NormalPeoplePicker
              onResolveSuggestions={(filterText) =>
                filterText
                  ? (newTaskStore.rootStore.users
                      .filter((u) =>
                        u.Title.toLowerCase().includes(filterText.toLowerCase())
                      )
                      .map((u) => ({
                        text: u.Title,
                        id: u.Id.toString(),
                      })) as IPersonaProps[])
                  : []
              }
              onChange={(items?: IPersonaProps[]) => {
                const selected = items?.[0];
                newTaskStore.setAssignedToId(
                  selected ? Number(selected.id) : undefined
                );
              }}
              itemLimit={1}
              disabled={newTaskStore.rootStore.loading}
              defaultSelectedItems={
                newTaskStore.assignedToId
                  ? (newTaskStore.rootStore.users
                      .filter((u) => u.Id === newTaskStore.assignedToId)
                      .map((u) => ({
                        text: u.Title,
                        id: u.Id.toString(),
                      })) as IPersonaProps[])
                  : []
              }
            />

            <DatePicker
              label="Terminas"
              value={newTaskStore.dueDate}
              onSelectDate={(d) => newTaskStore.setDueDate(d ?? undefined)}
              disabled={newTaskStore.rootStore.loading}
            />

            <Dropdown
              label="Statusas"
              options={statusOptions}
              selectedKey={newTaskStore.status}
              onChange={(_, o) =>
                newTaskStore.setStatus((o?.key as TaskStatus) ?? undefined)
              }
              disabled={newTaskStore.rootStore.loading}
            />

            <Stack horizontal tokens={{ childrenGap: 10 }}>
              <PrimaryButton
                text="Pridėti užduotį"
                onClick={() => newTaskStore.addTask()}
                disabled={newTaskStore.rootStore.loading}
              />

              <DefaultButton
                text="Atšaukti"
                onClick={() => newTaskStore.closeAddTaskModal()}
                disabled={newTaskStore.rootStore.loading}
              />
            </Stack>
          </Stack>
        </div>
      </Modal>
    );
  }
);
