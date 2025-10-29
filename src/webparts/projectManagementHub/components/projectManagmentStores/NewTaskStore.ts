import { makeAutoObservable } from "mobx";
import { SPFI } from "@pnp/sp";
import { TaskStatus } from "../IProjectManagementHubProps";
import { RootStore } from "../RootStore";
import { Task } from "./Task";

export class NewTaskStore {
  sp: SPFI;
  rootStore: RootStore;

  isModalOpen: boolean = false;
  title: string = "";
  projectId?: number;
  dueDate?: Date;
  status: TaskStatus | undefined = undefined;
  task?: Task;
  assignedToId?: number;

  fixedProjectId: number | undefined = undefined;

  constructor(sp: SPFI, rootStore: RootStore) {
    this.sp = sp;
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  setTitle(value: string): void {
    this.title = value;
  }

  setProjectId(value?: number): void {
    this.projectId = value;
  }

  setDueDate(date?: Date): void {
    this.dueDate = date;
  }

  setAssignedToId(value?: number): void {
    this.assignedToId = value;
  }

  setStatus(status: TaskStatus): void {
    this.status = status;
  }

  openAddTaskModal(projectId?: number): void {
    if (projectId) {
      this.projectId = projectId;
      this.fixedProjectId = projectId;
    }
    this.isModalOpen = true;
  }

  closeAddTaskModal(): void {
    this.isModalOpen = false;
    this.clearAddTaskForm();
  }

  clearAddTaskForm(): void {
    this.title = "";
    this.projectId = undefined;
    this.dueDate = undefined;
    this.status = undefined;
    this.task = undefined;
    this.assignedToId = undefined;
  }

  async addTask(): Promise<void> {
    if (
      !this.title ||
      !this.projectId ||
      !this.dueDate ||
      !this.status ||
      !this.assignedToId
    ) {
      alert("Prašome užpildyti tuščius laukus!");
      return;
    }

    const data = {
      Title: this.title,
      ProjectId: this.projectId,
      DueDate: this.dueDate ? this.dueDate.toISOString() : undefined,
      Status: this.status,
      AssignedToId: this.assignedToId,
    };

    this.rootStore.startLoading();
    try {
      await this.sp.web.lists.getByTitle("Tasks").items.add(data);
      this.rootStore.showSuccess("Užduotis sėkmingai pridėta!");
      await this.rootStore.loadTasks();
      this.closeAddTaskModal();
    } catch {
      this.rootStore.showError("Nepavyko išsaugoti užduoties!");
    } finally {
      this.rootStore.endLoading();
    }
  }
}
