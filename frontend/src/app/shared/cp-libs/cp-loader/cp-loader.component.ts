import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cp-loader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cp-loader.component.html',
  styleUrls: ['./cp-loader.component.scss']
})
export class CpLoaderComponent {

  @Input() class: { [key: string]: boolean };
}
