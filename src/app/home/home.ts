import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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
  selector: 'app-home',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {

  customers: Customer[] = [];
  customerFrom: FormGroup;
  selectedCustomerType = 'all';
  filteredCustomers: Customer[] = [];
  searchQuery = new FormControl('');
  isEdit = false;
  selectedUserId: any;

  constructor() {
    this.customerFrom = new FormGroup({
      title: new FormControl('mr', [Validators.required]),
      firstName: new FormControl(null, [Validators.required]),
      lastName: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      phone: new FormControl(null, [Validators.required, Validators.pattern(/^\d{10}$/)]),
      customerType: new FormControl('all')
    });

    const users = localStorage.getItem('customers');
    if (users) {
      this.customers = JSON.parse(users);
      this.filteredCustomers = this.customers;
    }
    console.log('//', this.customers, this.filteredCustomers);
  }

    onSubmit() {
    if (this.isEdit) {
      this.customers.forEach((u: any) => {
        if (u.id === this.selectedUserId) {
          u.name = this.customerFrom.value.name ?? '';
          u.email = this.customerFrom.value.email ?? '';
          u.mobile = this.customerFrom.value.mobile ?? 0;
        }
      })
      localStorage.setItem('customers', JSON.stringify(this.customers));
      this.isEdit = false;
    } else {
      console.log(this.customerFrom.value);
      const customer: Customer = {
        title: this.customerFrom.value.title,
        firstName: this.customerFrom.value.firstName ?? '',
        lastName: this.customerFrom.value.lastName ?? '',
        email: this.customerFrom.value.email ?? '',
        phone: this.customerFrom.value.mobile ?? 0,
        customerType: this.customerFrom.value.customerType,
        id: this.customers.length ? Math.max(0, ...this.customers.map((u: any) => u.id)) + 1 : 0
      };
      this.customers.push(customer)
      console.log('customers', this.customers);
      localStorage.setItem('customers', JSON.stringify(this.customers));
    }
    this.filteredCustomers = this.customers;
    this.customerFrom.reset();
  }

  onEdit(user: any) {
    this.isEdit = true;
    this.selectedUserId = user.id;
    if (user) {
      this.customerFrom.patchValue({
        name: user.name,
        email: user.email,
        mobile: user.mobile
      })
    }
  }

  onDelete(user: any) {
    this.customers = this.customers.filter((u: any) => u.id != user.id);
    this.filteredCustomers = this.customers;
    localStorage.setItem('customers', JSON.stringify(this.customers));
  }

}
