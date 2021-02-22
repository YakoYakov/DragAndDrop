import { Project, ProjectStatus } from '../models/project.js';
import { Component } from './base-component.js';
import { Bind } from '../decorators/autobind.js';
import { DragTarget } from '../models/drag-drop.js';
import { projectState } from '../state/project-state.js';
import { ProjectItem } from './project-item.js';

// ProjectList class

export class ProjectList
  extends Component<HTMLDivElement, HTMLElement>
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
    const prjId = event.dataTransfer!.getData('text/plain');
    projectState.moveProject(
      prjId,
      this.type === 'active' ? ProjectStatus.Active : ProjectStatus.Finished
    );
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
