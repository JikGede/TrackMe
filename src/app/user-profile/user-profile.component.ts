import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from '../services/customer.service'; // Import service
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  registerForm!: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private customerService: CustomerService, // Inject customer service
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      customerName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]], // Email dengan validasi format
      contactNumber: ['', [Validators.required, Validators.pattern('^[0-9]+$')]], // Nomor telepon hanya angka
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // Handle register submission
  onSubmit(): void {
    if (this.registerForm.invalid) {
      // Cek validasi untuk setiap field
      if (this.registerForm.controls['email'].hasError('email')) {
        console.warn('Invalid email format');
        alert('Email must be a valid format (e.g., example@example.com)');
      }
      if (this.registerForm.controls['contactNumber'].hasError('pattern')) {
        console.warn('Invalid contact number format');
        alert('Contact Number must be numeric');
      }
      if (this.registerForm.controls['contactNumber'].hasError('required')) {
        console.warn('Contact Number is required');
        alert('Please fill in all required fields correctly.');
      }
      return;
    }

    this.loading = true;
    this.customerService.register(this.registerForm.value).subscribe({
      next: (response) => {
        this.loading = false;
        // On success, show a success message in the console
        console.log('Registration successful');
        alert('Registration successful!');

        // Navigate to login page
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.error.message || 'Registration failed';
      }
    });
  }
}
