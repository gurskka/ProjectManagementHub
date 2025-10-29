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
} from "@fluentui/react";
import { Project } from "../projectManagmentStores/Project";
import { ProjectStatus } from "../IProjectManagementHubProps";

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
  { key: ProjectStatus.InProgress, text: "Vykdomas" },
  { key: ProjectStatus.Completed, text: "Baigtas" },
  { key: ProjectStatus.Postponed, text: "Atidėtas" },
];

export const UpdateProjectModal = observer(({ store }: { store: Project }) => {
  return (
    <Modal
      isOpen={store.isModalOpen}
      onDismiss={() => store.closeUpdateProjectModal()}
      isBlocking={false}
      containerClassName={modalStyles.modal}
    >
      <div className={modalStyles.modalContent}>
        <Stack tokens={{ childrenGap: 10 }}>
          <TextField
            label="Pavadinimas"
            value={store.title}
            onChange={(_, v) => store.setTitle(v || "")}
            disabled={store.rootStore.loading}
          />
          <TextField
            label="Aprašymas"
            multiline
            rows={3}
            value={store.description}
            onChange={(_, v) => store.setDescription(v || "")}
            disabled={store.rootStore.loading}
          />
          <DatePicker
            label="Pradžios data"
            value={store.startDate ? new Date(store.startDate) : undefined}
            onSelectDate={(d) => store.setStartDate(d ?? undefined)}
            disabled={store.rootStore.loading}
          />
          <DatePicker
            label="Pabaigos data"
            value={store.endDate ? new Date(store.endDate) : undefined}
            onSelectDate={(d) => store.setEndDate(d ?? undefined)}
            disabled={store.rootStore.loading}
          />
          <Dropdown
            label="Statusas"
            options={statusOptions}
            selectedKey={store.status}
            onChange={(_, o) =>
              store.setStatus((o?.key as ProjectStatus) ?? undefined)
            }
            disabled={store.rootStore.loading}
          />
          <Stack horizontal tokens={{ childrenGap: 10 }}>
            <PrimaryButton
              text="Atnaujinti projektą"
              onClick={() =>
                store.update({
                  Title: store.title,
                  Description: store.description,
                  StartDate: store.startDate,
                  EndDate: store.endDate,
                  Status: store.status,
                })
              }
              disabled={store.rootStore.loading}
            />

            <DefaultButton
              text="Atšaukti"
              onClick={() => store.closeUpdateProjectModal()}
              disabled={store.rootStore.loading}
            />
          </Stack>
        </Stack>
      </div>
    </Modal>
  );
});
