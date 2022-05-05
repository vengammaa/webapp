import { Component, OnInit ,Input,ViewChild,AfterViewInit,SimpleChanges, Directive} from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { ConnectionService } from '../services/connection.service';
import { Subject } from 'rxjs';
import {GlobalConstants} from '../common/GlobalConstants';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

declare var jQuery: any;
@Component({
  selector: 'app-connection-param',
  templateUrl: './connection-param.component.html',
  styleUrls: ['./connection-param.component.css']
})

export class ConnectionParamComponent implements OnInit{

  @Input() sourceSystemConnection: String;

  projectId!: string;
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  addedConnections: any = [];
  showConnList: boolean = true;
  showEstablishingConnection: boolean = false;
  hideConfirmation:boolean = false;
  editConfirmation:boolean = false;
  connIdToBeDeleted: number;
  connDisplayName: string;
  showNewConnectionForm: boolean = false;
  deleteConnError:string;
  newConnectionForm: FormGroup;
  showEditConnectionForm: boolean = false;
  connParams: any = [];
  connNameList: any = [];
  submitted = false;
  connections:any=[];
  connDetails: any = [];
  connParamDetails: any = [];
  testingStatus: any = '';
  selectedLevel: any = '';
  selectedExtract: any = '';
  editSelectedLevel: any = '';
  editSelectedExtract: any = '';

  testingConn: any = '';
  closeResult: string;
  modalErrorMessage: string = '';

  isDisabled : boolean = true;
  cc = 0;
  connectionSelection : string = '';

  connId: string;
  treeData:any = {};
  treeNodeData: any = {};
  pathAndReportMapData: any = {};
  reportType: string = '';

  //File handling
  uploadForm: FormGroup;
  serverPath: string = '';
  addLocal: boolean = false;
  uploadDisabled: boolean = true;
  editUploadDisabled: boolean = true;

  constructor(private formBuilder: FormBuilder,private connObj: ConnectionService, private modalService: NgbModal) {
     // alert("Constructor connection param")
     this.newConnectionForm = this.formBuilder.group({
      connName: ['', Validators.required],
    //  connType:  ['', Validators.required],
      connParams: new FormControl(),
    });

    this.uploadForm = this.formBuilder.group({
      twbFile: [''],
      twbEditFile: ['']
    });
      
  }


  ngOnInit(): void {
   // alert("on init Connection param");

   // this.getAllConnections();
    this.dtOptions = {
      pagingType: 'full_numbers',
      processing: true,
      jQueryUI: true,
      dom: "lfBrtip",
      drawCallback: function(oSetting: any) {
        $('input').filter(':radio').prop('checked', false);
        $('#connNext').prop('disabled', true);
      }
    }

}

ngDoCheck(): void {
  if (GlobalConstants.globalFlagStep2 === 0) {
    GlobalConstants.globalFlagStep2 = 1;
    GlobalConstants.shouldSkipStepForPath = false;
    this.getAddedConnections();
    this.getConnectionParams(GlobalConstants.reportTypeConst);
    this.isDisabled  = true;
  }
}

  ngAfterContentInit()
  {
  //  alert("Called ng after content init");
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  getAllConnections() {
    this.connObj.getAllConnnectionNames()
      .subscribe(resp => {
        
        this.connections = resp as string[];
       
      //  this.dtTrigger.next();
      },
        errorCode => console.log("Error in updating project data " + JSON.stringify(errorCode)));
  }

  getAddedConnections() {
    this.projectId=GlobalConstants.globalProjectId;
    
    this.connObj.getAddedConnections(this.projectId)
      .subscribe(resp => {
        this.addedConnections = [];
        this.connNameList = [];

        for (let data of resp as string[]) {
        
          if(data['reportType'].code==GlobalConstants.reportTypeConst)
          {
            this.addedConnections.push({ 'id': data['id'], 'name': data['name'], 'reportType': data['reportType'].name, 'status': data['reportType']['status'].name, 'connStatus': data['status'] })
            this.connNameList.push(data['name']);
          }
        }
        console.log(this.addedConnections);
       this.rerender();
      },
        errorCode => console.log("Error in updating project data " + JSON.stringify(errorCode)));
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
     dtInstance.destroy();
     this.dtTrigger.next();   
     this.isDisabled = true;  
     this.serverPath = '';
 });
}

