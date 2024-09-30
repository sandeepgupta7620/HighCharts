import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular'; 
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common'; // For ngIf
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-charts',
  standalone: true,
  imports: [
    HighchartsChartModule, 
    CommonModule,
    MatOptionModule,
    MatFormFieldModule,
    MatSelectModule
  ],
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss']
})
export class ChartsComponent implements OnInit {
  movies: any[] = [];
  isLoading = true;

  Highcharts: typeof Highcharts = Highcharts;

  // Chart configurations for all five charts
  chartOptions1: Highcharts.Options = {};
  chartOptions2: Highcharts.Options = {};
  chartOptions3: Highcharts.Options = {};
  chartOptions4: Highcharts.Options = {};
  chartOptions5: Highcharts.Options = {};

  // Dropdown for selecting the chart type for each chart
  selectedChartType1: string = 'column'; // Default chart type for chart 1
  selectedChartType2: string = 'line'; // Default chart type for chart 2
  selectedChartType3: string = 'bar'; // Default chart type for chart 3
  selectedChartType4: string = 'line'; // Default chart type for chart 4
  selectedChartType5: string = 'column'; // Default chart type for chart 5

  constructor(private router: Router, private apiservice: ApiService) {}

  ngOnInit(): void {
    this.loadMovies();
  }

  loadMovies() {
    this.isLoading = true;
    this.apiservice.getMovies().subscribe((result) => {
      this.movies = result;
      this.createCharts(); // Generate charts after movies are loaded
      this.isLoading = false;
    }, (error) => {
      console.error('Error fetching movies', error);
      this.isLoading = false;
    });
  }

  // Functions to handle chart type change for each chart
  onChartTypeChange1(chartType: string) {
    this.selectedChartType1 = chartType;
    this.createCharts(); // Recreate the first chart with the new chart type
  }

  onChartTypeChange2(chartType: string) {
    this.selectedChartType2 = chartType;
    this.createCharts(); // Recreate the second chart with the new chart type
  }

  onChartTypeChange3(chartType: string) {
    this.selectedChartType3 = chartType;
    this.createCharts(); // Recreate the third chart with the new chart type
  }

  onChartTypeChange4(chartType: string) {
    this.selectedChartType4 = chartType;
    this.createCharts(); // Recreate the fourth chart with the new chart type
  }

  onChartTypeChange5(chartType: string) {
    this.selectedChartType5 = chartType;
    this.createCharts(); // Recreate the fifth chart with the new chart type
  }

