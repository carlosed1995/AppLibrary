import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../enviroments/environment';
import { Contact } from '../models/contact.model';
import { Response } from '../models/response.model';
import { MatSnackBar } from '@angular/material/snack-bar';


@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private snackBar: MatSnackBar,) {}

  // Fetches a list of contacts. You can provide a search string and a page number for pagination. 
getContacts(search: string = '', page: number = 1): Observable<Response<Contact>> {
  return this.http.get<Response<Contact>>(`${this.apiUrl}?search=${search}&page=${page}`)
    .pipe(catchError(this.handleError));
}
  // Fetches a single contact by its ID.
  getContact(id: number): Observable<Contact> {
    return this.http.get<Contact>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  // Creates a new contact. The contact data should be provided in the 'contact' parameter.
  createContact(contact: Contact): Observable<Contact> {
    return this.http.post<Contact>(this.apiUrl, contact)
      .pipe(catchError(this.handleError));
  }

  // Updates an existing contact. The ID of the contact and the new data should be provided.
  updateContact(id: number, contact: Contact): Observable<Contact> {
    return this.http.put<Contact>(`${this.apiUrl}/${id}`, contact)
      .pipe(catchError(this.handleError));
  }

  // Deletes a contact by its ID.
  deleteContact(id: number): Observable<{}> {
    return this.http.delete(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  // Error handling method
  private handleError = (error: HttpErrorResponse) => {
    let errorMessage = 'Something bad happened; please try again later.';
    if (error.error instanceof ErrorEvent) { 
      console.error('An error occurred:', error.error.message);
      errorMessage = error.error.message;
    } else { 
      console.error(`Backend returned code ${error.status}, ` + `body was: ${error.error.message}`);
      errorMessage = ` ${error.error.message}`;
    }
    // Use the MatSnackBar to show the error message.
    this.snackBar.open(errorMessage, 'Close', {
      duration: 5000,
    });
    // Return an observable with a user-facing error message.
    return throwError(errorMessage);
  }
}