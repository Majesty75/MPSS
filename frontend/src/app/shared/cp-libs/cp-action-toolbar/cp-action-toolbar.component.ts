import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { ActionToolbar } from '@models/common.model';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-cp-action-toolbar',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatMenuModule, TranslateModule],
  templateUrl: './cp-action-toolbar.component.html',
  styleUrls: ['./cp-action-toolbar.component.scss']
})
export class CpActionToolbarComponent {

  @Input() actionData: ActionToolbar[];
  @Input() rowReference: any;
}
