import { EventEmitter, Injectable } from '@angular/core';
import { BreadcrumbEventModel } from '@models/breadcrumb.model';

@Injectable({
  providedIn: 'root'
})
export class CpEventsService {

  constructor() { }

  public cpHeaderDataChanged = new EventEmitter<BreadcrumbEventModel>();
  public toggleSidebar = new EventEmitter<boolean>();
}
