import { GlobalDataSummary } from './../../models/global-data';
import { DataServiceService } from './../../services/data-service.service';
import { Component, OnInit, Input } from '@angular/core';
import { GoogleChartInterface } from 'ng2-google-charts';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  totalConfirmed = 0;
  totalActive = 0;
  totalDeaths = 0;
  totalRecovered = 0;
  loading = true;
  globalData: GlobalDataSummary[] = [];
  pieChart: GoogleChartInterface = {
    chartType : 'PieChart'
  }
  columnChart: GoogleChartInterface = {
    chartType : 'ColumnChart'
  }

  constructor(private dataService : DataServiceService) { }

  initChart(caseType: string){
    let datatable : any =[];
    datatable.push(["Country", "Cases"])
    this.globalData.forEach(cs=>{
      let value : any;
      if(caseType == 'c')
          if(cs.confirmed>2000)
            value = cs.confirmed
      if(caseType == 'a')
          if(cs.active>2000)
            value = cs.active
      if(caseType == 'd')
          if(cs.deaths>1000)
            value = cs.deaths
      if(caseType == 'r')
          if(cs.recovered>2000)
            value = cs.recovered
          
      datatable.push([cs.country, value])
        })
    console.log(datatable);
    this.pieChart = {
      chartType: 'PieChart',
      dataTable: datatable,
      options: { height : 500,
        animation:{
          duration:1000,
          easing: 'out'
     },
    },
    };
    this.columnChart = {
      chartType: 'ColumnChart',
      dataTable: datatable,
      options: { height : 500,
        animation:{
          duration:1000,
          easing: 'out'
     },
    },
    };
  }

  ngOnInit(): void {

    this.dataService.getGlobalData().subscribe({
      next : (result) => {
        console.log(result);
        this.globalData = result;
        result.forEach(cs => {
          if(!Number.isNaN(cs.confirmed)){
            this.totalActive+=cs.active 
            this.totalConfirmed+=cs.confirmed
            this.totalDeaths+=cs.deaths
            this.totalRecovered+=cs.recovered
          }
        })
        this.initChart('c');
      },
      complete : ()=>{
        this.loading = false;
      }
    })
  }

  updateChart(input: HTMLInputElement){
    console.log(input.value);
    this.initChart(input.value);

  }

}
