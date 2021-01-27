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

    private submitHandler(event: Event) {
        event.preventDefault();
        console.log(this.titleInputElement.value);
    }

    private configure() {
        this.elementToAttach.addEventListener('submit', this.submitHandler.bind(this));
    }

    private attach() {
        this.hostElement.insertAdjacentElement('afterbegin', this.elementToAttach);
    }
}

const prjInput = new ProjectInput();
