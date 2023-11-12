import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { CpEventsService } from '@services/cp-events.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  constructor(
    private cpEventsService: CpEventsService
  ) {}

  openSidebar(): void {
    this.cpEventsService.toggleSidebar.emit(true);
  }
}
