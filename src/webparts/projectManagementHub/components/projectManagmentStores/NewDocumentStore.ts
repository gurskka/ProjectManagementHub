import { makeAutoObservable } from "mobx";
import { SPFI } from "@pnp/sp";
import { RootStore } from "../RootStore";

export class NewDocumentStore {
  sp: SPFI;
  rootStore: RootStore;

  selectedFile: File | undefined = undefined;
  selectedProjectId: number | undefined = undefined;
  fixedProjectId: number | undefined = undefined;

  isUploadModalOpen = false;
  showOverwriteModal = false;
  duplicateFileName: string | undefined;

  constructor(sp: SPFI, rootStore: RootStore) {
    this.sp = sp;
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  openAddDocumentModal(projectId?: number): void {
    if (projectId) {
      this.selectedProjectId = projectId;
      this.fixedProjectId = projectId;
    }
    this.isUploadModalOpen = true;
  }

  closeAddDocumentModal(): void {
    this.isUploadModalOpen = false;
    this.reset();
  }

  reset(): void {
    this.selectedFile = undefined;
    this.selectedProjectId = undefined;
    this.showOverwriteModal = false;
    this.duplicateFileName = undefined;
    this.fixedProjectId = undefined;
  }

  setSelectedFile(file?: File): void {
    this.selectedFile = file;
  }

  setSelectedProject(id?: number): void {
    this.selectedProjectId = id;
  }

  cancelOverwrite(): void {
    this.showOverwriteModal = false;
    this.duplicateFileName = undefined;
  }

  async uploadFileWithProject(): Promise<void> {
    if (!this.selectedFile || !this.selectedProjectId) return;
    this.rootStore.startLoading();

    try {
      const existing = this.rootStore.documents.find(
        (d) => d.Name.toLowerCase() === this.selectedFile!.name.toLowerCase()
      );

      if (existing) {
        this.showOverwriteModal = true;
        this.duplicateFileName = this.selectedFile.name;
        return;
      }

      await this.uploadAndAssign(this.selectedFile.name);
    } catch {
      this.rootStore.showError("Klaida įkeliant dokumentą!");
    } finally {
      this.rootStore.endLoading();
    }
  }

  async overwriteExistingFile(assignAfter = false): Promise<void> {
    if (!this.selectedFile) return;
    this.rootStore.startLoading();

    try {
      await this.uploadAndAssign(this.selectedFile.name, true);
      this.showOverwriteModal = false;
      if (!assignAfter) this.closeAddDocumentModal();
    } catch {
      this.rootStore.showError("Nepavyko perrašyti dokumento!");
    } finally {
      this.rootStore.endLoading();
    }
  }

  async saveAsCopy(assignAfter = false): Promise<void> {
    if (!this.selectedFile) return;
    this.rootStore.startLoading();

    try {
      const newName = await this.generateUniqueFileName(this.selectedFile.name);
      await this.uploadAndAssign(newName);
      this.showOverwriteModal = false;
      if (!assignAfter) this.closeAddDocumentModal();
    } catch {
      this.rootStore.showError("Nepavyko išsaugoti dokumento kopijos!");
    } finally {
      this.rootStore.endLoading();
    }
  }

  private async uploadAndAssign(
    fileName: string,
    overwrite = false
  ): Promise<void> {
    const folder =
      this.sp.web.getFolderByServerRelativePath("ProjectDocuments");
    await folder.files.addUsingPath(fileName, this.selectedFile!, {
      Overwrite: overwrite,
    });

    const list = this.sp.web.lists.getByTitle("ProjectDocuments");
    const items = await list.items
      .select("Id", "FileLeafRef")
      .filter(`FileLeafRef eq '${fileName}'`)();

    if (items.length > 0) {
      await list.items
        .getById(items[0].Id)
        .update({ RelatedProjectId: this.selectedProjectId });
    }

    await this.rootStore.loadDocuments();
    this.rootStore.showSuccess("Dokumentas įkeltas ir priskirtas projektui!");
    this.closeAddDocumentModal();
  }

  async generateUniqueFileName(fileName: string): Promise<string> {
    const parts = fileName.split(".");
    const ext = parts.length > 1 ? "." + parts.pop() : "";
    const base = parts.join(".");
    let newName = `${base}_kopija${ext}`;
    let counter = 1;

    while (
      this.rootStore.documents.some(
        (d) => d.Name.toLowerCase() === newName.toLowerCase()
      )
    ) {
      newName = `${base}_kopija (${counter})${ext}`;
      counter++;
    }
    return newName;
  }
}
