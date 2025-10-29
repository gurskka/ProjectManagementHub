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
import { NewProjectStore } from "../projectManagmentStores/NewProjectStore";
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

export const AddProjectModal = observer(
  ({ newProjectStore }: { newProjectStore: NewProjectStore }) => {
    return (
      <Modal
        isOpen={newProjectStore.isModalOpen}
        onDismiss={() => newProjectStore.closeAddProjectModal()}
        isBlocking={false}
        containerClassName={modalStyles.modal}
      >
        <div className={modalStyles.modalContent}>
          <Stack tokens={{ childrenGap: 10 }}>
            <TextField
              label="Pavadinimas"
              value={newProjectStore.title}
              onChange={(_, v) => newProjectStore.setTitle(v || "")}
              disabled={newProjectStore.rootStore.loading}
            />
            <TextField
              label="Aprašymas"
              multiline
              rows={3}
              value={newProjectStore.description}
              onChange={(_, v) => newProjectStore.setDescription(v || "")}
              disabled={newProjectStore.rootStore.loading}
            />
            <DatePicker
              label="Pradžios data"
              value={newProjectStore.startDate}
              onSelectDate={(d) => newProjectStore.setStartDate(d ?? undefined)}
              disabled={newProjectStore.rootStore.loading}
            />
            <DatePicker
              label="Pabaigos data"
              value={newProjectStore.endDate}
              onSelectDate={(d) => newProjectStore.setEndDate(d ?? undefined)}
              disabled={newProjectStore.rootStore.loading}
            />
            <Dropdown
              label="Statusas"
              options={statusOptions}
              selectedKey={newProjectStore.status}
              onChange={(_, o) =>
                newProjectStore.setStatus(
                  (o?.key as ProjectStatus) ?? undefined
                )
              }
              disabled={newProjectStore.rootStore.loading}
            />
            <Stack horizontal tokens={{ childrenGap: 10 }}>
              <PrimaryButton
                text="Pridėti projektą"
                onClick={() => newProjectStore.addProject()}
                disabled={newProjectStore.rootStore.loading}
              />

              <DefaultButton
                text="Atšaukti"
                onClick={() => newProjectStore.closeAddProjectModal()}
                disabled={newProjectStore.rootStore.loading}
              />
            </Stack>
          </Stack>
        </div>
      </Modal>
    );
  }
);
