import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-recommendation-page',
  templateUrl: './recommendation-page.component.html',
  styleUrls: ['./recommendation-page.component.css']
})
export class RecommendationPageComponent implements OnInit {
  customerName: string = ''; // Menyimpan nama pengguna
  historicalActivities: any[] = []; // Menyimpan data aktivitas historis
  recommendations: any[] = []; // Menyimpan data rekomendasi personal

  insights = [
    { text: 'Private vehicle usage: 60% of total emissions' },
    { text: 'Electricity usage: 30% of total emissions' }
  ];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadCustomerName();
    this.loadHistoricalActivities();
  }

  // Fungsi untuk memuat nama pengguna
  loadCustomerName(): void {
    this.customerName = sessionStorage.getItem('name') ?? '';
  }

  // Fungsi untuk memuat aktivitas historis
  loadHistoricalActivities(): void {
    this.http.get<any>('http://localhost:5000/api/daily-activity', {
      headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
    }).subscribe(
      (response) => {
        
        this.historicalActivities = response.historicalActivities; // Simpan aktivitas historis
        if (this.historicalActivities.length > 0) {
  
          this.generateRecommendations(this.historicalActivities[0]); // Kirim aktivitas terbaru untuk rekomendasi
        }
      },
      (error) => {
        console.error('Error fetching historical activities:', error);
      }
    );
  }

  // Fungsi untuk menghasilkan rekomendasi personal
  generateRecommendations(latestActivity: any): void {

    const parseDescription = (description: string): Record<string, string> => {
      return description
        .trim()
        .split(",")
        .reduce<Record<string, string>>((acc, pair) => {
          const [key, value] = pair
            .split(":")
            .map((item) => item.trim().replace(".", ""));
          if (key && value) {
            const formattedKey = key.replace(/\s+/g, ""); 
            acc[formattedKey] = value;
          }
          return acc;
        }, {});
    };
  
  
    const parsedDescription = parseDescription(latestActivity.description);
    const requestBody = {
      transportationModels: parsedDescription['Transportation'],
      energyUsage: parsedDescription['EnergyUsage'],
      meals: parsedDescription['Meals'],
    };
    
    this.http.get<any>('http://localhost:5000/api/recommendations', {
      headers: { Authorization: `Bearer ${sessionStorage.getItem('token')}` },
      params: requestBody, // Mengirim data sebagai query parameter
    }).subscribe(
      (response) => {
        console.log(response);
        this.recommendations = response.recommendations;
      },
      (error) => {
        console.error('Error generating recommendations:', error);
      }
    );
    
  }

  onLearnMore(recommendationTitle: string): void {
    alert(`You selected: ${recommendationTitle}. Check details above for more information.`);
  }
}
