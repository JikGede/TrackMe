import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DailyActivityService, DailyActivity } from '../services/daily-activity.service';
import { Router } from '@angular/router';  // Import Router for navigation

@Component({
  selector: 'app-daily-activity',
  templateUrl: './daily-activity.component.html',
  styleUrls: ['./daily-activity.component.css'],
})
export class DailyActivityComponent implements OnInit {
  dailyActivityForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private activityService: DailyActivityService,
    private router: Router  // Inject Router for navigation
  ) {
    this.dailyActivityForm = this.fb.group({
      transportationModels: ['', Validators.required],
      energyUsage: ['', Validators.required],
      meals: ['', Validators.required],
      date: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    const token = sessionStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to access this page.');
      this.router.navigate(['/login']);
    }
  }
  

  onSubmit(): void {
    if (this.dailyActivityForm.valid) {
      const activityData: DailyActivity = this.dailyActivityForm.value;
  
      // Simpan data ke sessionStorage
      sessionStorage.setItem('dailyActivity', JSON.stringify(activityData));
  
      // Kirim data ke server (jika diperlukan untuk menyimpan di database)
      this.activityService.addActivity(activityData).subscribe({
        next: (res) => {
          console.log('Activity saved:', res);
          alert('Activity successfully saved!');
          this.dailyActivityForm.reset();
          this.router.navigate(['/Dashboard']);
        },
        error: (err) => {
          console.error('Error saving activity:', err);
          alert('Failed to save activity.');
        },
      });
    } else {
      alert('Please fill in all fields correctly.');
    }
  }
  
}
