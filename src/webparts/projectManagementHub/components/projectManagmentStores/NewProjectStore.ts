import { makeAutoObservable } from "mobx";
import { SPFI } from "@pnp/sp";
import { ProjectStatus } from "../IProjectManagementHubProps";
import { RootStore } from "../RootStore";
import { Project } from "./Project";

export class NewProjectStore {
  sp: SPFI;
  rootStore: RootStore;

  title: string = "";
  description: string = "";
  startDate?: Date;
  endDate?: Date;
  status: ProjectStatus | undefined = undefined;
  isModalOpen: boolean = false;
  project?: Project;

  constructor(sp: SPFI, rootStore: RootStore) {
    this.sp = sp;
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  setTitle(value: string): void {
    this.title = value;
  }

  setDescription(value: string): void {
    this.description = value;
  }

  setStartDate(date?: Date): void {
    this.startDate = date;
  }

  setEndDate(date?: Date): void {
    this.endDate = date;
  }

  setStatus(status?: ProjectStatus): void {
    this.status = status;
  }

  openAddProjectModal(): void {
    this.isModalOpen = true;
  }

  closeAddProjectModal(): void {
    this.isModalOpen = false;
    this.clearAddProjectForm();
  }

  clearAddProjectForm(): void {
    this.title = "";
    this.description = "";
    this.startDate = undefined;
    this.endDate = undefined;
    this.status = undefined;
    this.project = undefined;
  }

  async addProject(): Promise<void> {
    if (
      !this.title ||
      !this.description ||
      !this.startDate ||
      !this.endDate ||
      !this.status
    ) {
      alert("Prašome užpildyti tuščius laukus!");
      return;
    }

    const data = {
      Title: this.title,
      Description: this.description,
      StartDate: this.startDate ? this.startDate.toISOString() : undefined,
      EndDate: this.endDate ? this.endDate.toISOString() : undefined,
      Status: this.status,
    };

    this.rootStore.startLoading();
    try {
      await this.sp.web.lists.getByTitle("Projects").items.add(data);
      this.rootStore.showSuccess("Projektas sėkmingai pridėtas!");
      await this.rootStore.loadProjects();
      this.closeAddProjectModal();
    } catch {
      this.rootStore.showError("Nepavyko pridėti projekto!");
    } finally {
      this.rootStore.endLoading();
    }
  }
}
