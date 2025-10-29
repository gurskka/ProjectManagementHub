import { SPFI } from "@pnp/sp";
import {
  IProject,
  ITask,
  IDocument,
  MessageStatus,
  TaskStatus,
} from "./IProjectManagementHubProps";
import { makeAutoObservable } from "mobx";
import { NewProjectStore } from "./projectManagmentStores/NewProjectStore";
import { NewTaskStore } from "./projectManagmentStores/NewTaskStore";
import { NewDocumentStore } from "./projectManagmentStores/NewDocumentStore";
import { Project } from "./projectManagmentStores/Project";
import { Task } from "./projectManagmentStores/Task";
import { Document } from "./projectManagmentStores/Document";
import { ISiteUserInfo } from "@pnp/sp/site-users/types";

export class RootStore {
  newProjectStore: NewProjectStore;
  newTaskStore: NewTaskStore;
  newDocumentStore: NewDocumentStore;

  sp: SPFI;

  users: ISiteUserInfo[] = [];
  projects: Project[] = [];
  documents: Document[] = [];
  tasks: Task[] = [];

  loading: boolean = false;

  message: string = "";
  messageStatus: MessageStatus = MessageStatus.None;
  messageVisible: boolean = false;

  selectedProject: Project | undefined = undefined;

  constructor(sp: SPFI) {
    this.sp = sp;
    this.newProjectStore = new NewProjectStore(sp, this);
    this.newTaskStore = new NewTaskStore(sp, this);
    this.newDocumentStore = new NewDocumentStore(sp, this);

    makeAutoObservable(this);
  }

  async initialize(): Promise<void> {
    try {
      await this.loadUsers();

      await Promise.all([
        this.loadProjects(),
        this.loadTasks(),
        this.loadDocuments(),
      ]);
    } catch {
      this.showError("Klaida inicializuojant duomenis!");
    }
  }

  async loadUsers(): Promise<void> {
    this.startLoading();
    try {
      const users = await this.sp.web.siteUsers();
      this.users = users;
    } catch (err) {
      console.error("Klaida gaunant vartotojus:", err);
      this.users = [];
    } finally {
      this.endLoading();
    }
  }

  async loadProjects(): Promise<void> {
    this.startLoading();
    try {
      const items = await this.sp.web.lists
        .getByTitle("Projects")
        .items<IProject[]>();
      this.projects = items.map((item) => new Project(item, this));
    } catch {
      this.showError("Klaida gaunant projektus!");
    } finally {
      this.endLoading();
    }
  }

  async loadDocuments(): Promise<void> {
    this.startLoading();
    try {
      const items = await this.sp.web.lists
        .getByTitle("ProjectDocuments")
        .items.select(
          "Id",
          "FileLeafRef",
          "FileRef",
          "RelatedProject/Id",
          "RelatedProject/Title"
        )
        .expand("RelatedProject")();

      this.documents = items.map(
        (item) =>
          new Document(
            {
              Id: item.Id,
              Name: item.FileLeafRef,
              ServerRelativeUrl: item.FileRef,
              RelatedProjectId: item.RelatedProject?.Id,
              RelatedProjectTitle: item.RelatedProject?.Title,
            },
            this
          )
      );
    } catch {
      this.showError("Klaida gaunant dokumentus:");
    } finally {
      this.endLoading();
    }
  }

  async loadTasks(): Promise<void> {
    this.startLoading();
    try {
      const items = await this.sp.web.lists
        .getByTitle("Tasks")
        .items.select(
          "ID,Title,DueDate,Status,AssignedTo/Id,AssignedTo/Title,Project/Id,Project/Title"
        )
        .expand("AssignedTo,Project")();

      this.tasks = items.map(
        (item) =>
          new Task(
            {
              ID: item.ID,
              Title: item.Title,
              DueDate: item.DueDate,
              Status: item.Status as TaskStatus,
              AssignedTo: item.AssignedTo
                ? (Array.isArray(item.AssignedTo)
                    ? item.AssignedTo
                    : [item.AssignedTo]
                  ).map((a: { Id: number; Title: string }) => ({
                    Id: a.Id,
                    Title: a.Title,
                  }))
                : undefined,
              ProjectId: item.Project?.Id,
              ProjectTitle: item.Project?.Title,
            },
            this
          )
      );
    } catch {
      this.showError("Klaida gaunant užduotis:");
      this.tasks = [];
    } finally {
      this.endLoading();
    }
  }

  startLoading(): void {
    this.loading = true;
  }

  endLoading(): void {
    this.loading = false;
  }

  showSuccess(message: string): void {
    this.message = message;
    this.messageStatus = MessageStatus.Success;
    this.messageVisible = true;
    this.autoHide();
  }

  showError(message: string): void {
    this.message = message;
    this.messageStatus = MessageStatus.Error;
    this.messageVisible = true;
    this.autoHide();
  }

  clearMessage(): void {
    this.messageVisible = false;
    this.message = "";
    this.messageStatus = MessageStatus.None;
  }

  private autoHide(): void {
    setTimeout(() => this.clearMessage(), 5000);
  }

  setSelectedProject(project: Project | undefined): void {
    this.selectedProject = project;
  }

  get filteredDocuments(): IDocument[] {
    if (!this.selectedProject) return this.documents;
    return this.documents.filter(
      (doc) => doc.RelatedProjectId === this.selectedProject?.id
    );
  }

  get filteredTasks(): ITask[] {
    return this.selectedProject
      ? this.tasks.filter((t) => t.ProjectId === this.selectedProject?.id)
      : this.tasks;
  }
}
