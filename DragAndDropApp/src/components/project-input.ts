/// <reference path='base-component.ts' />

namespace App {
    // Project input class
  export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
    titleInputElement: HTMLInputElement;
    descriptionInputElement: HTMLInputElement;
    peopleInputElement: HTMLInputElement;

    constructor() {
      super('project-input', 'app', true, 'user-input');

      this.titleInputElement = this.elementToAttach.querySelector(
        '#title'
      ) as HTMLInputElement;
      this.descriptionInputElement = this.elementToAttach.querySelector(
        '#description'
      ) as HTMLInputElement;
      this.peopleInputElement = this.elementToAttach.querySelector(
        '#people'
      ) as HTMLInputElement;
      this.configure();
    }

    private gatherUserInput(): [string, string, number] | void {
      const title = this.titleInputElement.value;
      const description = this.descriptionInputElement.value;
      const people = this.peopleInputElement.value;

      const titleValidatable: IValidatable = {
        value: title,
        required: true,
      };

      const descrValidatable: IValidatable = {
        value: description,
        required: true,
        minLength: 5,
      };

      const peopleValidatable: IValidatable = {
        value: +people,
        required: true,
        min: 1,
        max: 5,
      };

      if (
        !validate(titleValidatable) ||
        !validate(descrValidatable) ||
        !validate(peopleValidatable)
      ) {
        alert('Invalid input try again!');
      } else {
        return [title, description, +people];
      }
    }
    public configure() {
      this.elementToAttach.addEventListener('submit', this.submitHandler);
    }

    renderContent() {}

    private clearInputs() {
      this.titleInputElement.value = '';
      this.descriptionInputElement.value = '';
      this.peopleInputElement.value = '';
    }

    @Bind
    private submitHandler(event: Event) {
      event.preventDefault();
      const userInput = this.gatherUserInput();

      if (Array.isArray(userInput)) {
        const [title, description, people] = userInput;
        projectState.addProject(title, description, people);
        this.clearInputs();
      }
    }
  }
}