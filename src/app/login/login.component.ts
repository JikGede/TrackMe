import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from '../services/customer.service'; // Import service
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private customerService: CustomerService, // Inject customer service
    private router: Router
  ) {}

  ngOnInit(): void {
    // Initialize login form
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      alert('Please fill in all required fields correctly.');
      console.error('Validation error: Form is invalid.');
      return;
    }
  
    this.loading = true;
  
    this.customerService.login(this.loginForm.value).subscribe({
      next: (response) => {
        this.loading = false;
        const token = response.token;
        if (token) {
          sessionStorage.setItem('token', token);
  
          // Decode token to get customer data
          const decodedToken = this.decodeToken(token);
          console.log('Decoded Token:', decodedToken);
  
          const customerName = decodedToken.customerName || 'Guest';
          const email = decodedToken.email;
          const contactNumber = decodedToken.contactNumber || 'Not available';
  
          sessionStorage.setItem('customerName', customerName);
          sessionStorage.setItem('email', email);
          sessionStorage.setItem('contactNumber', contactNumber);
  
          console.log('Token saved successfully:', token);
          alert(`Login successful! Welcome, ${customerName}`);
          this.router.navigate(['/Profile']);
        } else {
          this.errorMessage = 'Login response is missing a token.';
          console.error(this.errorMessage);
        }
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.error.message || 'Login failed.';
        alert(this.errorMessage);
        console.error('Login error:', error);
      },
    });
  }
  
  

// Decode token function
private decodeToken(token: string): any {
  const payload = token.split('.')[1];
  const decoded = atob(payload);
  return JSON.parse(decoded);
}

}
