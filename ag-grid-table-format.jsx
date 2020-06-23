'use strict';

import React, { Component } from 'react';
import { render } from 'react-dom';
import { AgGridReact } from '@ag-grid-community/react';
import { AllModules } from '@ag-grid-enterprise/all-modules';
import '@ag-grid-community/all-modules/dist/styles/ag-grid.css';
import '@ag-grid-community/all-modules/dist/styles/ag-theme-alpine.css';

class GridExample extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modules: AllModules,
      columnDefs: [
        {
          headerName: 'Athlete Fields',
          children: [
            {
              headerName: 'When and Where',
              children: [
                {
                  field: 'country',
                  minWidth: 200,
                  rowGroup: true,
                },
                {
                  field: 'year',
                  rowGroup: true,
                },
              ],
            },
            {
              headerName: 'Athlete',
              children: [
                {
                  headerName: 'Name',
                  field: 'athlete',
                  minWidth: 150,
                },
                {
                  headerName: 'Name Length',
                  valueGetter: 'data ? data.athlete.length : ""',
                },
                { field: 'age' },
                {
                  field: 'sport',
                  minWidth: 150,
                  rowGroup: true,
                },
              ],
            },
          ],
        },
        {
          headerName: 'Medal Fields',
          children: [
            {
              field: 'date',
              minWidth: 150,
            },
            {
              headerName: 'Medal Types',
              children: [
                { field: 'silver' },
                { field: 'bronze' },
                { field: 'total' },
              ],
            },
          ],
        },
      ],
      defaultColDef: {
        sortable: true,
        filter: true,
        resizable: true,
        minWidth: 100,
      },
      autoGroupColumnDef: {
        flex: 1,
        minWidth: 250,
      },
      rowSelection: 'multiple',
      pinnedTopRowData: [
        {
          athlete: 'Floating Top Athlete',
          age: 999,
          country: 'Floating Top Country',
          year: 2020,
          date: '01-08-2020',
          sport: 'Floating Top Sport',
          gold: 22,
          silver: 33,
          bronze: 44,
          total: 55,
        },
      ],
      pinnedBottomRowData: [
        {
          athlete: 'Floating Bottom Athlete',
          age: 888,
          country: 'Floating Bottom Country',
          year: 2030,
          date: '01-08-2030',
          sport: 'Floating Bottom Sport',
          gold: 222,
          silver: 233,
          bronze: 244,
          total: 255,
        },
      ],
      rowData: [],
    };
  }

  onGridReady = params => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

    const httpRequest = new XMLHttpRequest();
    const updateData = data => {
      this.setState({ rowData: data });
      params.api.forEachNode(function(node) {
        node.expanded = true;
      });
      params.api.onGroupExpandedOrCollapsed();
    };

    httpRequest.open(
      'GET',
      'https://raw.githubusercontent.com/ag-grid/ag-grid/master/grid-packages/ag-grid-docs/src/olympicWinnersSmall.json'
    );
    httpRequest.send();
    httpRequest.onreadystatechange = () => {
      if (httpRequest.readyState === 4 && httpRequest.status === 200) {
        updateData(JSON.parse(httpRequest.responseText));
      }
    };
  };

  onBtnExportDataAsCsv = () => {
    this.gridApi.exportDataAsCsv(getParams());
  };

  onBtnExportDataAsExcel = () => {
    var params = getParams();
    if (
      typeof params.customHeader === 'string' ||
      typeof params.customFooter === 'string'
    ) {
      alert('Excel does not support strings in customHeader or customFooter');
      return;
    }
    this.gridApi.exportDataAsExcel(params);
  };

  render() {
    return (
      <div style={{ width: '100%', height: '100%' }}>
        <div className="page-wrapper">
          <div className="columns">
            <div className="column">
              <div className="row">
                <label>
                  <input type="checkbox" id="customHeader" /> customHeader ={' '}
                  <em>makeCustomContent()</em>
                </label>
              </div>
              <div className="row">
                <label>
                  <input type="checkbox" id="customFooter" /> customFooter ={' '}
                  <em>makeCustomContent()</em>
                </label>
              </div>
              <div className="row">
                <label>
                  <input type="checkbox" id="fileName" /> fileName ={' '}
                </label>
                <input type="text" id="fileNameValue" value="custom-name" />
              </div>
              <label>
                <input type="checkbox" id="processCellCallback" />{' '}
                processCellCallback =<em>myCellCallback</em>
              </label>
            </div>
            <div className="column" style={{ marginLeft: '20px' }}>
              <label>
                <input type="checkbox" id="processGroupHeaderCallback" />{' '}
                processGroupHeaderCallback =<em>myGroupHeaderCallback</em>
              </label>
              <label>
                <input type="checkbox" id="processHeaderCallback" />{' '}
                processHeaderCallback =<em>myHeaderCallback</em>
              </label>
              <label>
                <input type="checkbox" id="processRowGroupCallback" />{' '}
                processRowGroupCallback =<em>myRowGroupCallback</em>
              </label>
            </div>
          </div>

          <div style={{ margin: '10px 0' }}>
            <button onClick={() => this.onBtnExportDataAsCsv()}>
              api.exportDataAsCsv(params)
            </button>
            <button onClick={() => this.onBtnExportDataAsExcel()}>
              api.exportDataAsExcel(params)
            </button>
          </div>

          <div className="grid-wrapper">
            <div
              id="myGrid"
              style={{
                height: '100%',
                width: '100%',
              }}
              className="ag-theme-alpine"
            >
              <AgGridReact
                modules={this.state.modules}
                columnDefs={this.state.columnDefs}
                defaultColDef={this.state.defaultColDef}
                autoGroupColumnDef={this.state.autoGroupColumnDef}
                rowSelection={this.state.rowSelection}
                pinnedTopRowData={this.state.pinnedTopRowData}
                pinnedBottomRowData={this.state.pinnedBottomRowData}
                onGridReady={this.onGridReady}
                rowData={this.state.rowData}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function getBooleanValue(checkboxSelector) {
  return document.querySelector(checkboxSelector).checked;
}
function getUIValue(checkboxSelector, onWindow) {
  if (!getBooleanValue(checkboxSelector)) {
    return false;
  }
  return document.querySelector(checkboxSelector + 'Value').value;
}
function makeCustomContent() {
  return [
    [],
    [
      {
        data: {
          type: 'String',
          value: 'Summary',
        },
      },
    ],
    [
      {
        data: {
          type: 'String',
          value: 'Sales',
        },
        mergeAcross: 2,
      },
      {
        data: {
          type: 'Number',
          value: '3695.36',
        },
      },
    ],
    [],
  ];
}
function myCellCallback(params) {
  if (params.value && params.value.toUpperCase) {
    return params.value.toUpperCase();
  } else {
    return params.value;
  }
}
function myGroupHeaderCallback(params) {
  var displayName = params.columnApi.getDisplayNameForColumnGroup(
    params.columnGroup
  );
  return displayName.toUpperCase();
}
function myHeaderCallback(params) {
  return params.column.getColDef().headerName.toUpperCase();
}
function myRowGroupCallback(params) {
  var indent = '--';
  var node = params.node;
  var label = node.key.toUpperCase();
  if (!node.parent.parent) {
    return label;
  }
  label = '> ' + label;
  while (node.parent.parent) {
    label = indent + label;
    node = node.parent;
  }
  return label;
}
function getParams() {
  return {
    columnGroups: true,
    customHeader: getBooleanValue('#customHeader') && makeCustomContent(),
    customFooter: getBooleanValue('#customFooter') && makeCustomContent(),
    fileName: getUIValue('#fileName'),
    processCellCallback:
      getBooleanValue('#processCellCallback') && myCellCallback,
    processGroupHeaderCallback:
      getBooleanValue('#processGroupHeaderCallback') && myGroupHeaderCallback,
    processHeaderCallback:
      getBooleanValue('#processHeaderCallback') && myHeaderCallback,
    processRowGroupCallback:
      getBooleanValue('#processRowGroupCallback') && myRowGroupCallback,
  };
}

render(<GridExample></GridExample>, document.querySelector('#root'));
