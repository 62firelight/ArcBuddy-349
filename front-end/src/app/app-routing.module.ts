import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './components/home-page/home-page.component';
import { HomeComponent } from './components/home/home.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { ProfilesComponent } from './components/profiles/profiles.component';
import { SearchComponent } from './components/search/search.component';
import { StatsComponent } from './components/stats/stats.component';

const routes: Routes = [
  // { path: '', redirectTo: '/search', pathMatch: 'full' },
  { path: '', component: LandingPageComponent},
  { path: 'search', component: SearchComponent },
  { path: 'profiles', component: ProfilesComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
