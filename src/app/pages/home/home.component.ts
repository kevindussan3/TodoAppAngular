import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { Task } from '../../models/task.model';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  task = signal<Task[]>([
    { title: 'Task 1 PRUEBA', status: true },
    { title: 'Task 2', status: false },
    { title: 'Task 3', status: false },
  ]);
  changeHandler(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    this.addTask(value);
  }

  addTask(title: string) {
    const newTask = {
      id: Date.now(),
      title,
      status: false
    };
    this.task.update((tasks) => [...tasks, newTask]);
  }


  deleteTask(index: number) {
    this.task.update((tasks) => tasks.filter((_, i) => i !== index));
  }

  updateTask(index: number, status: boolean) {
    this.task.update((tasks) => {
      const task = tasks[index];
      return [
        ...tasks.slice(0, index),
        { ...task, status: !status },
        ...tasks.slice(index + 1)
      ];
    });
  }
}
