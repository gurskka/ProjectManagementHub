import { makeAutoObservable } from "mobx";
import { RootStore } from "../RootStore";
import { IDocument } from "../IProjectManagementHubProps";

export class Document {
  Id: number;
  Name: string;
  ServerRelativeUrl: string;
  RelatedProjectId?: number;
  RelatedProjectTitle?: string;
  rootStore: RootStore;

  editingDocument: IDocument | undefined = undefined;

  constructor(data: IDocument, rootStore: RootStore) {
    this.Id = data.Id;
    this.Name = data.Name;
    this.ServerRelativeUrl = data.ServerRelativeUrl;
    this.RelatedProjectId = data.RelatedProjectId;
    this.RelatedProjectTitle = data.RelatedProjectTitle;
    this.rootStore = rootStore;

    makeAutoObservable(this);
  }

  openUpdateDocumentModal(doc: IDocument): void {
    this.editingDocument = doc;
  }

  closeUpdateDocumentModal(): void {
    this.editingDocument = undefined;
  }

  async delete(): Promise<void> {
    this.rootStore.startLoading();
    try {
      await this.rootStore.sp.web
        .getFileByServerRelativePath(this.ServerRelativeUrl)
        .recycle();
      this.rootStore.showSuccess("Dokumentas sėkmingai pašalintas!");
      await this.rootStore.loadDocuments();
    } catch {
      this.rootStore.showError("Klaida trinant dokumentą");
    } finally {
      this.rootStore.endLoading();
    }
  }

  async update(): Promise<void> {
    if (!this.editingDocument) return;

    this.rootStore.startLoading();
    try {
      const list = this.rootStore.sp.web.lists.getByTitle("ProjectDocuments");
      await list.items.getById(this.editingDocument.Id).update({
        RelatedProjectId: this.editingDocument.RelatedProjectId || null,
      });
      this.rootStore.showSuccess("Dokumento projektas sėkmingai atnaujintas!");
      await this.rootStore.loadDocuments();
      this.closeUpdateDocumentModal();
    } catch (err) {
      console.error(err);
      this.rootStore.showError("Nepavyko atnaujinti dokumento projekto");
    } finally {
      this.rootStore.endLoading();
    }
  }

  async download(): Promise<void> {
    this.rootStore.startLoading();
    try {
      const blob = await this.rootStore.sp.web
        .getFileByServerRelativePath(this.ServerRelativeUrl)
        .getBlob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = this.ServerRelativeUrl.split("/").pop() || "file";
      a.click();
      window.URL.revokeObjectURL(url);
      this.rootStore.showSuccess("Dokumentas sėkmingai atsisiųstas!");
    } catch {
      this.rootStore.showError("Klaida atsisiunčiant dokumentą");
    } finally {
      this.rootStore.endLoading();
    }
  }
}
