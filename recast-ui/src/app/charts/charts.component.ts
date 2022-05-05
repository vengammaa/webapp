import { Component, OnInit ,Input, SimpleChanges, Optional } from '@angular/core';
import { ChartOptions, ChartType,ChartDataSets} from 'chart.js';
import { Label, SingleDataSet, Color, MultiDataSet,PluginServiceGlobalRegistrationAndOptions} from 'ng2-charts';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
//import { report } from 'process';
import * as Highcharts from 'highcharts';
import Drilldown from 'highcharts/modules/drilldown';
Drilldown(Highcharts);

//// charts /////
import {ReportsService} from '../services/reports.service';
import { GlobalConstants } from '../common/GlobalConstants';
import { Chart } from 'angular-highcharts';
import * as _ from 'lodash';
import { first } from 'rxjs/operators';

@Component({
  selector: 'charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css']
})
export class ChartsComponent implements OnInit {
  @Input() taskDetails:any = [];
  @Input() commanalityData:any = [];
  
  ///Highcharts
  reportUserCountData: any;
  taskId: number;
  reportUserDetails: any = [];

  //Universe highcharts
  universeCountData: any;
  universeDetails: any = [];
  drilldownSeriesData: any = [];

  chart: Chart;
  drilldownChart: Chart;
  options: Highcharts.Options;
  drilldownOptions: Highcharts.Options;

  isDataAvailable:boolean=false;
  highcharts = Highcharts;

