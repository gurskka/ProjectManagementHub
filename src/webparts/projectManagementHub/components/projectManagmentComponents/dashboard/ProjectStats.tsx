import * as React from "react";
import { observer } from "mobx-react-lite";
import { Stack, Text } from "@fluentui/react";
import { Project } from "../../projectManagmentStores/Project";
import "../../styles.css";

export const ProjectStats = observer(
  ({ selectedProject }: { selectedProject: Project }) => {
    return (
      <>
        <Stack
          horizontal
          horizontalAlign="space-evenly"
          tokens={{ childrenGap: 20 }}
        >
          <div className="info-card">
            <Text variant="medium" block className="info-title">
              Projektas
            </Text>
            <Text variant="xLarge" className="info-value">
              {selectedProject.status}
            </Text>
          </div>

          <div className="info-card">
            <Text variant="medium" block className="info-title">
              Užduotys
            </Text>
            <Text variant="xLarge" className="info-value">
              {selectedProject.tasks.length}
            </Text>
          </div>

          <div className="info-card">
            <Text variant="medium" block className="info-title">
              Dokumentai
            </Text>
            <Text variant="xLarge" className="info-value">
              {selectedProject.documents.length}
            </Text>
          </div>
        </Stack>
      </>
    );
  }
);
