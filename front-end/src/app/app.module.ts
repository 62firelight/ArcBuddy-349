import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { ClipboardModule } from '@angular/cdk/clipboard';

import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCommonModule, MatRipple } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { SearchComponent } from './components/search/search.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatRippleModule } from '@angular/material/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';
import { MatMenuModule } from '@angular/material/menu';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';

import { NgChartsModule } from 'ng2-charts';

import { CharactersComponent } from './components/characters/characters.component';
import { CamelConverterPipe } from './components/pipes/camelConverter/camel-converter.pipe';
import { DestinyStatPipe } from './components/pipes/destinyStat/destiny-stat.pipe';
import { StatsComponent } from './components/stats/stats.component';
import { ProfilesComponent } from './components/profiles/profiles.component';
import { HomeComponent } from './components/home/home.component';
import { TimePlayedPipe } from './components/pipes/timePlayed/time-played.pipe';
import { StatComponent } from './components/stat/stat.component';
import { ProfileDeleteDialog } from './components/profiles/profile-delete.component';
import { StatSectionComponent } from './components/stat-section/stat-section.component';
import { ProfileUpdateDialog } from './components/profiles/profile-update.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { SearchPageComponent } from './components/search-page/search-page.component';
import { VendorsPageComponent } from './components/vendors-page/vendors-page.component';

@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    CharactersComponent,
    CamelConverterPipe,
    DestinyStatPipe,
    StatsComponent,
    ProfilesComponent,
    HomeComponent,
    TimePlayedPipe,
    StatComponent,
    ProfileDeleteDialog,
    ProfileUpdateDialog,
    StatSectionComponent,
    LandingPageComponent,
    HomePageComponent,
    ToolbarComponent,
    SearchPageComponent,
    VendorsPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatCommonModule,
    MatInputModule,
    MatFormFieldModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSidenavModule,
    MatRippleModule,
    MatButtonToggleModule,
    MatGridListModule,
    MatToolbarModule,
    MatDialogModule,
    MatListModule,
    MatTabsModule,
    MatMenuModule,
    MatAutocompleteModule,
    NgChartsModule,
    ClipboardModule,
    MatSnackBarModule,
    MatChipsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
