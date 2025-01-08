import { Component, OnInit } from '@angular/core';
import { Chart, LinearScale, CategoryScale, BarElement, Title, Tooltip, Legend, BarController } from 'chart.js';
import { FormGroup } from '@angular/forms';

Chart.register(
  LinearScale,
  CategoryScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  BarController
);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  dailyActivityForm!: FormGroup;  // Reactive form for daily activity
  dailyActivityData: any;  // To hold the data from sessionStorage
  totalCarbonFootprint: number = 0;  // Store total carbon footprint
  transportationCarbon: number = 0;
  energyUsageCarbon: number = 0;
  dietaryPreferenceCarbon: number = 0;
  dailyActivityDate: string = '';  // Properti untuk menyimpan tanggal aktivitas
  chart: any;  // Reference to the chart instance

  ngOnInit(): void {
    this.loadDailyActivityData();  // Load data from sessionStorage when the component is initialized
  }

  // Load data from sessionStorage
  loadDailyActivityData(): void {
    const storedData = sessionStorage.getItem('dailyActivity');
    if (storedData) {
      this.dailyActivityData = JSON.parse(storedData);  
      this.dailyActivityDate = this.dailyActivityData.date;  
      console.log('Loaded daily activity from sessionStorage:', this.dailyActivityData);
      this.calculateCarbonFootprint();  
      this.loadChart();  
    }
  }

  // Calculate the carbon footprint based on the form data
  calculateCarbonFootprint(): void {
    if (this.dailyActivityData) {
      // Get carbon values for each category
      this.transportationCarbon = this.getCarbonValue(this.dailyActivityData.transportationModels);
      this.energyUsageCarbon = this.getCarbonValue(this.dailyActivityData.energyUsage);
      this.dietaryPreferenceCarbon = this.getCarbonValue(this.dailyActivityData.meals);

      // Calculate the total carbon footprint
      this.totalCarbonFootprint = this.transportationCarbon + this.energyUsageCarbon + this.dietaryPreferenceCarbon;
    }
  }

  // Determine the carbon value based on the selected activity
  getCarbonValue(activity: string): number {
    switch (activity) {
      // Transportation options
      case 'motorcycle': return 50;  // Motorcycle
      case 'car': return 100;  // Car
      case 'bike': return 10;  // Bike
      case 'walk': return 0;   // Walking (no carbon)
      case 'public': return 20; // Public transportation
      
      // Energy sources
      case 'electricity': return 100;  // Electricity
      case 'solar': return 5;   // Solar
      case 'wind': return 10;  // Wind
      case 'hydropower': return 15;  // Hydropower
      
      // Dietary preferences
      case 'vegetarian': return 10;  // Vegetarian
      case 'vegan': return 5;   // Vegan
      case 'gluten_free': return 20;  // Gluten-Free
      case 'high_calorie': return 30;  // High-Calorie Diet

      // Default case for unrecognized activity
      default: return 0; 
    }
  }

  // Load chart with updated data
  loadChart(): void {
    if (this.chart) {
      this.chart.destroy(); // Destroy the previous chart instance to avoid memory leak
    }

    const xValues = ["Transportation", "Energy Usage", "Dietary Preference"];
    const yValues = [
      this.transportationCarbon,
      this.energyUsageCarbon,
      this.dietaryPreferenceCarbon,
     
    ];
    const barColors = ["red", "green", "blue"];

    this.chart = new Chart("myChart", {
      type: "bar",
      data: {
        labels: xValues,
        datasets: [{
          backgroundColor: barColors,
          data: yValues
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          title: { display: true, text: "Breakdown of Emissions and Total Footprint" }
        },
        scales: { y: { beginAtZero: true } }
      }
    });
  }
}
