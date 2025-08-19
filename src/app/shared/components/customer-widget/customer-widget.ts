import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

export interface Customer {
  title: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: number;
  customerType: string;
  id: number;
}

@Component({
  selector: 'app-customer-widget',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './customer-widget.html',
  styleUrl: './customer-widget.scss'
})
export class CustomerWidget {

  @Input() customers: any;
  customerFrom: FormGroup;
  selectedCustomer: any;
  isView = false;

  constructor() {
    this.customerFrom = new FormGroup({
      title: new FormControl('mr', [Validators.required]),
      firstName: new FormControl(null, [Validators.required]),
      lastName: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      phone: new FormControl(null, [Validators.required, Validators.pattern(/^\d{10}$/)]),
      customerType: new FormControl('premium')
    });

  }

  onSelect(customer: any, isView: any) {
    if (isView) {
      this.isView = true;
      this.customerFrom.disable();
    } else {
      this.isView = false;
      this.customerFrom.enable()
    }
    this.selectedCustomer = customer;
    this.customerFrom.setValue({
      title: customer.title,
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email,
      phone: customer.phone,
      customerType: customer.customerType
    })
  }

  onEdit() {
    console.log(this.customerFrom.value);
    this.customers?.forEach((c: any) => {
      if (c.id === this.selectedCustomer.id) {
        c.title = this.customerFrom.value.title;
        c.firstName = this.customerFrom.value.firstName ?? '';
        c.lastName = this.customerFrom.value.lastName ?? '';
        c.email = this.customerFrom.value.email ?? '';
        c.phone = this.customerFrom.value.phone ?? 0;
        c.customerType = this.customerFrom.value.customerType
      }
    })
    const allCustomers: any = localStorage.getItem('customers');
    if (allCustomers) {
      const customers = JSON.parse(allCustomers)
      console.log('all', customers)
      customers?.forEach((c: any) => {
        if (c.id === this.selectedCustomer.id) {
          c.title = this.customerFrom.value.title;
          c.firstName = this.customerFrom.value.firstName ?? '';
          c.lastName = this.customerFrom.value.lastName ?? '';
          c.email = this.customerFrom.value.email ?? '';
          c.phone = this.customerFrom.value.phone ?? 0;
          c.customerType = this.customerFrom.value.customerType
        }
      })
      localStorage.setItem('customers', JSON.stringify(customers))
    }
    this.customerFrom.reset();
    this.customerFrom.patchValue({
      title: new FormControl('mr', [Validators.required]),
      customerType: new FormControl('premium')
    })
  }

  onDelete(customer: any) {
    console.log('cus', customer);
    const allCustomers: any = localStorage.getItem('customers');
    if (allCustomers) {
      const customers = JSON.parse(allCustomers)
      this.customers = customers.filter((c: any) => c.id != customer.id);
      console.log('all', customers)
      const totalCustomers = customers.filter((c: any) => c.id != customer.id);
      console.log('to', totalCustomers);
      localStorage.setItem('customers', JSON.stringify(totalCustomers));
    }
  }

}


