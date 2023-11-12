import {Directive, ViewContainerRef} from '@angular/core';

@Directive({
  selector: '[appDynamicDirective]',
  standalone: true
})
export class DynamicDirective {

  constructor(public viewContainerRef: ViewContainerRef) {}

}
