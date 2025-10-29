import { SPFI } from "@pnp/sp";

export interface IProjectManagementHubProps {
  description: string;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
  sp: SPFI;
}

export enum TaskStatus {
  NotStarted = "Nepradėta",
  InProgress = "Vykdoma",
  Completed = "Baigta",
}

export interface ITask {
  ID: number;
  Title: string;
  AssignedTo?: { Title: string; Id: number }[];
  AssignedToId?: number;
  DueDate?: string;
  Status: TaskStatus;
  ProjectId?: number;
  ProjectTitle?: string;
}

export enum ProjectStatus {
  InProgress = "Vykdomas",
  Completed = "Baigtas",
  Postponed = "Atidėtas",
}

export interface IProject {
  ID: number;
  Title: string;
  Description: string;
  StartDate: string;
  EndDate: string;
  Status: ProjectStatus;
}

export interface IDocument {
  Id: number;
  Name: string;
  ServerRelativeUrl: string;
  RelatedProjectId?: number;
  RelatedProjectTitle?: string;
}

export interface User {
  Id: number;
  Title: string;
}

export enum MessageStatus {
  None = "none",
  Success = "success",
  Error = "error",
}
