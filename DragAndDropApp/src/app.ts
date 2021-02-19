// Drag & Drop Interfaces
interface Draggable {
  dragStartHandler(event: DragEvent): void;
  dragEndHandler(event: DragEvent): void;
}

interface DragTarget {
  dragOverHandler(event: DragEvent): void;
  dropHandler(event: DragEvent): void;
  dragLeaveHandler(event: DragEvent): void;
}

// Project Type
enum ProjectStatus {
  Active,
  Finished,
}

class Project {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public people: number,
    public status: ProjectStatus
  ) {}
}

// Project State Management
type Listener<T> = (items: T[]) => void;

class State<T> {
  protected listers: Listener<T>[] = [];

  addListener(listener: Listener<T>) {
    this.listers.push(listener);
  }
}

class ProjectState extends State<Project> {
  private projects: Project[] = [];
  private static instance: ProjectState;

  private constructor() {
    super();
  }

  static getInstance() {
    if (this.instance) {
      return this.instance;
    }

    this.instance = new ProjectState();
    return this.instance;
  }

  addProject(title: string, description: string, people: number) {
    const newProject = new Project(
      Math.random().toString(),
      title,
      description,
      people,
      ProjectStatus.Active
    );

    this.projects.push(newProject);

    for (const listenerFn of this.listers) {
      listenerFn(this.projects.slice());
    }
  }
}

const projectState = ProjectState.getInstance();

// Validation
interface IValidatable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

function validate(userInput: IValidatable) {
  let isValid = true;

  switch (typeof userInput.value) {
    case 'string':
      if (userInput.required) {
        isValid = isValid && userInput.value.trim().length !== 0;
      }

      if (userInput.minLength) {
        isValid =
          isValid && userInput.value.trim().length >= userInput.minLength;
      }

      if (userInput.maxLength) {
        isValid =
          isValid && userInput.value.trim().length <= userInput.maxLength;
      }
      break;
    case 'number':
      if (userInput.required) {
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

// Component Base Class
abstract class Component<T extends HTMLElement, U extends HTMLElement> {
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

    const importedNod = document.importNode(this.templateElement.content, true);
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

// ProjectItem class

class ProjectItem
  extends Component<HTMLUListElement, HTMLLIElement>
  implements Draggable {
  private project: Project;

  get persons() {
    return this.project.people === 1
      ? '1 person'
      : `${this.project.people} persons`;
  }

  constructor(hostId: string, project: Project) {
    super('single-project', hostId, false, project.id);
    this.project = project;

    this.configure();
    this.renderContent();
  }

  @Bind
  dragStartHandler(event: DragEvent): void {
    event.dataTransfer!.setData('text/plain', this.project.id);
    event.dataTransfer!.effectAllowed = 'move';
  }

  @Bind
  dragEndHandler(_: DragEvent): void {
    console.log('DragEnd');
  }

  configure(): void {
    this.elementToAttach.addEventListener('dragstart', this.dragStartHandler);
    this.elementToAttach.addEventListener('dragend', this.dragEndHandler);
  }

  renderContent(): void {
    this.elementToAttach.querySelector('h2')!.textContent = this.project.title;
    this.elementToAttach.querySelector('h3')!.textContent =
      this.persons + ' assigned';
    this.elementToAttach.querySelector(
      'p'
    )!.textContent = this.project.description;
  }
}

// ProjectList class

class ProjectList extends Component<HTMLDivElement, HTMLElement>
implements DragTarget {
  assignedProjects: Project[];

  constructor(private type: 'active' | 'finished') {
    super('project-list', 'app', false, `${type}-projects`);

    this.assignedProjects = [];
    this.configure();
    this.renderContent();
  }

  @Bind
  dragOverHandler(event: DragEvent): void {
    if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
      event.preventDefault();
      const listEl = this.elementToAttach.querySelector('ul')!;
      listEl.classList.add('droppable');
    }
    
  }

  @Bind
  dragLeaveHandler(_: DragEvent): void {
    const listEl = this.elementToAttach.querySelector('ul')!;
    listEl.classList.remove('droppable');
  }

  @Bind
  dropHandler(event: DragEvent): void {
    console.log(event.dataTransfer?.getData('text/plain'));
  }

  private renderProjects() {
    const listEl = document.getElementById(
      `${this.type}-projects-list`
    )! as HTMLUListElement;
    listEl.innerHTML = '';
    for (const prjItem of this.assignedProjects) {
      new ProjectItem(this.elementToAttach.querySelector('ul')!.id, prjItem);
    }
  }

  configure() {
    this.elementToAttach.addEventListener('dragover', this.dragOverHandler);
    this.elementToAttach.addEventListener('dragleave', this.dragLeaveHandler);
    this.elementToAttach.addEventListener('drop', this.dropHandler);
    projectState.addListener((projects: Project[]) => {
      const relevantProjects = projects.filter((project) => {
        if (this.type === 'active') {
          return project.status === ProjectStatus.Active;
        }
        return project.status === ProjectStatus.Finished;
      });
      this.assignedProjects = relevantProjects;
      this.renderProjects();
    });
  }

  public renderContent() {
    const listId = `${this.type}-projects-list`;
    this.elementToAttach.querySelector('ul')!.id = listId;
    this.elementToAttach.querySelector('h2')!.textContent =
      this.type.toUpperCase() + ' PROJECTS';
  }
}

// Project input class

class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
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

const prjInput = new ProjectInput();
const activePrjList = new ProjectList('active');
const finishedPrjList = new ProjectList('finished');
