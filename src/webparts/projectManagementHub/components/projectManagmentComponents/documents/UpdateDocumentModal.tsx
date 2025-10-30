import * as React from "react";
import { observer } from "mobx-react-lite";
import {
  PrimaryButton,
  DefaultButton,
  Stack,
  Dropdown,
  Text,
  Modal,
} from "@fluentui/react";
import { Document } from "../../projectManagmentStores/Document";

export const UpdateDocumentModal = observer(
  ({ store }: { store: Document }) => {
    if (!store.editingDocument) return null;

    return (
      <Modal
        isOpen={!!store.editingDocument}
        onDismiss={() => store.closeUpdateDocumentModal()}
        isBlocking={true}
      >
        <div style={{ padding: 24 }}>
          <h3>Redaguoti dokumento projektą</h3>
          <Text>{store.editingDocument.Name}</Text>
          <Dropdown
            placeholder="Pasirinkite projektą"
            options={store.rootStore.projects.map((p) => ({
              key: p.id,
              text: p.title,
            }))}
            selectedKey={store.editingDocument.RelatedProjectId || 0}
            onChange={(e, option) => {
              if (option && store.editingDocument) {
                store.editingDocument.RelatedProjectId =
                  option.key !== 0 ? Number(option.key) : undefined;
              }
            }}
            styles={{
              dropdown: { width: 300, marginTop: 12, marginBottom: 20 },
            }}
          />
          <Stack horizontal tokens={{ childrenGap: 8 }}>
            <PrimaryButton text="Išsaugoti" onClick={() => store.update()} />
            <DefaultButton
              text="Atšaukti"
              onClick={() => store.closeUpdateDocumentModal()}
            />
          </Stack>
        </div>
      </Modal>
    );
  }
);
