import * as React from "react";
import { observer } from "mobx-react-lite";
import {
  PrimaryButton,
  DefaultButton,
  Stack,
  Text,
  Dropdown,
  Modal,
  TextField,
} from "@fluentui/react";
import { NewDocumentStore } from "../projectManagmentStores/NewDocumentStore";

export const AddDocumentModal = observer(
  ({ newDocumentStore }: { newDocumentStore: NewDocumentStore }) => {
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const triggerFileSelect = (): void => fileInputRef.current?.click();
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
      const file = e.target.files?.[0] || undefined;
      newDocumentStore.setSelectedFile(file);
      e.target.value = "";
    };

    const projectOptions = [
      { key: 0, text: "Pasirinkite projektą" },
      ...newDocumentStore.rootStore.projects.map((p) => ({
        key: p.id,
        text: p.title,
      })),
    ];

    return (
      <Modal
        isOpen={newDocumentStore.isUploadModalOpen}
        onDismiss={() => newDocumentStore.closeAddDocumentModal()}
        isBlocking={true}
      >
        <div style={{ padding: 24, width: 400 }}>
          <h3>Įkelti naują dokumentą</h3>
          <Stack tokens={{ childrenGap: 12 }}>
            <PrimaryButton
              text="Pasirinkti failą"
              onClick={triggerFileSelect}
            />
            {newDocumentStore.selectedFile && (
              <Text>Pasirinkta: {newDocumentStore.selectedFile.name}</Text>
            )}
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
            />

            {newDocumentStore.fixedProjectId ? (
              <TextField
                label="Projektas"
                value={
                  newDocumentStore.rootStore.projects.find(
                    (p) => p.id === newDocumentStore.fixedProjectId
                  )?.title || ""
                }
                disabled
              />
            ) : (
              <Dropdown
                placeholder="Pasirinkite projektą"
                options={projectOptions}
                selectedKey={newDocumentStore.selectedProjectId || 0}
                onChange={(e, option) =>
                  newDocumentStore.setSelectedProject(
                    option?.key !== 0 ? Number(option?.key) : undefined
                  )
                }
                disabled={!newDocumentStore.selectedFile}
                styles={{ dropdown: { width: 300 } }}
              />
            )}
            <Stack
              horizontal
              tokens={{ childrenGap: 8 }}
              style={{ marginTop: 20 }}
            >
              <PrimaryButton
                text="Įkelti dokumentą"
                onClick={() => newDocumentStore.uploadFileWithProject()}
                disabled={
                  !newDocumentStore.selectedFile ||
                  !newDocumentStore.selectedProjectId ||
                  newDocumentStore.rootStore.loading
                }
              />
              <DefaultButton
                text="Atšaukti"
                onClick={() => newDocumentStore.closeAddDocumentModal()}
              />
            </Stack>
          </Stack>

          {newDocumentStore.showOverwriteModal && (
            <div style={{ marginTop: 30 }}>
              <h3>Failas jau egzistuoja</h3>
              <Text>
                Failas <b>{newDocumentStore.duplicateFileName}</b> jau yra
                bibliotekoje. Ką norėtumėte daryti?
              </Text>
              <Stack
                horizontal
                tokens={{ childrenGap: 8 }}
                style={{ marginTop: 20 }}
              >
                <PrimaryButton
                  text="Perrašyti"
                  onClick={() => newDocumentStore.overwriteExistingFile(true)}
                />
                <PrimaryButton
                  text="Išsaugoti kaip kopiją"
                  onClick={() => newDocumentStore.saveAsCopy(true)}
                />
                <DefaultButton
                  text="Atšaukti"
                  onClick={() => newDocumentStore.cancelOverwrite()}
                />
              </Stack>
            </div>
          )}
        </div>
      </Modal>
    );
  }
);
