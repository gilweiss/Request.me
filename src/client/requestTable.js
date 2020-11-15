import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import { FilterButtons } from './filterButtons';
import './app.css';
import axios from 'axios';
import { MDBDataTable } from 'mdbreact';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { CommentModal } from './commentsModal';
import LikeComponent from './likeComponent';
import { connect } from 'react-redux'
import { getUserLikesFromServer } from './serverUtils';
import { getReqPool3 } from './serverUtils';
import { RequestTableTemp } from './temp_before_refactor/requestTableTemp';

//the class that screams for refactoring the most


export class ConnectedRequestTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      triger: true,
      poolTable: null,
      tableData: null,
      filter: 'todo',
      userLikes: null,
      isLogin: false,
      likedComments: [],
    };
    this.incLikeSumInReqTableData = this.incLikeSumInReqTableData.bind(this);
  }




  


  componentDidMount() {
    this.refreshReqTable("todo");
   
  }

  async componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props.reload !== prevProps.reload) {
     
      this.refreshReqTable("same");
      
    }
    // this is patchwork instead of refactoring to hooks, i`m gonna check if user is logged in and download its data from server

    if (!this.state.isLogin && (this.props.user.id !== 0)) {
      
      this.setState({ isLogin: true });
      // let likedComments = await this.getUserLikedComments(this.props.user.id);
      // this.setState({ likedComments: likedComments })
      // setTimeout(()=> console.log("refresh");}, 2000);
      this.setState({poolTable : ""})
      this.refreshReqTable("same");
      
      

    }
    if (this.props.user.id === 0 && this.state.isLogin) {

      this.setState({ isLogin: false });

      this.setState({ likedComments: {} });
      this.setState({ isLogin: false });
      this.setState({poolTable : ""});
      this.refreshReqTable("same");
      

    }

  }

  getUserLikedComments = async (userId) => {

    return new Promise(async function (resolve, reject) {
      var answer = "";
      try {
        answer = await getUserLikesFromServer(userId);
        resolve(answer);
      }
      catch{
        console.log("no likes or error");
      }
      resolve({});
    })
  }


  getReqPool = async () => {

    var answer = await this.getReqPool2();
   var test = await getReqPool3();
    console.log("new indexed data: " + test)
    return answer;
  }

  getReqPool2 = () => {

    console.log('asking server for stored requests')
    return new Promise(function (resolve, reject) {
      axios.get('/api/db')
        .then((response) => {
          resolve(response.data);
        }, (error) => {
          console.log(error);
        });
    });
  }

  refreshReqTable = async (option) => {
    let optionVar = option;

    this.setState({ likedComments: await this.getUserLikedComments(this.props.user.id) });
    if (option === 'same') { optionVar = this.state.filter };
    this.props.load();
    var myTable = await this.DatatablePage("all");
    if (optionVar != "all") {
      var myTable = await this.DatatablePage(optionVar);
    }
    
    this.setState({ poolTable: myTable });
  }

  //filter is "done","all", "todo" or "same"//
  renderReqTable = async (option) => {
    this.setState({ filter: option });
    this.setState({ likedComments: await this.getUserLikedComments(this.props.user.id) });
    this.props.load();
    var myTable = await this.DatatablePage(option);
    this.setState({ poolTable: myTable });
  }

  incLikeSumInReqTableData = (id, inc) => {
  let newTableData = this.state.tableData;
  newTableData[id-1].like_sum = newTableData[id-1].like_sum +inc;
  this.setState ({tableData : newTableData});
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
          <div className="oppsing-sides">
            <span>
              {rows[row.key].done && (
                <s>{status} </s>
              )}

              {!rows[row.key].done && (
                <span>{status}</span>
              )}
            </span>
            <span className="bulk">
              <LikeComponent likeSum={row.like_sum} liked={row.id in this.state.likedComments} commentId={row.id} incCallback = {this.incLikeSumInReqTableData} />
              {row.comment_sum > 0 && (<div className="bulk2"> {row.comment_sum}  </div>)}
              <CommentModal id={row.id} refreshReqTable={this.refreshReqTable} />
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
    //const CaptionElement = () => <br/> ;
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
        //caption={<CaptionElement />}
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
        <h3 style={{ textAlign: 'center', color: 'black' }}> <u>Request Pool  </u> </h3>
        <br />

        <FilterButtons renderfunction={this.renderReqTable} />
        <br />
        
        {this.state.poolTable}

        <br/><br/>
        <RequestTableTemp></RequestTableTemp>

      </div>
    )
  }
}

const mapStateToProps = state => {
  return { user: state.user }
}

const RequestTable = connect(
  mapStateToProps
)(ConnectedRequestTable);

export default RequestTable;