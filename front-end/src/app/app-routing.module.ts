import { NgModule } from '@angular/core';
import { RouterModule, Routes, TitleStrategy } from '@angular/router';
import { ArcBuddyTitleStrategy } from './ArcBuddyTitleStrategy';
import { HomePageComponent } from './components/home-page/home-page.component';
import { HomeComponent } from './components/home/home.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { ProfilesComponent } from './components/profiles/profiles.component';
import { SearchPageComponent } from './components/search-page/search-page.component';
import { SearchComponent } from './components/search/search.component';
import { StatsComponent } from './components/stats/stats.component';
import { VendorsPageComponent } from './components/vendors-page/vendors-page.component';
import { StatsResolver } from './StatsResolver';

const routes: Routes = [
  // { path: '', redirectTo: '/search', pathMatch: 'full' },
  { path: '', component: LandingPageComponent, title: 'Home'},
  { path: 'search', component: SearchPageComponent, title: 'Search'},
  { path: ':membershipType/:membershipId', component: StatsComponent, title: StatsResolver },
  // { path: 'profiles', component: ProfilesComponent, title: 'Saved Profiles | Arc Buddy' },
  { path: 'vendors', component: VendorsPageComponent, title: 'Vendors' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'top'})],
  exports: [RouterModule],
  providers: [
    { provide: TitleStrategy, useClass: ArcBuddyTitleStrategy },
  ]
})
export class AppRoutingModule { }