showNewConnForm(connSel: string) {
  this.connectionSelection = connSel;
  this.showConnList = false;
  this.showNewConnectionForm = true;
}

hideForm() {
  this.showConnList = true;
  this.showNewConnectionForm = false;
  this.showEditConnectionForm = false;
  this.addLocal = false;
  this.selectedLevel = '';
  this.selectedExtract = '';
  this.serverPath = '';
  this.uploadDisabled = true;
  this.editUploadDisabled = true;
 // this.getAddedConnections();
  this.newConnectionForm.reset();
  this.uploadForm.reset();
  for (let param of this.connParams) {
    param.value = '';
  }
}

// testConnection(params: any, content: any, errorContent: any) {

  // if (this.newConnectionForm.invalid) {
  //   this.modalService.open(errorContent, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
  //     this.closeResult = `Closed with: ${result}`;
  //   }, (reason) => {
  //     this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
  //   });
  //  return;
  // }

  // for (let p of params) {
  //   if (p.value === "") {
  //     this.modalService.open(errorContent, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
  //       this.closeResult = `Closed with: ${result}`;
  //     }, (reason) => {
  //       this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
  //     });
  //     return;
  //   }
  // }

//   let connparams = [];
//   for (let p of params) {
//     connparams.push({
//       rptConParamType: { code: p.code },
//       rptConParamValue: p.value
//     })
//   }

//   let data = this.newConnectionForm.value;
//   let input = {
//     reportType: {
//       status: {
//         code:"ACT",
//         name:"Active" 
//       },
//       code: GlobalConstants.reportTypeConst,
//     },
//     name: data.connName,
//     prjRptConParams: connparams
//   }

//   console.log(input);

//   this.connObj.testConnection(input)
//   .subscribe(resp => {
//     console.log(resp);
//     if (resp === 'Success') {
//       this.testingConn = "Connection successfull!!!";
//       this.isTestFinish = true;
//     } else if (resp === 'Fail') {
//       this.testingConn = "Failed to connect!";
//       this.isTestFinish = false;
//     }

//     this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
//       this.closeResult = `Closed with: ${result}`;
//     }, (reason) => {
//       this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
//     });

//   },
//   errorCode => console.log("Error in updating project data " + JSON.stringify(errorCode)));

// }

