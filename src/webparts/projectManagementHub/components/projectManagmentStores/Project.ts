import { makeAutoObservable } from "mobx";
import { RootStore } from "../RootStore";
import {
  ITask,
  IDocument,
  IProject,
  ProjectStatus,
} from "../IProjectManagementHubProps";

export class Project {
  id: number;
  title: string;
  description?: string;
  status?: ProjectStatus;
  startDate?: string;
  endDate?: string;
  rootStore: RootStore;

  isModalOpen: boolean = false;

  constructor(data: IProject, rootStore: RootStore) {
    this.rootStore = rootStore;
    this.id = data.ID;
    this.title = data.Title;
    this.description = data.Description;
    this.status = data.Status;
    this.startDate = data.StartDate;
    this.endDate = data.EndDate;

    makeAutoObservable(this);
  }

  get tasks(): ITask[] {
    return this.rootStore.tasks.filter((t) => t.ProjectId === this.id);
  }

  get documents(): IDocument[] {
    return this.rootStore.documents.filter(
      (d) => d.RelatedProjectId === this.id
    );
  }

  openUpdateProjectModal(): void {
    this.isModalOpen = true;
  }

  closeUpdateProjectModal(): void {
    this.isModalOpen = false;
  }
  setTitle(value: string): void {
    this.title = value;
  }

  setDescription(value: string): void {
    this.description = value;
  }

  setStartDate(date?: Date): void {
    this.startDate = date ? date.toISOString() : undefined;
  }

  setEndDate(date?: Date): void {
    this.endDate = date ? date.toISOString() : undefined;
  }

  setStatus(status?: ProjectStatus): void {
    this.status = status;
  }

  async delete(): Promise<void> {
    this.rootStore.startLoading();
    try {
      await this.rootStore.sp.web.lists
        .getByTitle("Projects")
        .items.getById(this.id)
        .recycle();
      this.rootStore.showSuccess("Projektas sėkmingai pašalintas!");
      await this.rootStore.loadProjects();
    } catch {
      this.rootStore.showError("Klaida trinant projektą");
    } finally {
      this.rootStore.endLoading();
    }
  }

  async update(data: Partial<IProject>): Promise<void> {
    this.rootStore.startLoading();
    try {
      await this.rootStore.sp.web.lists
        .getByTitle("Projects")
        .items.getById(this.id)
        .update(data);
      this.rootStore.showSuccess("Projektas sėkmingai atnaujintas!");
      await this.rootStore.loadProjects();
    } catch {
      this.rootStore.showError("Nepavyko atnaujinti projekto!");
    } finally {
      this.rootStore.endLoading();
    }
  }
}
