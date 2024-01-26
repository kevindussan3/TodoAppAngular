import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';


@Component({
  selector: 'app-labs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './labs.component.html', // Updated file path
  styleUrl: './labs.component.css'
})


export class LabsComponent {
  task = [
    'Task 1',
    'Task 2',
    'Task 3',
  ];
}
