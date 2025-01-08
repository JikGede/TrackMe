import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DailyActivityService, DailyActivity } from '../services/daily-activity.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  customerName: string | null = '';
  email: string | null = '';
  contactNumber: string | null = '';
  
  dailyActivityForm: FormGroup;  // Inisialisasi form tanpa tanda non-null assertion

  constructor(
    private fb: FormBuilder,
    private activityService: DailyActivityService,
    private router: Router
  ) {
    // Inisialisasi form di dalam constructor
    this.dailyActivityForm = this.fb.group({
      transportationModels: ['', Validators.required],
      energyUsage: ['', Validators.required],
      meals: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    // Ambil data dari sessionStorage
    this.customerName = sessionStorage.getItem('customerName') || 'Guest';
    this.email = sessionStorage.getItem('email') || 'Not available';
    this.contactNumber = sessionStorage.getItem('contactNumber') || 'Not available';
  }

  onSubmit(): void {
    if (this.dailyActivityForm.valid) {
      const activityData: DailyActivity = this.dailyActivityForm.value;

      this.activityService.addActivity(activityData).subscribe({
        next: (res) => {
          console.log('Activity saved:', res);
          alert('Activity successfully saved!');
          this.dailyActivityForm.reset();
          this.router.navigate(['/Dashboard']);
        },
        error: (err) => {
          console.error('Error saving activity:', err);
          alert('Activity saved');
        },
      });
    } else {
      alert('Please fill in all fields correctly.');
    }
  }
}
