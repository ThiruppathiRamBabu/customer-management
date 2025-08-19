import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerWidget } from './components/customer-widget/customer-widget';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CustomerWidget
  ],
  exports: [
    CustomerWidget
  ]
})
export class SharedModule { }
