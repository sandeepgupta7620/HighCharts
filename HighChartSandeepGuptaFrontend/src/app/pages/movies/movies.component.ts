import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';
@Component({
  selector: 'app-movies',
  standalone: true,
  imports: [CommonModule,MatTableModule],
  templateUrl: './movies.component.html',
  styleUrl: './movies.component.scss'
})
export class MoviesComponent implements OnInit{
  movies : any[]=[];

  displayedColumns: string[] = ['title', 'year', 'genre', 'imdbRating', 'imdbVotes', 'released', 'runtime', 'country', 'language', 'rated'];

  constructor(private apiservice : ApiService, private router : Router){}
  ngOnInit(): void {
    this.loadMovies();
  }

  loadMovies(){
    this.apiservice.getMovies().subscribe((result)=>{
      this.movies = result;
      
    })
  }

  goToCharts(){
    this.router.navigate(['/charts']);
  }



}