  createCharts() {
    // 1. Year by Movie/Series Count
    const yearCount = this.movies.reduce((acc, movie) => {
      const year = new Date(movie.released).getFullYear();
      acc[year] = (acc[year] || 0) + 1;
      return acc;
    }, {});

    this.chartOptions1 = {
      chart: { type: this.selectedChartType1 },
      title: { text: 'Year by Movie/Series Count' },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.y}</b> '
      },
      xAxis: this.selectedChartType1 === 'pie' ? undefined : {
        categories: Object.keys(yearCount),
        title: { text: 'Year' }
      },
      series: [{
        name: 'Count',
        data: Object.keys(yearCount).map(year => ({
          name: year,
          y: yearCount[year]
        })),
        type: this.selectedChartType1 as any,
        showInLegend: true
      }],
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.y}'
          }
        }
      }
    };

    // 2. Year-wise Avg IMDB Rating
    const yearRatings = this.movies.reduce((acc, movie) => {
      const year = new Date(movie.released).getFullYear();
      if (!acc[year]) acc[year] = { totalRating: 0, count: 0 };
      acc[year].totalRating += movie.imdbRating;
      acc[year].count++;
      return acc;
    }, {});

    const avgRatings = Object.keys(yearRatings).map(year => ({
      year,
      avgRating: yearRatings[year].totalRating / yearRatings[year].count
    }));

    this.chartOptions2 = {
      chart: { type: this.selectedChartType2 },
      title: { text: 'Year-wise Avg IMDB Rating' },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.y}</b> (<b>{point.percentage:.1f}%</b>)'
      },
      xAxis: this.selectedChartType2 === 'pie' ? undefined : {
        categories: avgRatings.map(item => item.year),
        title: { text: 'Year' }
      },
      series: [{
        name: 'Avg Rating',
        data: avgRatings.map(item => ({
          name: item.year,
          y: item.avgRating
        })),
        type: this.selectedChartType2 as any,
        showInLegend: true
      }],
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.y}'
          }
        }
      }
    };

    // 3. Genre-wise Avg Runtime
    const genreRuntimes = this.movies.reduce((acc, movie) => {
      const genres: string[] = movie.genre.split(', ');
      genres.forEach((genre) => {
        if (!acc[genre]) acc[genre] = { totalRuntime: 0, count: 0 };
        acc[genre].totalRuntime += movie.runtime;
        acc[genre].count++;
      });
      return acc;
    }, {});

    const avgRuntimesByGenre = Object.keys(genreRuntimes).map(genre => ({
      genre,
      avgRuntime: genreRuntimes[genre].totalRuntime / genreRuntimes[genre].count
    }));

    this.chartOptions3 = {
      chart: { type: this.selectedChartType3 },
      title: { text: 'Genre-wise Avg Runtime' },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.y}</b> (<b>{point.percentage:.1f}%</b>)'
      },
      xAxis: this.selectedChartType3 === 'pie' ? undefined : {
        categories: avgRuntimesByGenre.map(item => item.genre),
        title: { text: 'Genre' }
      },
      series: [{
        name: 'Avg Runtime',
        data: avgRuntimesByGenre.map(item => ({
          name: item.genre,
          y: item.avgRuntime
        })),
        type: this.selectedChartType3 as any,
        showInLegend: true
      }],
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.y}'
          }
        }
      }
    };

    // 4. Year on Year Runtime Change
    const yearRuntimes = this.movies.reduce((acc, movie) => {
      const year = new Date(movie.released).getFullYear();
      if (!acc[year]) acc[year] = { totalRuntime: 0, count: 0 };
      acc[year].totalRuntime += movie.runtime;
      acc[year].count++;
      return acc;
    }, {});

    const yearRuntimeChanges = Object.keys(yearRuntimes).map(year => ({
      year,
      avgRuntime: yearRuntimes[year].totalRuntime / yearRuntimes[year].count
    }));

    this.chartOptions4 = {
      chart: { type: this.selectedChartType4 },
      title: { text: 'Year on Year Runtime Change' },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.y}</b> (<b>{point.percentage:.1f}%</b>)'
      },
      xAxis: this.selectedChartType4 === 'pie' ? undefined : {
        categories: yearRuntimeChanges.map(item => item.year),
        title: { text: 'Year' }
      },
      series: [{
        name: 'Avg Runtime',
        data: yearRuntimeChanges.map(item => ({
          name: item.year,
          y: item.avgRuntime
        })),
        type: this.selectedChartType4 as any,
        showInLegend: true
      }],
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.y}'
          }
        }
      }
    };

    // 5. Year on Year Genre & Language Runtime Change
    const genreLangRuntimes = this.movies.reduce((acc, movie) => {
      const year = new Date(movie.released).getFullYear();
      const genre = movie.genre.split(', ')[0]; // Assuming the first genre is primary
      const lang = movie.language; // Assuming a language field exists
      const key = `${year}-${genre}-${lang}`;

      if (!acc[key]) acc[key] = { totalRuntime: 0, count: 0 };
      acc[key].totalRuntime += movie.runtime;
      acc[key].count++;
      return acc;
    }, {});

    const genreLangYearChanges = Object.keys(genreLangRuntimes).map(key => {
      const [year, genre, lang] = key.split('-');
      return {
        year,
        genre,
        lang,
        avgRuntime: genreLangRuntimes[key].totalRuntime / genreLangRuntimes[key].count
      };
    });

    this.chartOptions5 = {
      chart: { type: this.selectedChartType5 },
      title: { text: 'Year on Year Genre & Language Runtime Change' },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.y}</b> (<b>{point.percentage:.1f}%</b>)'
      },
      xAxis: this.selectedChartType5 === 'pie' ? undefined : {
        categories: genreLangYearChanges.map(item => item.year),
        title: { text: 'Year' }
      },
      series: [{
        name: 'Avg Runtime',
        data: genreLangYearChanges.map(item => ({
          name: `${item.genre} (${item.lang})`, // Combine genre and language
          y: item.avgRuntime
        })),
        type: this.selectedChartType5 as any,
        showInLegend: true
      }],
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.y}'
          }
        }
      }
    };
  }

  goToTables() {
    this.router.navigate(['/movies']);
  }
}
