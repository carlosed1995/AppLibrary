import { Component, OnInit } from '@angular/core';
import { ContactService } from '../shared/services/contact.service';
import { HostListener } from '@angular/core';
import { Contact } from '../shared/models/contact.model';
@Component({
  selector: 'app-contact-list', 
  templateUrl: './contact-list.component.html',
  styleUrl: './contact-list.component.css'
})
export class ContactListComponent implements OnInit {
  contacts: Contact[] = [];
  search: string = '';
  currentPage = 1;
  totalPages: number = 1;
  isLoading = false;
  isBottom = false;
  previousSearch: string = '';
  constructor(private contactService: ContactService) {}

ngOnInit() {
  this.loadContacts();  
}

  // This function triggers on window scroll. 
  //It checks if the user has scrolled to the bottom of the page and loads more contacts if needed.
@HostListener('window:scroll', ['$event'])
onWindowScroll() { 
      const scrollTop = (document.documentElement || document.body.parentNode || document.body).scrollTop;
      const offsetHeight = document.documentElement.offsetHeight;
      const scrollHeight = document.documentElement.scrollHeight;
      const bottom = scrollHeight - offsetHeight;

      if (scrollTop > bottom - 200) { 
        this.isBottom = true;
      } else {
        this.isBottom = false;
      }

      if (this.isBottom && this.currentPage < this.totalPages && !this.isLoading) {
        this.currentPage++;
        this.loadContacts();
      }
}

 
loadContacts() {
      // Reset pagination if the search term has changed
      if (this.search !== this.previousSearch) {
        this.currentPage = 1;
        this.contacts = [];
        this.previousSearch = this.search;
      }

      if (this.currentPage <= this.totalPages || !this.totalPages) {
        this.isLoading = true;
        this.contactService.getContacts(this.search, this.currentPage).subscribe(data => {
          // Filter out any contacts that are already in the list
          const newContacts = data.data.filter((newContact: { id: number }) => !this.contacts.some(contact => contact.id === newContact.id));
          // Add new contacts to the existing list
          this.contacts = [...this.contacts, ...newContacts];  
          this.totalPages = data.last_page; 
          // Increase the current page for the next load
          this.currentPage++;  
        }, () => {}, () => {
          this.isLoading = false;
        });
      }
}

deleteContact(id: number) {
    this.contacts = [];   
    this.contactService.deleteContact(id).subscribe({
      next: () => {
        this.loadContacts();
      } 
    });
  }
}


