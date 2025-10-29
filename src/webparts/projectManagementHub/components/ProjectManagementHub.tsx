import * as React from "react";
import {
  Pivot,
  PivotItem,
  Shimmer,
  MessageBar,
  MessageBarType,
  mergeStyleSets,
} from "@fluentui/react";
import { observer } from "mobx-react-lite";
import {
  IProjectManagementHubProps,
  MessageStatus,
} from "./IProjectManagementHubProps";
import { ProjectsList } from "./projectManagmentComponents/ProjectsList";
import { TasksList } from "./projectManagmentComponents/TasksList";
import { RootStore } from "./RootStore";
import { DocumentsList } from "./projectManagmentComponents/DocumentsList";
import { Dashboard } from "./projectManagmentComponents/Dashboard";

const classNames = mergeStyleSets({
  floatingMessageBar: {
    position: "fixed",
    bottom: 16,
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 9999,
    minWidth: 300,
    maxWidth: 600,
  },
});

const ProjectManagementHub = observer(
  ({ sp }: IProjectManagementHubProps): JSX.Element => {
    const [rootStore] = React.useState(() => new RootStore(sp));

    React.useEffect(() => {
      void rootStore.initialize();
    }, [rootStore]);

    return (
      <div style={{ padding: 16 }}>
        {rootStore.messageVisible && (
          <MessageBar
            messageBarType={
              rootStore.messageStatus === MessageStatus.Success
                ? MessageBarType.success
                : MessageBarType.error
            }
            onDismiss={() => rootStore.clearMessage()}
            isMultiline={false}
            className={classNames.floatingMessageBar}
          >
            {rootStore.message}
          </MessageBar>
        )}

        <Pivot aria-label="Project Management Tabs">
          <PivotItem headerText="Suvestinė">
            {rootStore.loading ? (
              <Shimmer />
            ) : (
              <Dashboard rootStore={rootStore} />
            )}
          </PivotItem>

          <PivotItem headerText="Projektai">
            {rootStore.loading ? (
              <Shimmer />
            ) : (
              <ProjectsList newProjectStore={rootStore.newProjectStore} />
            )}
          </PivotItem>

          <PivotItem headerText="Užduotys">
            {rootStore.loading ? (
              <Shimmer />
            ) : (
              <TasksList newTaskStore={rootStore.newTaskStore} />
            )}
          </PivotItem>

          <PivotItem headerText="Dokumentai">
            {rootStore.loading ? (
              <Shimmer />
            ) : (
              <DocumentsList newDocumentStore={rootStore.newDocumentStore} />
            )}
          </PivotItem>
        </Pivot>
      </div>
    );
  }
);

export default ProjectManagementHub;
