import * as React from "react";
import { observer } from "mobx-react-lite";
import { Project } from "../../projectManagmentStores/Project";
import { getFileIcon } from "../../utils/getFileIcon";
import { RootStore } from "../../RootStore";
import "../../styles.css";

export const ProjectDocuments = observer(
  ({
    selectedProject,
    rootStore,
  }: {
    selectedProject: Project;
    rootStore: RootStore;
  }) => {
    return (
      <>
        {selectedProject.documents.length > 0 && (
          <div className="documents-container">
            <h4>Dokumentai</h4>
            <div className="documents-list">
              {selectedProject.documents.map((doc) => {
                const extension =
                  doc.Name.split(".").pop()?.toLowerCase() || "genericfile";

                const iconUrl = getFileIcon(extension);

                return (
                  <div
                    key={doc.Id}
                    className="document-item"
                    onClick={() =>
                      rootStore.documents
                        .find((d) => d.Id === doc.Id)
                        ?.download()
                    }
                  >
                    <img
                      src={iconUrl}
                      alt={extension}
                      className="document-icon"
                    />
                    <span className="document-name">{doc.Name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </>
    );
  }
);
