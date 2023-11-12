import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CpLoaderComponent } from '@shared/cp-libs/cp-loader/cp-loader.component';

@Component({
  selector: 'app-cp-button',
  standalone: true,
  imports: [CommonModule, CpLoaderComponent],
  templateUrl: './cp-button.component.html',
  styleUrls: ['./cp-button.component.scss']
})
export class CpButtonComponent {

  @Input() label: string;
  @Input() type = 'button';
  @Input() class: { [key: string]: boolean };
  @Input() isDisabled = false;
  @Input() tooltip?: string;
  @Input() spin = false;
  @Output() onTap = new EventEmitter<any>();

  click() {
    this.onTap.emit();
  }
}
