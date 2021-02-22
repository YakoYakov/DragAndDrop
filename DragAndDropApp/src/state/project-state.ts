import { Project, ProjectStatus } from '../models/project.js';

// Project State Management

type Listener<T> = (items: T[]) => void;

class State<T> {
  protected listers: Listener<T>[] = [];

  addListener(listener: Listener<T>) {
    this.listers.push(listener);
  }
}

export class ProjectState extends State<Project> {
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

    this.updateListeners();
  }

  moveProject(projectId: string, newStatus: ProjectStatus) {
    const foundPrj = this.projects.find((p) => p.id === projectId);

    if (foundPrj != null && foundPrj.status !== newStatus) {
      foundPrj.status = newStatus;
      this.updateListeners();
    }
  }

  updateListeners() {
    for (const listenerFn of this.listers) {
      listenerFn(this.projects.slice());
    }
  }
}

export const projectState = ProjectState.getInstance();