  public barChartOptions: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    legend: { 
      position: 'right',
      labels: {
        fontSize: 12,
        usePointStyle: true
      } 
    },
    scales: { xAxes: [{}], yAxes: [{
      ticks: {
       
        min: 0
      }
    }] },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    }
  };
  public barChartLabels: Label[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [pluginDataLabels];
  public barChartData: ChartDataSets[] = [];

  public barChartColors = [
    { backgroundColor:"#1d2859" }]

    public reportCreationbarChartOptions: ChartOptions = {
      responsive: true,
      // We use these empty structures as placeholders for dynamic theming.
      scales: { xAxes: [{}], yAxes: [{
        ticks: {
         
          min: 0
        }
      }] },
      plugins: {
        datalabels: {
  
          anchor: 'end',
          align: 'end',
        }
      },
      legend: { 
        position: 'right',
        labels: {
          fontSize: 12, 
          usePointStyle: true
        } 
      },
    };


  public reportCreationbarChartLabels: Label[] = ['0-25','25-50','50-75','75 and above'];
  public reportCreationbarChartType: ChartType = 'bar';
  public reportCreationbarChartLegend = true;
  public reportCreationbarChartPlugins = [pluginDataLabels];
  public reportCreationbarChartData: ChartDataSets[] = [];
  public reportCreationbarChartColors = [
    { backgroundColor:"#2ecc71" }]
  

  public doughnutChartLabels: Label[] = [];
  public doughnutChartData: MultiDataSet = [ ];
  public doughnutChartType: ChartType = 'doughnut';
  
  public repCategoryChartLabels: Label[] = ['Chart','List'];
  public repCategoryChartData: MultiDataSet = [ ];
  public repCategoryChartType: ChartType = 'doughnut';

  public repComplexityChartLabels: Label[] = ['Simple','Medium','Complex'];
  public repComplexityChartData: MultiDataSet = [ ];
  public repComplexityChartType: ChartType = 'doughnut';
  public repComplexityChartColors: Color[] = [{
    backgroundColor: ['#f1c40f', '#2ecc71', '#e74c3c']
   }];

  public scatterChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      xAxes: [{ ticks: { min: 0 } }],
      yAxes: [{
        ticks: {
          min: 0,
        
        }
      }]
    }
  };

  public scatterChartData: ChartDataSets[] = [ ];
  public scatterChartType: ChartType = 'scatter';  
  public lineChartData: ChartDataSets[] = [ ];
  public lineChartLabels: Label[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July','August','September','October','November','December'];
  // public lineChartOptions: (ChartOptions & { annotation: any }) = {
   
  // };
  //public lineChartPlugins = const [pluginAnnotations];
  public lineChartColors: Color[] = [
    { 
      backgroundColor: 'rgba(250, 2, 2,0.7)',
      borderColor: 'rgba(250, 2, 2,0.6)'
      // pointBackgroundColor: 'rgba(148,1595,177,1)',
      // pointBorderColor: '#fff',
      // pointHoverBackgroundColor: '#fff',
      // pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    {
      backgroundColor: 'rgba(250, 205, 2,0.7)',
      borderColor: 'rgba(250, 205, 2,0.6)'
      // pointBackgroundColor: 'rgba(77,83,96,1)',
      // pointBorderColor: '#fff',
      // pointHoverBackgroundColor: '#fff',
      // pointHoverBorderColor: 'rgba(77,83,96,1)'
    },
    { 
      backgroundColor: 'rgba(7, 186, 55,0.7)',
      borderColor: 'rgba(7, 186, 55,0.6)'
      // pointBackgroundColor: 'rgba(148,159,177,1)',
      // pointBorderColor: '#fff',
      // pointHoverBackgroundColor: '#fff',
      // pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    {
      backgroundColor: 'rgba(132, 158, 16,0.7)',
      borderColor: 'rgba(132, 158, 16,0.6)'
     
      // pointBackgroundColor: 'rgba(148,159,177,1)',
      // pointBorderColor: '#fff',
      // pointHoverBackgroundColor: '#fff',
      // pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { 
      backgroundColor: 'rgb(28, 18, 79,0.7)',
      borderColor: 'rgba(28, 18, 79,0.6)'
      // pointBackgroundColor: 'rgba(148,159,177,1)',
      // pointBorderColor: '#fff',
      // pointHoverBackgroundColor: '#fff',
      // pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { 
      backgroundColor: 'rgb(252, 98, 3,0.7)',
      borderColor: 'rgba(252, 98, 3,0.6)'
      // pointBackgroundColor: 'rgba(148,159,177,1)',
      // pointBorderColor: '#fff',
      // pointHoverBackgroundColor: '#fff',
      // pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];
  public lineChartLegend = true;
  public lineChartType = 'line';
  public lineChartPlugins:any = [];
  totalReportCount:number;
  totalPublishedRepCount:number = 0;
  totalScheduledRepCount:number = 0;
  totalActivelyUsedRepCount:number = 0;
  totalUnkown = 0;
  totalCommanalityReports = 0;
  chartReportCnt:number=0;
  listReportCnt:number=0;

  noOfInstances:any = [];
  recurringInstances:any = [];
  avgRunTime:any = [];
  totalSize:any= [];
  noOfBlocks:any = [];
  noOfFormulas:any = [];
  noOfTabs:any= [];
  noOfFilters:any = [];
  noOfCols:any = [];  
  noOfFailures:any = [];
  noOfQueries:any = [];
  universeCount:any = [];
  reportType:any = [];
  selectedReport:string;
  highchartsData: any = [];
  //options12: any = {};

  constructor(private reportServ: ReportsService) { 
    console.log("Constructor called");
    this.taskId = GlobalConstants.globalTask.id;
  
  }
  ngOnInit(): void {
   
  }

  ngDoCheck() {
    if (GlobalConstants.globalFlagCharts === 0) {
      GlobalConstants.globalFlagCharts = 1;
      this.taskId = GlobalConstants.globalTask.id;
      this.highChartsCall();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
  //  alert("In charts component");
  //  console.log(this.taskDetails);
  let tasks = [];

   tasks = this.taskDetails;
   this.totalReportCount = tasks.length;
    this.isDataAvailable = true;
    this.generateReportTypeChart()  
    this.extractReporttype();
    this.getTotalDataCounts();
    this.generateComplexityChart();
    this.generateCommanalityChart();
    this.generateUpdatedReportChart();

  }

  highChartsCall() {
    this.getReportUserCount();
    this.getUniverseCount();
    this.options  = {
      chart :{
          type: 'column',   
      },
      title:{
        text:''
      },
      xAxis: {
          title: {
              text: 'Users'
          },
          labels:{
              enabled : false
          }
        },
  
      yAxis: {
          title: {
              text: 'Number of reports' ,
              align: 'middle'
          },
          labels: {
              overflow: 'justify'
          }
      },
      tooltip: {
        formatter: function() {
            return '<b>' + this.y + '</b>' + ' reports of <b>' + this.series.name + '</b>  ';
        }
    },
      legend: {
          enabled : false,
      },
      credits: {
          enabled: false
      },
      plotOptions: {
        series: {
          borderWidth: 0,
          dataLabels: {
              enabled: true
          }
      }
      },
      series: []
    }

    let chart = new Chart(this.options);
    this.chart = chart;

    this.drilldownOptions = {
      chart: {
        type: 'column'
      },
      title: {
          text: ''
      },
      xAxis: {
        title: {
          text: 'Universe'
          },
          type: 'category'
      },
      yAxis: {
  
        title: {
            text: 'Number of reports' ,
            align: 'middle'
        },
        labels: {
            overflow: 'justify'
        }
      },
      legend: {
          enabled: false
      },
      credits: {
        enabled: false
      },
      plotOptions: {
          series: {
              borderWidth: 0,
              dataLabels: {
                  enabled: true
              }
          }
      },
      series: [],
      drilldown: {
          series: []
      }
    }

    let drilldownChart = new Chart(this.drilldownOptions);
    this.drilldownChart = drilldownChart;
  }
  
  generateReportCategoryChart(){
    
   this.getTotalDataCounts();
   this.repCategoryChartLabels = ['Chart','List'];
   this.repCategoryChartData = [[this.chartReportCnt,this.listReportCnt]]
    
  }
 
  getTotalDataCounts(){
    this.chartReportCnt = 0;
    this.listReportCnt = 0;
    let crossTabcnt = 0;
    let crossTabListCnt = 0;
    let listChartCnt = 0;
    let crossTabChartCnt = 0;
    let crossTabListChartCnt = 0;
    let webiCnt = 0;
    let flag = 0;
    
    for(let data of this.taskDetails){
     
      switch(data.reportType) { 
        case 'Chart': { 
          this.chartReportCnt++;
           break; 
        } 
        case 'List': {          
           this.listReportCnt++;
           break; 
        } 
        case 'List-Chart': {          
          listChartCnt++;
          break; 
        }
        case 'CrossTab': {          
          crossTabcnt++;
          break; 
        }
        case 'CrossTab-List': {          
          crossTabListCnt++;
          break; 
        }   
        case 'CrossTab-Chart': {          
          crossTabChartCnt++;
          break; 
        }
        case 'CrossTab-List-Chart': {          
          crossTabListChartCnt++;
          break; 
        }
        case 'Webi': {          
          webiCnt++;
          flag = 1;
          break; 
        }
       
        default: { 
           //statements; 
           break; 
        } 
     } 
    }
 //   console.log(this.reportType)
    if(flag == 0){
      this.barChartLabels = ['List','Chart','CrossTab','CrossTab Chart','CrossTab List','CrossTab ListChart','List-Chart'];    
      this.barChartData = [
        { data: [this.listReportCnt,this.chartReportCnt,crossTabcnt,crossTabChartCnt,crossTabListCnt,crossTabListChartCnt,listChartCnt], label: 'No of Reports' },
     
      ];
    }
    else{
      this.barChartLabels = this.reportType;    
      this.barChartData = [
        { data: [webiCnt], label: 'No of Reports' },
     
      ];
    }
   
  }
  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }
  extractReporttype(){
    let reportTypes = [];
    for(let rep of this.taskDetails){
      reportTypes.push(rep.reportType);
    }
  //  console.log(reportTypes)
    this.reportType = reportTypes.filter(function(elem, index, self) {
      return index === self.indexOf(elem);
     })
  
  }
  generateReportTypeChart(){
    let total = 0;
    this.totalScheduledRepCount = 0;
    this.totalPublishedRepCount = 0;
    this.totalActivelyUsedRepCount = 0;
    for(let report of this.taskDetails){
      
      if(report['reportScheduled'] == true){
         this.totalScheduledRepCount ++;
      }
      if(report['reportPublished'] == true){
       this.totalPublishedRepCount ++;
      }
      if(report['activelyUsed'] == true){
       this.totalActivelyUsedRepCount ++;
      }
     } 

   total = this.totalScheduledRepCount + this.totalPublishedRepCount + this.totalActivelyUsedRepCount;
   if(this.totalReportCount > total){
    this.totalUnkown = this.totalReportCount - total;
   }
   else{
     this.totalUnkown = 0;
   }

   this.doughnutChartLabels = ['Published Reports', 'Scheduled Reports', 'Actively Used Reports','Unknown'];
   this.doughnutChartData = [[this.totalPublishedRepCount , this.totalScheduledRepCount , this.totalActivelyUsedRepCount,this.totalUnkown]]
  }

  generateComplexityChart(){
    let simple = 0;
    let medium = 0;
    let complex = 0;

    for(let data of this.taskDetails){
     if(data.complexity <= 50){
       simple++;
    }
    else if(data.complexity > 50 && data.complexity <= 100){
       medium++;
    }
    else{
      complex++;
    }
  }
   
    this.repComplexityChartData = [[simple,medium,complex]]
  }
  reportCreationDataReports(){
    let year_16_cnt:number = 0;
    let year_17_cnt = 0;
    let year_18_cnt = 0;
    let year_19_cnt = 0;
    let year_20_cnt = 0;
    let year_21_cnt = 0;

    for(let data of this.taskDetails){
      let year = data.reportCreationDate.split("T")[0].split("-")[0];
      
      switch(year) { 
        case '2016': { 
          year_16_cnt++;
           break; 
        } 
        case '2017': {           
          year_17_cnt++;
           break; 
        } 
        case '2018': {           
          year_18_cnt++;
          break; 
        } 
        case '2019': {             
          year_19_cnt++;
          break; 
        } 
        case '2020': {             
          year_20_cnt++;
          break; 
        } 
        default: { 
           //statements; 
           break; 
        } 
     } 
    }
    this.reportCreationbarChartLabels = ['2017','2018','2019','2020','2021'];
    this.reportCreationbarChartData = [
      { data:[year_17_cnt, year_18_cnt, year_19_cnt, year_20_cnt,year_21_cnt], label: 'No of Reports created per year' },
      // { data: [10,2,4,12,20], label: 'No of Reports' },
   
    ];
  }

  generateCommanalityChart(){
    let firstRange = 0;
    let secondRange = 0;
    let thirdRange = 0;
    let fourthRange = 0;
    let fifthRange = 0;
    this.totalCommanalityReports = this.commanalityData.length;
    for(let data of this.commanalityData){
      
      if(data.commonality >=0 && data.commonality <=25){
        firstRange++;
      }
      else if(data.commonality >=25 && data.commonality <=50){
        secondRange++;
      }
      else if(data.commonality >=50 && data.commonality <=75){
        thirdRange++;
      }
      else if(data.commonality >=75){
        fourthRange++;
      }
      else{
       
      }
    }
    
    
  //console.log(firstRange +'-'+ secondRange+'-' + thirdRange +'-'+ fourthRange +'-'+ fifthRange)
    this.reportCreationbarChartData = [
      { data: [firstRange,secondRange,thirdRange,fourthRange], label: 'Commanalities' },
      // { data: [10,2,4,12,20], label: 'No of Reports' },
   
    ];
    // this.scatterChartData = [{
    //   data: [
    //     { x: 10, y: firstRange },
    //     { x: 20, y: secondRange },
    //     { x: 30, y: thirdRange },
    //     { x: 40, y: fourthRange },
    //     { x: 50, y: fifthRange },
    //   ],
    //   label: 'Reports with commanality',
    //   pointRadius: 10,
    // },]
  }

  generateUpdatedReportChart(){
    
    let array_2019 = [];
    let array_2016 = [];
    let array_2017 = [];
    let array_2018 = [];
    let array_2020 = [];
    let array_2021 = [];
    array_2016 = this.generateChartArray('2016');
    array_2017 = this.generateChartArray('2017');
    array_2018 = this.generateChartArray('2018');
    array_2019 = this.generateChartArray('2019');
    array_2020 = this.generateChartArray('2020');
    array_2021 = this.generateChartArray('2021');
    this.lineChartData = [
      { data: array_2016, label: '2016' },
      { data: array_2017, label: '2017' },
      { data: array_2018, label: '2018' },
      { data: array_2019, label: '2019' },
      { data: array_2020, label: '2020' },
      { data: array_2021, label: '2021' },
    ]
  }
  generateChartArray(year:any){
    let mothlyCountArray = [];
    let dates = [];
    let jan = 0;
    let feb = 0;
    let mar = 0;
    let apr = 0;
    let may = 0;
    let jun = 0;
    let jul = 0;
    let aug = 0;
    let sept = 0;
    let oct = 0;
    let nov = 0;
    let dec = 0;   
   
    for(let data of this.taskDetails){
      dates.push(data.reportUpdatedDate.split("T")[0])
    }

    for(let date of dates){
      if(date.split("-")[0] == year){
          switch(date.split("-")[1]) { 
          case '01': { 
            jan++;
             break; 
          } 
          case '02': { 
            
             feb++;
             break; 
          } 
          case '03': { 
            
            mar++;
            break; 
         } 
         case '04': { 
            
             apr++;
             break; 
          } 
          case '05': { 
            
            may++;
            break; 
          } 
          case '06': { 
            
            jun++;
            break; 
          } 
          case '07': { 
            
            jul++;
            break; 
          } 
          case '08': { 
            
            aug++;
            break; 
          } 
          case '09': { 
            
            sept++;
            break; 
          } 
          case '10': { 
            
            oct++;
            break; 
          } 
          case '11': { 
            
            nov++;
            break; 
          }
          case '12': { 
            
            dec++;
            break; 
          } 
          default: { 
             //statements; 
             break; 
          } 
       } 

      }
    }
    //console.log(jan,feb,mar,apr,may,jun,jul,aug,sept,oct,nov,dec)
    mothlyCountArray = [];
    mothlyCountArray = [jan,feb,mar,apr,may,jun,jul,aug,sept,oct,nov,dec];
    return mothlyCountArray;
   }

  // Highcharts ///
  getReportUserCount() {
    this.reportUserCountData = [];
    this.reportUserDetails = [];
    this.reportServ.getReportUserCount(this.taskId).subscribe(resp => {
      this.reportUserCountData = resp as string[];
      console.log(this.reportUserCountData);
      for (let data of this.reportUserCountData) {
        this.reportUserDetails.push({name: data.reportUser, type: undefined, data: [data.count]});
      }

      this.chart.ref$.pipe(first()).subscribe(chart => {
        this.updateChart({series: this.reportUserDetails});
      });
    },
    errorCode => console.log("error while fetching report types" + JSON.stringify(errorCode)));
    
  }

  getUniverseCount() {
    this.universeCountData = [];
    this.universeDetails = [];
    this.drilldownSeriesData = [];
    this.reportServ.getUniverseCount(this.taskId).subscribe(resp => {
      this.universeCountData = resp as string[];
      let array1 = [];
      let drillDowndata: any = [];
      console.log(this.universeCountData);
      for (let data of this.universeCountData) {
        array1.push({name: data.universeName, y: data.count, drilldown: data.universeName});

        for (let reportTypeData of data.reportTypeModel) {
          drillDowndata.push([reportTypeData.reportType, reportTypeData.count]);
        }
        this.drilldownSeriesData.push({id: data.universeName, type: undefined, data: drillDowndata});
        console.log("id: "+ data.universeName + " data: " + drillDowndata);
        drillDowndata = [];
      }
      this.universeDetails.push({name: 'Universe', colorByPoint: true, type: undefined, data: array1});

      this.drilldownChart.ref$.pipe(first()).subscribe(drilldownChart => {
        this.updateDrilldownChart({series: this.universeDetails, drilldown: {series: this.drilldownSeriesData}});
        
      });

    },
    errorCode => console.log("error while fetching report types" + JSON.stringify(errorCode)));
  }

  private updateChart = (options: Highcharts.Options) => {
    // By default if the value of the object property is undefined lodash won't use this but keeps
    // the original after using _.merge(). We can customize the merge with _.mergeWith().
    // If we return undefined inside the customizer function lodash handles the merge like above not keeping the undefined value.
    // With deleting the property we trick lodash and with this the property gets undefined value after the merge.
    const customizer = (_objValue: Optional, srcValue: Optional, key: any, object: any) => {
      if (srcValue === undefined) delete object[key];
    };

    console.log(options.chart, options.plotOptions);
    const mergedOptions = _.mergeWith(this.options, options, customizer);
    console.log(mergedOptions.chart, mergedOptions.plotOptions);

    this.chart = new Chart(mergedOptions);
  };

  private updateDrilldownChart = (options: Highcharts.Options) => {
    const customizer = (_objValue: Optional, srcValue: Optional, key: any, object: any) => {
      if (srcValue === undefined) delete object[key];
    };

    console.log(options.chart, options.plotOptions);
    const mergedOptions = _.mergeWith(this.drilldownOptions, options, customizer);
    console.log(mergedOptions.chart, mergedOptions.plotOptions);

    this.drilldownChart = new Chart(mergedOptions);
  };

}
