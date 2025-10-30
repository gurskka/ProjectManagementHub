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
import { Task } from "../../projectManagmentStores/Task";
import { TaskStatus } from "../../IProjectManagementHubProps";

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

export const UpdateTaskModal = observer(({ store }: { store: Task }) => {
  const projectOptions: IDropdownOption[] = store.rootStore.projects.map(
    (p) => ({
      key: p.id,
      text: p.title,
    })
  );

  return (
    <Modal
      isOpen={store.isModalOpen}
      onDismiss={() => store.closeUpdateTaskModal()}
      isBlocking={false}
      containerClassName={modalStyles.modal}
    >
      <div className={modalStyles.modalContent}>
        <Stack tokens={{ childrenGap: 10 }}>
          <TextField
            label="Pavadinimas"
            value={store.Title}
            onChange={(_, v) => store.setTitle(v || "")}
            disabled={store.rootStore.loading}
          />

          <Dropdown
            label="Projektas"
            options={projectOptions}
            selectedKey={store.ProjectId}
            onChange={(_, o) =>
              store.setProjectId(o ? Number(o.key) : undefined)
            }
            disabled={store.rootStore.loading}
          />

          <Label>Atsakingas</Label>
          <NormalPeoplePicker
            onResolveSuggestions={(filterText) =>
              filterText
                ? (store.rootStore.users
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
              store.setAssignedToId(selected ? Number(selected.id) : undefined);
            }}
            itemLimit={1}
            disabled={store.rootStore.loading}
            defaultSelectedItems={
              store.AssignedTo
                ? (store.rootStore.users
                    .filter((u) => u.Id === store.AssignedToId)
                    .map((u) => ({
                      text: u.Title,
                      id: u.Id.toString(),
                    })) as IPersonaProps[])
                : []
            }
          />

          <DatePicker
            label="Terminas"
            value={store.DueDate ? new Date(store.DueDate) : undefined}
            onSelectDate={(d) => store.setDueDate(d ?? undefined)}
            disabled={store.rootStore.loading}
          />

          <Dropdown
            label="Statusas"
            options={statusOptions}
            selectedKey={store.Status}
            onChange={(_, o) => store.setStatus(o?.key as TaskStatus)}
            disabled={store.rootStore.loading}
          />

          <Stack horizontal tokens={{ childrenGap: 10 }}>
            <PrimaryButton
              text="Atnaujinti užduotį"
              onClick={() =>
                store.update({
                  Title: store.Title,
                  ProjectId: store.ProjectId,
                  Status: store.Status,
                  DueDate: store.DueDate,
                  AssignedToId: store.AssignedToId,
                })
              }
              disabled={store.rootStore.loading}
            />

            <DefaultButton
              text="Atšaukti"
              onClick={() => store.closeUpdateTaskModal()}
              disabled={store.rootStore.loading}
            />
          </Stack>
        </Stack>
      </div>
    </Modal>
  );
});
