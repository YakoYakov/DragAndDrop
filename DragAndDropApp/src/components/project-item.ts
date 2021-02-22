import { Draggable } from '../models/drag-drop.js';
import { Project } from '../models/project.js';
import { Component } from './base-component.js';
import { Bind } from '../decorators/autobind.js';

// ProjectItem class
export class ProjectItem
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
