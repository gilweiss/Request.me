import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import { FilterButtons } from './filterButtons';
import './app.css';
import axios from 'axios';
import { MDBDataTable } from 'mdbreact';
import paginationFactory from 'react-bootstrap-table2-paginator';

// button type, active, changing state function

export class RequestTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      triger: 'false',
      poolTable: '',
      tableData: ''
    };
  }

  componentDidMount() {
    this.renderReqTable("all");
  }

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props.reload !== prevProps.reload) {
      this.renderReqTable("all");
    }
  }

  getReqPool = async () => {

    var answer = await this.getReqPool2();
    return answer;
  }

  getReqPool2 = () => {

    console.log('asking server for stored requests')
    return new Promise(function (resolve, reject) {
      axios.get('/api/db')
        .then((response) => {
          console.log("response from server: " + response.data);
          resolve(response.data);
        }, (error) => {
          console.log(error);
        });
    });
  }

  //filter is "done","all" or "todo" //
  renderReqTable = async (option) => {
    this.props.load(); 
    var myTable = await this.DatatablePage(option);
    this.setState({ poolTable: myTable })
  }


  DatatablePage = async (option) => {

    var rows
    if (option == "all") {
      const tRows = await this.getReqPool();
      rows = tRows.results;
      this.addKey(rows);
      this.setState({ tableData: rows });
    }
    if (option == "todo") {
      rows = this.state.tableData.filter(request => !request.done)
    }
    if (option == "done") {
      rows = this.state.tableData.filter(request => request.done)
    }
    this.addKey(rows);

    var columns = [{
      dataField: 'id',
      text: 'ID',
      sort: true,
      isKey: true

    }, {
      dataField: 'request',
      text: 'Request',
      headerStyle: (colum, colIndex) => {
        return { width: '2000px', textAlign: 'center' };
      },
      formatter: (status, row) => {
        return (
          <div >
            <span>
              {rows[row.key].done && (
                <s>{status} </s>
              )}

              {!rows[row.key].done && (
                <span>{status}</span>
              )}
            </span>
          </div>
        )
      }

    }, {
      dataField: 'owner',
      text: 'Owner',
      sort: true
    }, {
      dataField: 'date',
      text: 'Date'
    }
    ];


    console.log(rows);
    const CaptionElement = () => <h3 style={{ textAlign: 'center', color: 'black' }}>Request Pool</h3>;
    this.props.loaded(option); 

    const customTotal = (from, to, size) => (
      <span className="react-bootstrap-table-pagination-total">
        &nbsp;&nbsp;Showing requests { from} to { to} out of { size}
      </span>
    );

    var rowClasses = row => (rows[row.key].done ? "doneReq"
      : "undoneReq");

    const options = {
      paginationSize: 4,
      pageStartIndex: 0,
      // alwaysShowAllBtns: true, // Always show next and previous button
      // withFirstAndLast: false, // Hide the going to First and Last page button
      // hideSizePerPage: true, // Hide the sizePerPage dropdown always
      // hidePageListOnlyOnePage: true, // Hide the pagination list when only one page
      firstPageText: 'First',
      prePageText: 'Back',
      nextPageText: 'Next',
      lastPageText: 'Last',
      nextPageTitle: 'First page',
      prePageTitle: 'Pre page',
      firstPageTitle: 'Next page',
      lastPageTitle: 'Last page',
      paginationTotalRenderer: customTotal,
      showTotal: true,
      disablePageTitle: true,
      sizePerPageList: [{
        text: '20 per page', value: 40
      }, {
        text: '50 per page', value: 80
      }, {
        text: 'Show all', value: rows.length
      }] // A numeric array is also available. the purpose of above example is custom the text
    };
    return (

      <BootstrapTable
        bootstrap4
        keyField="id"
        data={rows}
        columns={columns}
        condensed
        //pagination={ paginationFactory(options) } //when pagination will be needed
        caption={<CaptionElement />}
        rowClasses={rowClasses}
      />
    );
  }


  addKey = (obj) => {
    var i;
    for (i = 0; i < obj.length; i++) {
      obj[i].key = i;

    }
  }


  render() {
    return (

      <div className='reqTable'>
        <FilterButtons renderfunction={this.renderReqTable} />
        <br/>
        {this.state.poolTable}
      </div>
    )
  }
}