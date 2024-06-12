import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContactService } from '../shared/services/contact.service';
import { Contact } from '../shared/models/contact.model';

@Component({
  selector: 'app-contact-detail', 
  templateUrl: './contact-detail.component.html',
  styleUrl: './contact-detail.component.css'
})
export class ContactDetailComponent implements OnInit {
  contact: Contact | null = null;

  constructor(
    private route: ActivatedRoute,
    private contactService: ContactService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.contactService.getContact(+id!).subscribe(data => {
      this.contact = data;
    });
  }
}
