import { makeAutoObservable } from "mobx";
import { RootStore } from "../RootStore";
import { ITask, TaskStatus } from "../IProjectManagementHubProps";

export class Task {
  ID: number;
  Title: string;
  DueDate?: string;
  Status: TaskStatus;
  AssignedTo?: { Id: number; Title: string }[];
  AssignedToId?: number;
  ProjectId?: number;
  ProjectTitle?: string;
  rootStore: RootStore;

  isModalOpen: boolean = false;

  constructor(data: ITask, rootStore: RootStore) {
    this.rootStore = rootStore;
    this.ID = data.ID;
    this.Title = data.Title;
    this.DueDate = data.DueDate;
    this.Status = data.Status;
    this.AssignedTo = data.AssignedTo;
    this.AssignedToId = data.AssignedToId;
    this.ProjectId = data.ProjectId;
    this.ProjectTitle = data.ProjectTitle;

    makeAutoObservable(this);
  }

  openUpdateTaskModal(): void {
    this.isModalOpen = true;
    if (this.AssignedTo && this.AssignedTo.length > 0) {
      this.AssignedToId = this.AssignedTo[0].Id;
    }
  }

  closeUpdateTaskModal(): void {
    this.isModalOpen = false;
  }

  setTitle(value: string): void {
    this.Title = value;
  }

  setProjectId(value?: number): void {
    this.ProjectId = value;
  }

  setDueDate(date?: Date): void {
    this.DueDate = date ? date.toISOString() : undefined;
  }

  setAssignedToId(value?: number): void {
    this.AssignedToId = value;
  }

  setStatus(status: TaskStatus): void {
    this.Status = status;
  }

  async delete(): Promise<void> {
    this.rootStore.startLoading();
    try {
      await this.rootStore.sp.web.lists
        .getByTitle("Tasks")
        .items.getById(this.ID)
        .recycle();
      this.rootStore.showSuccess("Užduotis sėkmingai pašalinta!");
      await this.rootStore.loadTasks();
    } catch (err) {
      console.error("Klaida trinant užduotį:", err);
      this.rootStore.showError("Klaida trinant užduotį!");
    } finally {
      this.rootStore.endLoading();
    }
  }

  async update(data: Partial<ITask>): Promise<void> {
    this.rootStore.startLoading();
    try {
      await this.rootStore.sp.web.lists
        .getByTitle("Tasks")
        .items.getById(this.ID)
        .update(data);
      this.rootStore.showSuccess("Užduotis sėkmingai atnaujinta!");
      await this.rootStore.loadTasks();
    } catch (err) {
      console.error("Nepavyko atnaujinti užduoties:", err);
      this.rootStore.showError("Nepavyko atnaujinti užduoties!");
    } finally {
      this.rootStore.endLoading();
    }
  }
}