testConnection(conn: any, testContent: any)  {
 this.showConnList = false;
  this.showEstablishingConnection = true;
  let reportType = GlobalConstants.reportTypeConst;

  this.connObj.tesConnection(conn.id, reportType).subscribe(resp => {
    this.showEstablishingConnection = false;
    this.showConnList = true;
    this.testingStatus = resp;
    this.getAddedConnections();
    this.modalService.open(testContent, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      this.testingStatus = '';
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  },
  errorCode => console.log("Error in testing connection " + JSON.stringify(errorCode)));

  this.newConnectionForm.reset();
}

testEditConnection(conParamsDetails: any, conParams:any, content: any, errorContent: any) {

  if (conParams.name === '') {
    this.modalService.open(errorContent, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
   return;
  }

  for (let param of conParamsDetails) {
    console.log(param);
    if (param.rptConParamValue === "") {
      this.modalService.open(errorContent, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
      return;
    }
  }

  // let connparams = [];
  // for (let p of params) {
  //   connparams.push({
  //     rptConParamType: { code: p.code },
  //     rptConParamValue: p.value
  //   })
  // }

  // let data = this.newConnectionForm.value;
  // let input = {
  //   reportType: {
  //     status: {
  //       code:"ACT",
  //       name:"Active" 
  //     },
  //     code: GlobalConstants.reportTypeConst,
  //   },
  //   name: data.connName,
  //   prjRptConParams: connparams
  // }

  // console.log(input);

  // this.connObj.testConnection(input)
  // .subscribe(resp => {
  //   console.log(resp);
  //   if (resp === 'Success') {
  //     this.testingConn = "Connection successfull!!!";
  //     this.isTestFinish = true;
  //   } else if (resp === 'Fail') {
  //     this.testingConn = "Failed to connect!";
  //     this.isTestFinish = false;
  //   }

  //   this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
  //     this.closeResult = `Closed with: ${result}`;
  //   }, (reason) => {
  //     this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
  //   });

  // },
  // errorCode => console.log("Error in updating project data " + JSON.stringify(errorCode)));

}

selected(event: any) {
  this.selectedLevel = event;
}

selectedExtractType(event: any) {
  this.selectedExtract = event;
}

editSelected(event: any) {
  this.editSelectedLevel = event;
}

editSelectedExtractType(event: any) {
  this.editSelectedExtract = event;
}

handleUpload(data:any) {
  console.log(data.target.value);
}

addConnection(params:any, errorContent: any) {

  if (this.newConnectionForm.invalid) {
    this.modalErrorMessage = 'Please enter connection name!';
    this.modalService.open(errorContent, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
   return;
  }

  let data = this.newConnectionForm.value;

  // var regex = new RegExp( this.connNameList.join( "|" ), "i");

  if (data.connName.trim() === null || data.connName.trim() === "") {
    this.modalErrorMessage = 'Please enter proper connection name!';
    this.modalService.open(errorContent, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    return;
  } 
  else if (/^\d+$/.test(data.connName.trim()) || /^[^a-zA-Z0-9]+$/.test(data.connName.trim())) {
    this.modalErrorMessage = 'Please enter valid connection name!';
      this.modalService.open(errorContent, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
      return;
  } else if (this.connNameList.length !== 0) {
    if (this.connNameList.includes(data.connName.trim())) {
      this.modalErrorMessage = 'Connection name already exists! Please enter different connection name';
      this.modalService.open(errorContent, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
      return;
    }
  }

  for (let p of params) {
    if (this.connectionSelection == 'server') {
      if (p.value.trim() === null || p.value.trim() === "" && p.key !== "Extract Type" &&
        p.key !== "Connection Type" && p.key !== "Path" && p.key !== "Content Url") {
        this.modalErrorMessage = 'Please fill all the required fields!';
        this.modalService.open(errorContent, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
          this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
        return;
      }
    }
  }

  if (this.connectionSelection == 'server') {
    if (this.selectedLevel == '') {
      this.modalErrorMessage = 'Please select the connection type!';
          this.modalService.open(errorContent, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
          }, (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
      return;
    }
  }

  if (this.selectedExtract == '') {
    this.modalErrorMessage = 'Please select the extract type!';
        this.modalService.open(errorContent, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
          this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    return;
  }

 this.projectId=GlobalConstants.globalProjectId;
 let connparams = [];
 if (this.connectionSelection == 'server') {
  for (let p of params) {
    connparams.push({
      'rptConParamType': { 'code': p.code },
      'rptConParamValue': p.key === 'Connection Type' ? this.selectedLevel : p.key === 'Extract Type' ? this.selectedExtract : p.value.trim()
    })
  }
 } else if (this.connectionSelection == 'path') {
  for (let p of params) {
    connparams.push({
      'rptConParamType': { 'code': p.code },
      'rptConParamValue': p.key === 'Path' ? this.serverPath : p.key === 'Extract Type' ? this.selectedExtract : p.value.trim()
    })
  }
 }

 let input = {
   "reportType": {
     "status": {
      "code":"ACT",
      "name":"Active" 
     },
     "code": GlobalConstants.reportTypeConst,
   },
   "name": data.connName.trim(),
   "prjRptConParams": connparams,
   "status": this.connectionSelection == 'server' ? 'not tested' : 'not tested for path'
 }
 console.log(input);
 

 this.connObj.addConnection(this.projectId, input)
   .subscribe(resp => {
     //console.log(resp)
     //this.connParams = [];
     this.getAddedConnections();
     this.hideForm()
   },
     errorCode => console.log("Error in updating project data " + JSON.stringify(errorCode)));

    this.newConnectionForm.reset();
    this.uploadForm.reset();
    this.serverPath = '';
 }

 get f() { return this.newConnectionForm.controls; }

 onSubmit() {

}

getConnectionParams(code:any) {
  //  console.log(this.newConnectionForm.value)
  this.connObj.getConnParams(code)
    .subscribe(resp => {
      let params = [];
      this.connParams = [];
      //  console.log(resp);
      params = resp as string[];

      this.connParams.push({'key': 'Username', 'value': ''});
      this.connParams.push({'key': 'Password', 'value': ''});
      
      for (let p of params) {
      // alert("code:"+p['code']);
        if (p['name'] === 'Username') {
          this.connParams[0].code = p['code'];
        } else if (p['name'] === 'Password') {
          this.connParams[1].code = p['code'];
        } else {
          this.connParams.push({ 'key': p['name'], 'value': '', 'code':p['code'] });
        }
      }
      // this.connParams.sort((a: any,b: any) => (a.key < b.key) ? 1 : ((b.key < a.key) ? -1 : 0));

    },
      errorCode => console.log("Error in updating project data " + JSON.stringify(errorCode)));
}


openDeleteModal(data:any) {
  console.log(data)

  this.hideConfirmation = false;
  this.connIdToBeDeleted = data.id;
  this.connDisplayName = data.name;

  //if(confirm("Are you sure to delete "+this.connDisplayName)) {
   // this.deleteConnection();
 // }

}

deleteConnection() {
  this.connObj.deleteConnection(this.connIdToBeDeleted).subscribe(resp => {
    
    this.getAddedConnections();
    jQuery('#confirmation').modal('hide');

  },
    errorCode => {       
      console.log(errorCode.error);
      this.showDeleteError(errorCode.error); 
    })
}

showDeleteError(message:any){
  this.hideConfirmation = true;
  this.deleteConnError = message;  
}


openEditConnSection(data:any) {
  this.addLocal = false;
  this.showEditConnectionForm = true;
  this.showNewConnectionForm = false;
  this.showConnList = false;
  this.connObj.getConnectionDetails(data.id).subscribe(resp => {
    this.connDetails = resp as String[];
    this.connParamDetails = resp['prjRptConParams'] as String[];
    
    if (this.connDetails.status == 'Success' || this.connDetails.status == 'Fail' || this.connDetails.status == 'not tested') {
      this.connectionSelection = 'server';
    } else {
      this.connectionSelection = 'path';
    }

  })
  console.log(this.connDetails);
 
}

openEditConnModal(data:any) {
  this.connDisplayName = data.name;
  this.editConfirmation = false;
  console.log(data);
  //if(confirm("Are you sure to edit "+this.connDisplayName)) {
 //   this.editConnection();

}


editConnection() {

  if (this.connectionSelection == 'path') {
    this.connDetails['prjRptConParams'] = this.connParamDetails;
    this.connDetails['status'] = 'not tested for path';
  } else if (this.connectionSelection == 'server') {
    for (let p of this.connParamDetails) {
      p.rptConParamValue = p.rptConParamValue.trim();
    }
    this.connDetails['prjRptConParams'] = this.connParamDetails;
    this.connDetails['status'] = 'not tested';
  }

  this.connObj.editConnection(this.projectId, this.connDetails).subscribe(resp => {
    console.log(resp);
    jQuery('#editConfirmation').modal('hide');
    this.showEditConnectionForm = false;
    this.showNewConnectionForm = false;
    this.showConnList = true;
    this.getAddedConnections();

  },
    errorCode => {
      this.editConfirmation = true;
      console.log("Error in updating project data " + JSON.stringify(errorCode));
    });

    this.uploadForm.reset();
}

setConnectionId(e:any,data:any, content:any)
{
 // alert("In change event of radio button"+data.id);
  
  GlobalConstants.globalConnectionName=data.name;
  GlobalConstants.globalConnectionId=data.id;
  if (data.connStatus === 'Success') {
    GlobalConstants.shouldSkipStepForPath = false;
    this.isDisabled = false;
    $('#connNext').prop('disabled', false);
  } 
  else if (data.connStatus === 'Success For Path') {
    GlobalConstants.shouldSkipStepForPath = true;
    this.isDisabled = false;
    $('#connNext').prop('disabled', false);
  }
  else {
    this.isDisabled = true;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  //alert(GlobalConstants.globalConnectionName+" "+GlobalConstants.globalConnectionId)
}

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

  omit_space(val:any)
  {
    var k;
      document.all ? k = val.keyCode : k = val.which;
      return (k != 32);
  }

  getReportFolderStructure() {
    this.connId = GlobalConstants.globalConnectionId;
    this.reportType = GlobalConstants.reportTypeConst;
    console.log(this.connId + '\n');
    this.connObj.getReportFolderStructure(this.connId, this.reportType)
    .subscribe(resp => {
      this.extractReportFolderStructure(resp);
    },
    errorCode => console.log("Error in getting report folder structure " + JSON.stringify(errorCode)));

    this.connObj.getConnectionDetails(this.connId).subscribe(resp => {
      let connParamDetails = resp['prjRptConParams'] as String[];

      for (let param of connParamDetails) {
        if (param['rptConParamType']['name'] == 'Extract Type') {
          GlobalConstants.globalTabExtractType = param['rptConParamValue'];
        }
      }
  
    })

  }
  
  extractReportFolderStructure(data: any) {
    // console.log("data:::" + data);
    this.treeData = {};
    this.treeNodeData = {};
    this.pathAndReportMapData = {};

    for (let ele of data) {
      for (let repDetail of ele.reports) {
        this.pathAndReportMapData[`${repDetail.reportId}`] = ele.path;
      }
    }

    // console.log("path and report map data:::" + this.pathAndReportMapData);
  
    if (this.reportType != 'TABLEAU') {
      for (let ele of data) {
        let arr = [];
        let leaf = "";
        let newObj = {};
        let pathArr = ele.path.split('/');
        
        for (let i=pathArr.length-1; i>=0; i--) {
          
          if (i===pathArr.length-1) {
            let k = pathArr[i-1];
            if (!this.checkKey(this.treeData, `${k}`)) {
              arr.push(pathArr[i]);
              // console.log(arr);
            } else {
              if (pathArr.length === 2) {
                leaf = pathArr[i];
              } else {
                let val = this.checkKey(this.treeData, `${k}`);
                // console.log(val);
                arr = [...val, pathArr[i]];
              }
            }
  
            let nodeKey = pathArr[i];
            let nodeObj = {};
            nodeObj[`${nodeKey}`] = ele.reports;
            this.treeNodeData = {...this.treeNodeData, ...nodeObj};
            
          } else {
            if (i === pathArr.length-2) {
              let key1 = pathArr[i];
              
              if (i === 0) {
                let leafObj = {};
                if (!this.checkKey(this.treeData, `${leaf}`)) {
                  leafObj[`${leaf}`] = [];
                  newObj[`${key1}`] = leafObj;
                  console.log(key1);
                  this.treeData['default'] = {...this.treeData['default'], ...leafObj};
                }
              } else {
                newObj[`${key1}`] = arr;
              }
        
            } else {
              let key1 = pathArr[i+1];
              let key2 = pathArr[i];
              
              if (this.checkKey(this.treeData, `${key2}`)) {
                let val = this.treeData[`${key2}`];
                newObj[`${key2}`] = {...val, ...newObj};
                delete newObj[`${key1}`];
              } else {
                newObj[`${key2}`] = {...newObj};
                delete newObj[`${key1}`];
              }
              
              // console.log(newObj);
              // console.log('\n');
              this.treeData = {...this.treeData, ...newObj};
              delete this.treeData[`${key1}`];
            }
          }
          
          
        }
      }
    } else {
      for (let ele of data) {
        let pathArr = ele.path.split('/');

        // if (pathArr[0] in this.treeData) {
        //   let ll = this.treeData[pathArr[0]];
        //   ll.push(pathArr[1]);
        //   this.treeData[pathArr[0]] = ll;
        // } else {
        //   this.treeData[pathArr[0]] = [pathArr[1]];
        // }
        if (!(pathArr[0] in this.treeData)){
          this.treeData[pathArr[0]] = [];
        }

        if (pathArr[0] in this.treeNodeData) {
          let ll = this.treeNodeData[pathArr[0]];
          ll.push(...ele.reports);
          this.treeNodeData[pathArr[0]] = ll;
        } else {
          this.treeNodeData[pathArr[0]] = [...ele.reports];
        }

      }
    }
    
    console.log(this.treeNodeData);

    // this.treeData = {
    //   // 'public_folders' : {
    //   //   'recast1': ['web1', 'web2']
    //   // },
    //   // 'default': ['Superstore_16404392818470'],
    //   // 'Samples': ['Regional', 'Superstore']
    // }
    // this.treeData = {
    //   'default': [],
    //   'Samples': [],
    //   'Industry': []
    // }
    console.log(this.treeData);

    GlobalConstants.globalTreeData = this.treeData;
    GlobalConstants.globalNodeData = this.treeNodeData;
  
  }
  
  checkKey(obj: any, key: any): any {
    if(key in obj){
        return obj[key];
    }
    else{
        for (let k in obj){
            let t = obj[k]
            if(typeof t === "object" && !Array.isArray(t) && t !== null){
                return this.checkKey(t, key);    
            }
        }
    }
    return false
  }

  //File Handling
  onFileSelect(event: any) {
    this.addLocal = false;
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.uploadForm.get('twbFile').setValue(file);
      let fileName = this.uploadForm.get('twbFile').value.name;
      let length = this.uploadForm.get('twbFile').value.name.length;

      if (fileName.substring(length-4) == '.twb' || fileName.substring(length-4) == '.tds' || fileName.substring(length-4) == '.zip') {
        this.uploadDisabled = false;
      } else {
        this.uploadDisabled = true;
      }
    }
  }

  onFileEditSelect(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.uploadForm.get('twbEditFile').setValue(file);
      let fileName = this.uploadForm.get('twbEditFile').value.name;
      let length = this.uploadForm.get('twbEditFile').value.name.length;

      if (fileName.substring(length-4) == '.twb' || fileName.substring(length-4) == '.tds' || fileName.substring(length-4) == '.zip') {
        this.editUploadDisabled = false;
      } else {
        this.editUploadDisabled = true;
      }
    }
  }

  submitFile(fileErrorContent: any) {
    const formData = new FormData();
    formData.append('file', this.uploadForm.get('twbFile').value);

    let fileName = this.uploadForm.get('twbFile').value.name;
    let length = this.uploadForm.get('twbFile').value.name.length;

    if (fileName.substring(length-4) == '.twb' || fileName.substring(length-4) == '.tds' || fileName.substring(length-4) == '.zip') {
      this.connObj.uploadFile(formData).subscribe(res => {
        if (res != "Failed to upload") {
          this.serverPath = res;
          this.addLocal = true;
          console.log(this.serverPath);
          this.uploadDisabled = true;
        }
      },
      errorCode => console.log("Error in uploading the file" + JSON.stringify(errorCode)));
    } else {
      this.modalService.open(fileErrorContent, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
      this.uploadForm.reset();
      this.uploadDisabled = true;
     return;
    }
    
  }

  submitFileEdit(fileErrorContent: any) {
    const formData = new FormData();
    formData.append('file', this.uploadForm.get('twbEditFile').value);

    console.log(this.uploadForm.get('twbEditFile'));

    let fileName = this.uploadForm.get('twbEditFile').value.name;
    let length = this.uploadForm.get('twbEditFile').value.name.length;

    if (fileName.substring(length-4) == '.twb' || fileName.substring(length-4) == '.tds' || fileName.substring(length-4) == '.zip') {
      this.connObj.uploadFile(formData).subscribe(res => {
        if (res != "Failed to upload") {
          this.serverPath = res;
          this.addLocal = true;
          this.editUploadDisabled = true;
          for (let param of this.connParamDetails) {
            if (param.rptConParamType.name == 'Path') {
              param.rptConParamValue = this.serverPath;
            }
          }

          console.log(this.serverPath);
        }
      },
      errorCode => console.log("Error in uploading the file" + JSON.stringify(errorCode)));
    } else {
      this.modalService.open(fileErrorContent, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
      this.uploadForm.reset();
      this.editUploadDisabled = true;
     return;
    }
    
  }

}
