import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { DailyActivityComponent } from './daily-activity/daily-activity.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { RecommendationPageComponent } from './recommendation-page/recommendation-page.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  {path: "UserProfile", component:UserProfileComponent},
  {path: "DailyActivity", component:DailyActivityComponent},
  {path: "Dashboard", component:DashboardComponent},
  {path: "login", component:LoginComponent},
  {path: "RecommendationPage", component:RecommendationPageComponent},
  {path: "Profile", component:ProfileComponent}  
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
