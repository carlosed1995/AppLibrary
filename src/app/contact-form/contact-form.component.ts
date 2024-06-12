import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ContactService } from '../shared/services/contact.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError } from 'rxjs/operators';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { of } from 'rxjs';
import { Address, Contact, Email, Phone } from '../shared/models/contact.model';

@Component({
  selector: 'app-contact-form', 
  templateUrl: './contact-form.component.html',
  styleUrl: './contact-form.component.css'
})
export class ContactFormComponent implements OnInit {
  contact: Contact | null = null;
  contactForm: FormGroup;
  contactId: number | null = null;
  isEditing: boolean = false;
  private unsubscribe$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private contactService: ContactService,
    private snackBar: MatSnackBar,
  ) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50), Validators.pattern('^[a-zA-Z ]*$')]],
      phones: this.fb.array([]),
      emails: this.fb.array([]),
      addresses: this.fb.array([])
    });
  }

  ngOnInit() {
    this.contactId = +this.route.snapshot.paramMap.get('id')!;
    if (this.contactId) {
      this.isEditing = true;
      this.contactService.getContact(this.contactId).subscribe(data => {
        this.contact = data;
        this.contactForm.patchValue(data);
        this.setPhones(data.phones);
        this.setEmails(data.emails);
        this.setAddresses(data.addresses);
      });
    } else {
      this.isEditing = false;
      this.addPhone();
      this.addEmail();
      this.addAddress();
    }
  }

  get phones(): FormArray {
    return this.contactForm.get('phones') as FormArray;
  }

  get emails(): FormArray {
    return this.contactForm.get('emails') as FormArray;
  }

  get addresses(): FormArray {
    return this.contactForm.get('addresses') as FormArray;
  }

  addPhone() {
    this.phones.push(this.fb.control('', Validators.required));
  }

  addEmail() {
    this.emails.push(this.fb.control('', Validators.required));
  }

  ngOnDestroy() {
      this.unsubscribe$.next();
      this.unsubscribe$.complete();
  }

  //all required fields are marked as required
  addAddress() {
      this.addresses.push(
        this.fb.group({
        address: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
        city: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50), Validators.pattern('^[a-zA-Z ]*$')]],
        state: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50), Validators.pattern('^[a-zA-Z ]*$')]],
        postal_code: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(10)]]
        })
      );
  }

  setPhones(phones: Phone[]) {
      phones.forEach(phone => {
        this.phones.push(this.fb.control(phone.phone_number));
      });
  }

  setEmails(emails: Email[]) {
      emails.forEach(email => {
        this.emails.push(this.fb.control(email.email));
      });
  }

  setAddresses(addresses: Address[]) {
      addresses.forEach(address => {
        this.addresses.push(
          this.fb.group({
            address: [address.address, [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
            city: [address.city, [Validators.required, Validators.minLength(2), Validators.maxLength(50), Validators.pattern('^[a-zA-Z ]*$')]],
            state: [address.state, [Validators.required, Validators.minLength(2), Validators.maxLength(50), Validators.pattern('^[a-zA-Z ]*$')]],
            postal_code: [address.postal_code, [Validators.required, Validators.minLength(4), Validators.maxLength(10)]]
            })
        );
      });
  }

  // This function is called when the form is submitted
  onSubmit() {
    if (this.contactForm.valid) {
      const contact = this.contactForm.value;
      if (this.contactId) {
        this.updateContact(this.contactId, contact);
      } else {
        this.createContact(contact);
      }
    } else {
      for (let controlName in this.contactForm.controls) {
        const control = this.contactForm.get(controlName);
        if (controlName === 'addresses') {
          const addressControls = (control as FormArray).controls;
          for (let i = 0; i < addressControls.length; i++) {
            if (this.handleAddressErrors(addressControls[i] as FormGroup, i)) {
              return;
            }
          }
        } else if (control && this.handleControlErrors(control, controlName)) {
          return;
        }
      }
    }
  } 

private handleControlErrors(control: AbstractControl, controlName: string) {
  if (control.invalid) {
    const errors = control.errors;
    if (errors) {
      for (let errorName in errors) {
        if (errors[errorName]) {
          const errorMessage = this.getErrorMessage(controlName, errorName);
          this.snackBar.open(errorMessage, 'Close', {
            duration: 3000,
          });
          return true;
        }
      }
    }
  }
  return false;
}

 private handleAddressErrors(addressControl: FormGroup, index: number) {
      for (let controlName in addressControl.controls) {
        const control = addressControl.get(controlName);
        if (control && this.handleControlErrors(control, controlName)) {
          const errorMessage = this.snackBar._openedSnackBarRef?.containerInstance.snackBarConfig.data;
          
          this.snackBar.open(` ${errorMessage.message}`, 'Close', {
            duration: 3000,
          });
          return true;
        }
      }
      return false;
  }

  private getErrorMessage(controlName: string, errorName: string): string {
      const fieldName = this.getFieldName(controlName);
      switch (errorName) {
        case 'required':
          return `${fieldName} is required.`;
        case 'minlength':
          return `${fieldName} should be at least ${this.getMinLength(controlName)} characters long.`;
        case 'maxlength':
          return `${fieldName} should not exceed ${this.getMaxLength(controlName)} characters.`;
        case 'pattern':
          return this.getPatternMessage(controlName);
        default:
          return `Field ${controlName} has error: ${errorName}`;
      }
    }

    private getFieldName(controlName: string): string {
      switch (controlName) {
        case 'phones':
          return 'Phone number';
        case 'addresses':
          return 'Address';
        default:
          return controlName.charAt(0).toUpperCase() + controlName.slice(1);
      }
    }

    private getMinLength(controlName: string): number {
      switch (controlName) {
        case 'address':
        case 'addresses':
          return 5;
        case 'city':
        case 'state':
          return 2;
        case 'postal_code':
          return 4;
        default:
          return 0;
      }
    }

    private getMaxLength(controlName: string): number {
      switch (controlName) {
        case 'address':
        case 'addresses':
          return 100;
        case 'city':
        case 'state':
          return 50;
        case 'postal_code':
          return 10;
        default:
          return Infinity;
      }
    }

    private getPatternMessage(controlName: string): string {
      if (controlName === 'city' || controlName === 'state') {
        return `${this.getFieldName(controlName)} should only contain letters and spaces.`;
      } else if (controlName === 'phones') {
        return 'Phone number is invalid. It should only contain numbers and may start with an optional international code (+xx).';
      }
      return '';
    }

    updateContact(contactId: number, contact: Contact) {
      this.contactService.updateContact(contactId, contact).pipe(
        takeUntil(this.unsubscribe$)
      ).subscribe(() => {
        this.router.navigate(['/']);
        this.snackBar.open('Contact updated successfully', 'Close', { duration: 3000 });
      });
    }
    
   createContact(contact: Contact) {
      this.contactService.createContact(contact).pipe(
        takeUntil(this.unsubscribe$)
      ).subscribe(() => {
        this.router.navigate(['/']);
        this.snackBar.open('Contact added successfully', 'Close', { duration: 3000 });
      });
    }

  removeEmail(index: number) {
    (this.contactForm.get('emails') as FormArray).removeAt(index);
  }

  removePhone(index: number) {
    (this.contactForm.get('phones') as FormArray).removeAt(index);
  }

  removeAddress(index: number) {
    this.addresses.removeAt(index);
  }

}
