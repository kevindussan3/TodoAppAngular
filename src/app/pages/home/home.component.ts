import { CommonModule } from '@angular/common';
import { Component, Injector, computed, effect, inject, signal } from '@angular/core';
import { Task } from '../../models/task.model';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  injector = inject(Injector);

  constructor(){
    
  }




  trackTasks(){
    effect(() => {
      const taks = this.task()
      localStorage.setItem('tasks', JSON.stringify(taks));
    },{
      injector: this.injector
    })
  }

  ngOnInit(){
    const storage = localStorage.getItem('tasks')
    if(storage){
      const taks = JSON.parse(storage);
      this.task.set(taks);
    }
    this.trackTasks();
  }

  task = signal<Task[]>([]);

  filter = signal<'all' | 'pending' | 'completed'>('all');
  tasksByfilter = computed(() => {
    const filter = this.filter();
    const taks = this.task();
    if (filter == 'pending') {
      return taks.filter(task => !task.status);
    }
    if (filter == 'completed') {
      return taks.filter(task => task.status);
    }
    return taks;
  });
  newTaskControl = new FormControl('', {
    nonNullable: true, validators: [
      Validators.required
    ]
  });
  changeHandler() {
    if (this.newTaskControl.valid) {
      const value = this.newTaskControl.value.trim()
      if (value !== '') {
        this.addTask(value);
        this.newTaskControl.setValue('');
      }
    }
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

  updateTaskEditing(index: number) {
    this.task.update((tasks) => {
      const taskToEdit = tasks[index];
      const updatedTask = tasks.map((task, i) => {
        return i === index ? { ...taskToEdit, editing: true } : { ...task, editing: false }
      });
      return updatedTask;
    });
  }
  updateTaskText(index: number, event: Event) {
    const input = event.target as HTMLInputElement;
    this.task.update((tasks) => {
      const taskToEdit = tasks[index];
      const updatedTask = tasks.map((task, i) => {
        return i === index ? { ...taskToEdit, title: input.value, editing: false } : { ...task }
      });
      return updatedTask;
    });

  }

  changeFilter(filter: 'all' | 'pending' | 'completed') {
    this.filter.set(filter)

  }

  ClearTask(){
    return this.task.update((tasks) => []);
  }
}
