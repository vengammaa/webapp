import { Component, ElementRef, Injectable, OnInit, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { ConnectionService } from '../services/connection.service';
import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import {SelectionModel} from '@angular/cdk/collections';
import { TreeTableData, TreeTableDataConfig, TreeTableHeaderObject, TreeTableRow, TtDataType, } from 'angular-tree-table';
import { BehaviorSubject } from 'rxjs';
import { GlobalConstants } from '../common/GlobalConstants';

export class TodoItemNode {
  children: TodoItemNode[];
  item: string;
}

/** Flat to-do item node with expandable and level information */
export class TodoItemFlatNode {
  item: string;
  level: number;
  expandable: boolean;
}

let TREE_DATA = {};

let nodeData = {};

@Injectable()
export class ChecklistDatabase {
  dataChange = new BehaviorSubject<TodoItemNode[]>([]);

  connId: string;
  reportType: string;
  treeData: any = {};
  treeNodeData: any = {};
  pathAndReportMapData: any = {};

  get data(): TodoItemNode[] { return this.dataChange.value; }

  constructor(private connObj: ConnectionService) {
    // this.getReportFolderStructure();
    // setTimeout(() => this.initialize(), 10);
  }

  initialize() {
    // Build the tree nodes from Json object. The result is a list of `TodoItemNode` with nested
    //     file node as children.
    TREE_DATA = GlobalConstants.globalTreeData;
    nodeData = GlobalConstants.globalNodeData;
    const data = this.buildFileTree(TREE_DATA, 0);
    // Notify the change.
    this.dataChange.next(data);
  }

  ngOnInit() {

  }
  /**
   * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
   * The return value is the list of `TodoItemNode`.
   */
  buildFileTree(obj: object, level: number): TodoItemNode[] {
    return Object.keys(obj).reduce<TodoItemNode[]>((accumulator, key) => {
      const value = obj[key];
      const node = new TodoItemNode();
      node.item = key;

      if (value != null) {
        if (typeof value === 'object') {
          node.children = this.buildFileTree(value, level + 1);
        } else {
          node.item = value;
        }
      }

      return accumulator.concat(node);
    }, []);
  }

  /** Add an item to to-do list */
  insertItem(parent: TodoItemNode, name: string) {
    if (parent.children) {
      parent.children.push({item: name} as TodoItemNode);
      this.dataChange.next(this.data);
    }
  }

  updateItem(node: TodoItemNode, name: string) {
    node.item = name;
    this.dataChange.next(this.data);
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

    TREE_DATA = this.treeData;
    nodeData = this.treeNodeData;
  
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

}

@Component({
  selector: 'app-establish-connection',
  templateUrl: './establish-connection.component.html',
  styleUrls: ['./establish-connection.component.css'],
  providers: [ChecklistDatabase]
})
export class EstablishConnectionComponent implements OnInit {

  /** Map from flat node to nested node. This helps us finding the nested node to be modified */
  flatNodeMap = new Map<TodoItemFlatNode, TodoItemNode>();

  /** Map from nested node to flattened node. This helps us to keep the same object for selection */
  nestedNodeMap = new Map<TodoItemNode, TodoItemFlatNode>();

  /** A selected parent node to be inserted */
  selectedParent: TodoItemFlatNode | null = null;

  /** The new item's name */
  newItemName = '';

  treeControl: FlatTreeControl<TodoItemFlatNode>;

  treeFlattener: MatTreeFlattener<TodoItemNode, TodoItemFlatNode>;

  dataSource: MatTreeFlatDataSource<TodoItemNode, TodoItemFlatNode>;

  /** The selection for checklist */
  checklistSelection = new SelectionModel<TodoItemFlatNode>(true /* multiple */);

    ////////////// angular tree /////////////////////////////

tableData: TreeTableData = null; //Table Data Holder
tableConfig = new TreeTableDataConfig(); //Table Configuration
tableHeaders: TreeTableHeaderObject[] = []; //Table Headers and Property Binding
ddEnter: any = 0;
ssEnter: any = 0;

subTableData: TreeTableData = null;
subTableConfig = new TreeTableDataConfig();
subTableHeaders: TreeTableHeaderObject[] = [];
subDDEnter: any = 0;
subSSEnter: any = 0;
subNodeData:any = [];
reportIDsArr: any = [];

/////////////////////////////////////////////////////////

isDisabled: boolean = true;

  constructor(private database: ChecklistDatabase) { 

    this.tableConfig = {
      pageSizes: [5, 10, 15, 20],
    };
    this.subTableConfig = {
      pageSizes: [5, 10, 15, 20],
    };

    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel,
      this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<TodoItemFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    database.dataChange.subscribe(data => {
      this.dataSource.data = data;
    });
  }

  ngOnInit(): void {
    // this.clickButton = document.getElementById('establishConn');
    // this.clickButton.click();
    // this.triggerClick();

    // this.populateDummyData([]);
    // this.populateSubTableData([]);

  }

  ngDoCheck(): void {
    if (GlobalConstants.globalFlagReportSel === 0) {
      GlobalConstants.globalFlagReportSel = 1;
      this.reportIDsArr = [];
      this.subNodeData = [];
      // this.database.getReportFolderStructure();
      setTimeout(() => this.database.initialize(), 500);
      this.populateDummyData([]);
      this.populateSubTableData([]);
      this.isDisabled  = true;
    } 
  }

  // moveNext() {
  //   console.log("Hellooo");
  // }

  //@ViewChild('myButton') myButton : ElementRef;
  
  getLevel = (node: TodoItemFlatNode) => node.level;

isExpandable = (node: TodoItemFlatNode) => node.expandable;

getChildren = (node: TodoItemNode): TodoItemNode[] => node.children;

hasChild = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.expandable;

hasNoContent = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.item === '';

/**
   * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
   */
 transformer = (node: TodoItemNode, level: number) => {
  const existingNode = this.nestedNodeMap.get(node);
  const flatNode = existingNode && existingNode.item === node.item
      ? existingNode
      : new TodoItemFlatNode();
  flatNode.item = node.item;
  flatNode.level = level;
  flatNode.expandable = !!node.children;
  this.flatNodeMap.set(flatNode, node);
  this.nestedNodeMap.set(node, flatNode);
  return flatNode;
}

/** Whether all the descendants of the node are selected */
descendantsAllSelected(node: TodoItemFlatNode): boolean {
  const descendants = this.treeControl.getDescendants(node);
  return descendants.every(child => this.checklistSelection.isSelected(child));
}

/** Whether part of the descendants are selected */
descendantsPartiallySelected(node: TodoItemFlatNode): boolean {
  const descendants = this.treeControl.getDescendants(node);
  const result = descendants.some(child => this.checklistSelection.isSelected(child));
  return result && !this.descendantsAllSelected(node);
}

/** Toggle the to-do item selection. Select/deselect all the descendants node */
todoItemSelectionToggle(node: TodoItemFlatNode): void {
  this.checklistSelection.toggle(node);
  const descendants = this.treeControl.getDescendants(node);
  this.checklistSelection.isSelected(node)
    ? this.checklistSelection.select(...descendants)
    : this.checklistSelection.deselect(...descendants);
}

/** Select the category so we can insert the new item. */
addNewItem(node: TodoItemFlatNode) {
  const parentNode = this.flatNodeMap.get(node);
  this.database.insertItem(parentNode!, '');
  this.treeControl.expand(node);
}

/** Save the node to database */
saveNode(node: TodoItemFlatNode, itemValue: string) {
  const nestedNode = this.flatNodeMap.get(node);
  // this.database.updateItem(nestedNode!, itemValue);
  console.log("nestedNode: " + nestedNode);
  console.log("node: " + node);
  console.log("itemValue: " + nestedNode);
}

saveNode1(node: TodoItemFlatNode) {
  const nestedNode = this.flatNodeMap.get(node);
  console.log(node.item);
  let ii = node.item;
  console.log(nodeData[ii]);
  this.populateDummyData(nodeData[ii]);
}

/////////////// angular tree //////////////////////

populateDummyData(arr: any) {
  const data = [];

  if (arr === undefined) {
    this.ddEnter = 0;
    this.ssEnter = 0;
  }
  
  if (this.ddEnter === 0) {
    const row = new TreeTableRow(0 + '', {reportid: '', reportname: '', date: ''}, false, null);
    data.push(row);
    this.ddEnter++;
  } else {
    let i = 0;
    for (let ele of arr) {
      const row = new TreeTableRow(i + '', {reportid: ele.reportId, reportname: ele.reportName, date: ele.date}, false, null);
      data.push(row);
      i++;
    }
  }
  
  this.tableData = new TreeTableData(this.tableConfig);
  this.populateHeaders();
  this.tableData.data = data;
}

populateSubTableData(arr: any) {
  const data = [];

  if (arr === undefined) {
    this.subDDEnter = 0;
    this.subSSEnter = 0;
  }

  if (this.subDDEnter === 0) {
    const row = new TreeTableRow(0 + '', {reportid: '', reportname: ''}, false, null);
    data.push(row);
    this.subDDEnter++;
  } else {
    let i = 0;
    console.log(arr);
    for (let ele of arr) {
      const row = new TreeTableRow(i + '', {reportid: ele.reportid, reportname: ele.reportname}, false, null);
      data.push(row);
      i++;
    }
  }

  this.subTableData = new TreeTableData(this.subTableConfig);
  this.populateSubHeaders();
  this.subTableData.data = data;

}

populateHeaders() {
  this.tableHeaders.splice(0, this.tableHeaders.length);

  let selectAllHeader;

  if (this.ssEnter === 0) {
    selectAllHeader = new TreeTableHeaderObject('Select All', null, null, false, true);
    selectAllHeader.dataType = TtDataType.SELECT;
    this.tableHeaders.push(selectAllHeader);
    this.ssEnter++;
  } else {
    selectAllHeader = new TreeTableHeaderObject('Select All', null, null, true, true);
    selectAllHeader.dataType = TtDataType.SELECT;
    this.tableHeaders.push(selectAllHeader);
  }

  this.tableHeaders.push(new TreeTableHeaderObject('Object ID', 'reportid', null, true));
  this.tableHeaders.push(new TreeTableHeaderObject('Object Name', 'reportname', null, true));
  this.tableHeaders.push(new TreeTableHeaderObject('Date', 'date', null, true));

  // this.tableHeaders.push(new TreeTableHeaderObject('Size', 'size', null, true));
  // this.tableHeaders.push(new TreeTableHeaderObject('Universes', 'universes', null, true));
  // this.tableHeaders.push(new TreeTableHeaderObject('User Details', '=CONCAT(Name: |||name|||<br/>|||Age: |||age)', null, true));
  // this.tableHeaders.push(new TreeTableHeaderObject('D.no', 'address.dno', null, true));
  this.tableData.headers = [];
  this.tableData.headers = this.tableHeaders;
}

populateSubHeaders() {
  this.subTableHeaders.splice(0, this.subTableHeaders.length);

  let selectAllHeader;

  if (this.subSSEnter === 0) {
    selectAllHeader = new TreeTableHeaderObject('Clear All', null, null, false, true);
    selectAllHeader.dataType = TtDataType.SELECT;
    this.subTableHeaders.push(selectAllHeader);
    this.subSSEnter++;
  } else {
    selectAllHeader = new TreeTableHeaderObject('Clear All', null, null, true, true);
    selectAllHeader.dataType = TtDataType.SELECT;
    this.subTableHeaders.push(selectAllHeader);
  }

  this.subTableHeaders.push(new TreeTableHeaderObject('Object ID', 'reportid', null, true));
  this.subTableHeaders.push(new TreeTableHeaderObject('Object Name', 'reportname', null, true));
  // this.subTableHeaders.push(new TreeTableHeaderObject('Path', 'path', null, true));
  // this.subTableHeaders.push(new TreeTableHeaderObject('Universes', 'universes', null, true));

  this.subTableData.headers = [];
  this.subTableData.headers = this.subTableHeaders;
}

rowSelectionChanged(selected: any[]) {
  
  for (let ele of selected) {
    let path = this.database.pathAndReportMapData[`${ele.reportid}`];

    if (typeof this.reportIDsArr !== 'undefined' && this.reportIDsArr.length > 0) {
      if (!this.reportIDsArr.includes(ele.reportid)) {
        this.reportIDsArr.push(ele.reportid);
        this.subNodeData.push({'reportid': ele.reportid, 'reportname': ele.reportname, 'path': path, 'universes': ele.universes });
        this.isDisabled = false;
      }
    } else {
      this.reportIDsArr.push(ele.reportid);
      this.subNodeData.push({'reportid': ele.reportid, 'reportname': ele.reportname, 'path': path, 'universes': ele.universes });
      this.isDisabled = false;
    }

    // console.log(ele);

  }

  GlobalConstants.globalSelectedRptItems = [];
  GlobalConstants.globalSelectedRptItems = [this.subNodeData];
  this.populateSubTableData(this.subNodeData);

}

subRowSelectionChanged(selected: any[]) {
  for (let ele of selected) {
    let index = this.reportIDsArr.indexOf(ele.reportid);
    if (index > -1) {
      this.subNodeData.splice(index, 1);
    }
    this.reportIDsArr = this.arrayRemove(this.reportIDsArr, ele.reportid);

    if (this.reportIDsArr.length === 0) {
      this.isDisabled = true;
    }
    // this.subNodeData = this.arrayRemove(this.subNodeData, ele);
  }
  
  GlobalConstants.globalSelectedRptItems = [];
  GlobalConstants.globalSelectedRptItems = [this.subNodeData];
  this.populateSubTableData(this.subNodeData);
}

arrayRemove(arr: any[], value: any) {
  
  return arr.filter(function(geeks){
      return geeks != value;
  });
 
}

///////////////////////////////////////////////////

setReports() {
  GlobalConstants.globalReportsList = this.subNodeData;
}


}
