'use strict';

import React, { Component } from 'react';
import { render } from 'react-dom';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-enterprise';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

class GridExample extends Component {
  constructor(props) {
    super(props);

    this.state = {
      columnDefs: [
        {
          headerName: 'As provided',
          field: 'rawValue',
        },
        {
          headerName: 'As boolean',
          field: 'rawValue',
          cellClass: 'booleanType',
        },
        {
          headerName: 'As string',
          field: 'rawValue',
          cellClass: 'stringType',
        },
        {
          headerName: 'Date',
          field: 'dateValue',
          cellClass: 'dateType',
          minWidth: 220,
        },
      ],
      defaultColDef: {
        sortable: true,
        filter: true,
        minWidth: 100,
        resizable: true,
        flex: 1,
      },
      rowSelection: 'multiple',
      rowData: [
        {
          rawValue: 1,
          dateValue: '2009-04-20T00:00:00.000',
        },
      ],
      excelStyles: [
        {
          id: 'booleanType',
          dataType: 'boolean',
        },
        {
          id: 'stringType',
          dataType: 'string',
        },
        {
          id: 'dateType',
          dataType: 'dateTime',
        },
      ],
    };
  }

  onGridReady = params => {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  };

  onBtExport = () => {
    this.gridApi.exportDataAsExcel({});
  };

  render() {
    return (
      <div style={{ width: '100%', height: '100%' }}>
        <div className="example-wrapper">
          <div className="example-header">
            <label>
              <button onClick={() => this.onBtExport()}>Export to Excel</button>
            </label>
          </div>

          <div
            id="myGrid"
            style={{
              height: '100%',
              width: '100%',
            }}
            className="ag-theme-alpine"
          >
            <AgGridReact
              columnDefs={this.state.columnDefs}
              defaultColDef={this.state.defaultColDef}
              rowSelection={this.state.rowSelection}
              rowData={this.state.rowData}
              excelStyles={this.state.excelStyles}
              onGridReady={this.onGridReady}
            />
          </div>
        </div>
      </div>
    );
  }
}

function getBooleanValue(cssSelector) {
  return document.querySelector(cssSelector).checked === true;
}

render(<GridExample></GridExample>, document.querySelector('#root'));
