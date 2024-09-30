
import { Routes } from '@angular/router';
import { MoviesComponent } from './pages/movies/movies.component';
import { ChartsComponent } from './pages/charts/charts.component';

export const routes: Routes = [
    {path : '', redirectTo:'/movies', pathMatch:'full'},

    {path : 'movies', component: MoviesComponent},
    {path : 'charts', component: ChartsComponent},

];
