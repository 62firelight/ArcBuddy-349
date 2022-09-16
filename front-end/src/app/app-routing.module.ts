import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './components/home-page/home-page.component';
import { HomeComponent } from './components/home/home.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { ProfilesComponent } from './components/profiles/profiles.component';
import { SearchPageComponent } from './components/search-page/search-page.component';
import { SearchComponent } from './components/search/search.component';
import { StatsComponent } from './components/stats/stats.component';
import { VendorsPageComponent } from './components/vendors-page/vendors-page.component';

const routes: Routes = [
  // { path: '', redirectTo: '/search', pathMatch: 'full' },
  { path: '', component: LandingPageComponent},
  { path: 'search', component: SearchPageComponent },
  { path: 'profiles', component: ProfilesComponent },
  { path: 'vendors', component: VendorsPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'top'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
