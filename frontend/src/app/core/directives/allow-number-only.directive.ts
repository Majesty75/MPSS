import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { RegexType, REGEX_CONSTANTS } from '@constants/app.constants';

@Directive({
  selector: '[appAllowNumberOnly]',
  standalone: true
})
export class AllowNumberOnlyDirective {

  regex: RegExp;
  @Input() set regexType(type: string) {
    switch(type) {
      case RegexType.decimal:
        this.regex = REGEX_CONSTANTS.DECIMAL_REGEX;
        break;
      case RegexType.integer:
        this.regex = REGEX_CONSTANTS.INTEGER_REGEX;
        break;
      default: 
        this.regex = REGEX_CONSTANTS.DECIMAL_REGEX;
        break;
    }
  };
  constructor(
    private el: ElementRef
  ) { }

  @HostListener('keypress', ['$event']) keyPress(event: KeyboardEvent): void {
    const val = this.el.nativeElement.value + event.key;
    if(!this.regex.test(val)) {
      event.preventDefault();
      event.stopPropagation();
    }
  }

}
