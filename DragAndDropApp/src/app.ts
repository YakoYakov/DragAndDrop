// Validation
interface IValidatable {
    value: string | number,
    required?: boolean,
    minLength?: number,
    maxLength?: number,
    min?: number,
    max?: number
}

function validate(userInput: IValidatable) {
    let isValid = true;

    switch (typeof(userInput.value)) {
        case "string":
            if(userInput.required) {
                isValid = isValid && userInput.value.trim().length !== 0;
            }

            if (userInput.minLength) {
                isValid = isValid && userInput.value.trim().length >= userInput.minLength;
            }

            if (userInput.maxLength) {
                isValid = isValid && userInput.value.trim().length <= userInput.maxLength;
            }
            break;
        case "number":
            if(userInput.required) {
                isValid = isValid && userInput.value != null;
            }

            if (userInput.min) {
                isValid = isValid && userInput.value >= userInput.min;
            }

            if (userInput.max) {
                isValid = isValid && userInput.value <= userInput.max;
            }
            break;
        default:
            break;
    }

    return isValid;
}

// AutoBind decorator

function Bind(_: any, _2: string | symbol, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  const fixedBindingMethod: PropertyDescriptor = {
    configurable: true,
    enumerable: false,
    get() {
      const boundFunction = originalMethod.bind(this);
      return boundFunction;
    },
  };
  return fixedBindingMethod;
}

// Project input class

class ProjectInput {
    templateElement: HTMLTemplateElement;
    hostElement: HTMLDivElement;
    elementToAttach: HTMLFormElement;
    titleInputElement: HTMLInputElement;
    descriptionInputElement: HTMLInputElement;
    peopleInputElement: HTMLInputElement;

    constructor() {
        this.templateElement = document.getElementById(
            'project-input'
        )! as HTMLTemplateElement;

        this.hostElement = document.getElementById('app')! as HTMLDivElement;

        this.elementToAttach = document.importNode(
            this.templateElement.content,
            true
        ).firstElementChild as HTMLFormElement;

        this.elementToAttach.id = 'user-input';

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
        this.attach();
    }

    private gatherUserInput(): [string, string, number] | void {
        const title = this.titleInputElement.value;
        const description = this.descriptionInputElement.value;
        const people = this.peopleInputElement.value;

        const titleValidatable: IValidatable = {
            value: title,
            required: true
        };

        const descrValidatable: IValidatable = {
            value: description,
            required: true,
            minLength: 5
        };

        const peopleValidatable: IValidatable = {
            value: +people,
            required: true,
            min: 1,
            max: 5
        };

        if (!validate(titleValidatable) || !validate(descrValidatable) || !validate(peopleValidatable)) {
            alert('Invalid input try again!')
        } else {
            return [title, description, +people];
        }
    }

    private clearInputs() {
        this.titleInputElement.value = '';
        this.descriptionInputElement.value = '';
        this.peopleInputElement.value = '';
    }

    @Bind
    private submitHandler(event: Event) {
        event.preventDefault();
        const userInput = this.gatherUserInput();

        if(Array.isArray(userInput)) {
            const [title, description, people] = userInput;
            console.log(title, description, people);
            this.clearInputs();
        }
    }

    private configure() {
        this.elementToAttach.addEventListener('submit', this.submitHandler);
    }

    private attach() {
        this.hostElement.insertAdjacentElement('afterbegin', this.elementToAttach);
    }
}

const prjInput = new ProjectInput();
