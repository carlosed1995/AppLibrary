import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactListComponent } from './contact-list/contact-list.component';
import { ContactDetailComponent } from './contact-detail/contact-detail.component';
import { ContactFormComponent } from './contact-form/contact-form.component';

const routes: Routes = [
  { path: '', component: ContactListComponent },
  { path: 'contact/:id', component: ContactDetailComponent },
  { path: 'add', component: ContactFormComponent },
  { path: 'edit/:id', component: ContactFormComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
