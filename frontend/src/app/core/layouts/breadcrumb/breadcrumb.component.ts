import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadCrumb } from '@models/breadcrumb.model';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule],
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent {

  @Input() breadcrumbs: BreadCrumb[];
  @Input() showLastItemCustomLabel = false;
  @Input() lastItemCustomLabel?: string;
}
