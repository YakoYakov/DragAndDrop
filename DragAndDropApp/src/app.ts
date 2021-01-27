class ProjectInput {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;

  constructor() {
    this.templateElement = document.getElementById(
      'project-input'
    )! as HTMLTemplateElement;

    this.hostElement = document.getElementById('app')! as HTMLDivElement;

    const elementToAttach = document.importNode(
      this.templateElement.content,
      true
    ).firstElementChild as HTMLFormElement;

    this.attach(elementToAttach);
  }

  private attach(elementToAttach: HTMLFormElement) {
    this.hostElement.insertAdjacentElement('afterbegin', elementToAttach);
  }
}

const prjInput = new ProjectInput();