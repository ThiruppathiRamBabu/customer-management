import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomerWidget } from '../shared/components/customer-widget/customer-widget';


declare var bootstrap: any;

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
  imports: [CommonModule, FormsModule, ReactiveFormsModule, CustomerWidget],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {

  customers: Customer[] = [];
  customerFrom: FormGroup;
  selectedCustomerType = 'all';
  filteredCustomers: Customer[] = [];
  searchQuery = new FormControl('');
  searchText: string = '';
  sortOrder: string = 'asc';

  constructor() {
    this.customerFrom = new FormGroup({
      title: new FormControl('mr', [Validators.required]),
      firstName: new FormControl(null, [Validators.required]),
      lastName: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      phone: new FormControl(null, [Validators.required, Validators.pattern(/^\d{10}$/)]),
      customerType: new FormControl('premium')
    });

    const customer = localStorage.getItem('customers');
    if (customer) {
      this.customers = JSON.parse(customer);
      this.customers.sort((a: any, b: any) => {
        return a.firstName.toLowerCase().localeCompare(b.firstName.toLowerCase())
      });
      this.filteredCustomers = this.customers;
    }
    console.log('//', this.customers, this.filteredCustomers);
  }

  onSubmit() {
    console.log(this.customerFrom.value);
    const customer: Customer = {
      title: this.customerFrom.value.title,
      firstName: this.customerFrom.value.firstName ?? '',
      lastName: this.customerFrom.value.lastName ?? '',
      email: this.customerFrom.value.email ?? '',
      phone: this.customerFrom.value.phone,
      customerType: this.customerFrom.value.customerType,
      id: this.customers.length ? Math.max(0, ...this.customers.map((u: any) => u.id)) + 1 : 0
    };
    console.log('customers', this.customers);
    const allCustomers: any = localStorage.getItem('customers');
    const customers = allCustomers ? JSON.parse(allCustomers) : []
    customers.push(customer);
    localStorage.setItem('customers', JSON.stringify(customers));
    this.customers = customers;
    this.filteredCustomers = this.customers;
    this.customerFrom.reset();
    const toastEl = document.getElementById('successToast');
    if (toastEl) {
      const toast = new bootstrap.Toast(toastEl, { delay: 2000 });
      toast.show();
    }
    this.customerFrom.patchValue({
      title: new FormControl('mr', [Validators.required]),
      customerType: new FormControl('premium')
    })
  }

  applyFilters() {
    const customer = localStorage.getItem('customers');
    if (customer) {
      let data = JSON.parse(customer);

      if (this.selectedCustomerType !== 'all') {
        data = data.filter((c: any) => c.customerType === this.selectedCustomerType);
      }

      if (this.searchText.trim()) {
        const searchLower = this.searchText.toLowerCase();
        data = data.filter((c: any) =>
          c.firstName.toLowerCase().includes(searchLower) ||
          c.lastName.toLowerCase().includes(searchLower) ||
          c.email.toLowerCase().includes(searchLower)
        );
      }

      data.sort((a: any, b: any) => {
        const nameA = a.firstName.toLowerCase();
        const nameB = b.firstName.toLowerCase();
        return this.sortOrder === 'asc'
          ? nameA.localeCompare(nameB)
          : nameB.localeCompare(nameA);
      });

      this.filteredCustomers = data;
    }
  }

}
