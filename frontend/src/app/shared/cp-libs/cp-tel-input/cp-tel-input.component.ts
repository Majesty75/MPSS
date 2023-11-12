import { Component, ElementRef, EventEmitter, forwardRef, Input, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS, FormControl, AbstractControl, ValidationErrors, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { environment } from '@environment/environment';

declare var intlTelInput: any;

@Component({
  selector: 'app-cp-tel-input',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './cp-tel-input.component.html',
  styleUrls: ['./cp-tel-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CpTelInputComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => CpTelInputComponent),
      multi: true
    }
  ]
})
export class CpTelInputComponent {

  @Input() defaultCountry: string;
  @Input() public cssClass: {};
  @Input() public E164PhoneNumber: string;
  @Input() public label: string;
  @Input() public labelCssClass: string;
  @Input() public name = 'intl-tel-input-name';
  @Input() public onlyLocalized = true;
  @Input() public options: any = {};
  @Input() public required = false;
  @Input() public isDisabled = false;

  @Output() public blurEvent: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('intlTelInput') private _inputElement: ElementRef;

  private _intlTelInput: any;
  private onTouch: Function;
  private onModelChange: Function;
  private onValidatorChange: Function;
  public preferredCountries: string[] = environment.preferredCountries;

  telInputControl: FormControl = new FormControl();

  private static modifyCountryData(): void {
    (window as any).intlTelInputGlobals?.getCountryData().forEach((country: any) =>
      country.name = country.name.replace(/.+\((.+)\)/, '$1'));
  }

  ngOnInit(): void {
    this.telInputControl.valueChanges
      .subscribe(
        (result: any) => {
          if (!result) {
            if (this.onModelChange) {
              this.onModelChange(result);
            }
          }
          if (result && this.onModelChange) {
            this.setPhoneNumber(result);
            if (this.onTouch && !this.telInputControl.touched) {
              this.onTouch();
            }
            if (this.onValidatorChange) {
              this.onValidatorChange();
            }
          }
        }
      );

    if (this.isDisabled) {
      this.telInputControl.disable();
    }
  }

  onClick(): void {
    if (this.onTouch) {
      this.onTouch();
    }
  }

  onBlur(): void {
    if (this.onTouch) {
      this.onTouch();
    }
    this.blurEvent.emit();
  }

  public ngAfterViewInit(): void {
    if (this.onlyLocalized) {
      CpTelInputComponent.modifyCountryData();
    }

    this.options = {
      initialCountry: this.defaultCountry,
      separateDialCode: true,
      preferredCountries: this.preferredCountries,
      formatOnDisplay: true,
      autoHideDialCode: true,
      phoneValidation: true,
      utilsScript: 'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.15/js/utils.js'
    };

    const intlTelInputInstance = intlTelInput;
    this._intlTelInput = intlTelInputInstance(this._inputElement.nativeElement, this.options);
  }

  setPhoneNumber(value: string): void {
    if (this._intlTelInput) {
      if (!!value) {
        this._intlTelInput.setNumber(value);
      }
      this.i18nPhoneNumber();
    } else {
    }
  }

  public i18nPhoneNumber(): void {
    if (Number(this._intlTelInput.telInput.style.paddingLeft.replace('px', '')) > 100) {
      const widthOfCountryDialCode = this._intlTelInput.selectedDialCode.parentElement.clientWidth;
      this._intlTelInput.telInput.style.paddingLeft = `${(widthOfCountryDialCode + 3.97)}px`;
    }
    this.E164PhoneNumber = this._intlTelInput.getNumber();
    if (this.E164PhoneNumber) {
      this.onModelChange(this.E164PhoneNumber);
    } else {
      if (this._intlTelInput.selectedDialCode && this._intlTelInput.selectedDialCode.innerText) {
        if (this.telInputControl.value && this.telInputControl.value[0] === '+') {
          this.E164PhoneNumber = this._intlTelInput.selectedDialCode.innerText + this._intlTelInput.telInput.value;
        } else {
          this.E164PhoneNumber = this._intlTelInput.selectedDialCode.innerText + (this.telInputControl.value ? this.telInputControl.value : '');
        }
        this.onModelChange(this.E164PhoneNumber);
      }
    }
  }

  registerOnChange(fn: any): void {
    this.onModelChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  writeValue(obj: any): void {
    this.telInputControl.setValue(obj);
  }

  validate(control: AbstractControl): ValidationErrors {
    if (control.value && this._intlTelInput) {
      const selectedCountryCode = this._intlTelInput.getSelectedCountryData();
      if (control.value === `+${selectedCountryCode.dialCode}`) {
        if (this.required) {
          control.setErrors({
            required: true
          });
          return control.errors;
        }
      } else if (!this._intlTelInput.isValidNumber() && this._intlTelInput.isValidNumber() !== null) {
        control.setErrors({
          invalidNumber: true
        });
        return control.errors;
      }
    }
    return null;
  }

  registerOnValidatorChange?(fn: any): void {
    this.onValidatorChange = fn;
  }
}
