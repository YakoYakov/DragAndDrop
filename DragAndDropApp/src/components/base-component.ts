namespace App {
  // Component Base Class
 export abstract class Component<T extends HTMLElement, U extends HTMLElement> {
    templateElement: HTMLTemplateElement;
    hostElement: T;
    elementToAttach: U;

    constructor(
      templateId: string,
      hostElementId: string,
      insertAtStart: boolean,
      newElementId?: string
    ) {
      this.templateElement = document.getElementById(
        templateId
      )! as HTMLTemplateElement;

      this.hostElement = document.getElementById(hostElementId)! as T;

      const importedNod = document.importNode(
        this.templateElement.content,
        true
      );
      this.elementToAttach = importedNod.firstElementChild as U;
      if (newElementId) {
        this.elementToAttach.id = newElementId;
      }
      this.attach(insertAtStart);
    }

    private attach(insertInBegining: boolean) {
      this.hostElement.insertAdjacentElement(
        insertInBegining ? 'afterbegin' : 'beforeend',
        this.elementToAttach
      );
    }

    abstract configure(): void;
    abstract renderContent(): void;
  }
}
