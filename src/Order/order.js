import React from 'react';
import './order.css';
import {Col, Row, Container} from 'reactstrap';
import _ from 'lodash';
import $ from 'jquery';
import PropTypes from 'prop-types';

const moment = require('moment');


const getAddress = function(address){
  try {
    let addressJson = JSON.parse(address)
    return addressJson.city
  }
  catch (err){
    return "Error"
  }
}

// const getFullAddress = function(address){
//   try {
//     let addressJson = JSON.parse(address)
//     console.log(addressJson)
//   }
//   catch(err) {
//     return "Cannot parse address object"
//   }
// }

const formatTimeStamp = function(timestamp){
  let date = new Date(timestamp)
  try{
    return moment(date).format("Do MMM YYYY, h:mm a")
  }
  catch(err) {
    return "Cannot parser timestamp"
  }
}

const buttonColor = function(status){
  if (["cancelled", "Cancelled", "canceled", "Canceled"].includes(status)) {
    return {color: "#bd1701", status: "Cancelled"}
  }
  else if (["Shipped", "paymentComplete"].includes(status)) {
    return {color: "#35499f", status: status}
  }
  else{
    return {color: "#00a651", status: status}
  }
}



class Order extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      orderData : []
    }

    this.sortDate = this.sortDate.bind(this);
    this.logout = this.logout.bind(this);
  }
  
  logout = function(){
    localStorage.removeItem("user_token")
    localStorage.removeItem("user_name")
    localStorage.removeItem("user_group")

    this.context.router.history.push('/');
  } 
  
  sortDate = function(result){
      let sortedArray = _.orderBy(result, ["updatedAt"], ["desc"]);
  //     (order) =>{
  //       let newDate = new Date(order.updatedAt)
        
  //       return moment(newDate).format("Do MMM YYYY, h:mm a")
  //       debugger
        
  // })
      console.log(sortedArray)
      this.setState({
        orderData: sortedArray
      });
}

  componentWillMount(){
   if (localStorage.getItem('user_token')){
       $.ajax({
         type: "POST",
         url: 'http://18.217.124.196:3000/getSellerOrders',
         dataType: "json",
         headers: {
          "Authorization": localStorage.getItem('user_token'),
          "Content-Type": "application/json"
         },
         data: JSON.stringify({
          "userName": localStorage.getItem('user_name'),
          "user": {
            "sellerName": "orders@thescalelabs.com"
          }
         }),
         success: (response) => {
           this.setState({
            orderData: response.response.orders
           });
         },
         error: (err) => {
          console.log(err);
         }
      });
   }
   else{
    
    this.context.router.history.push('/');
   
   }
  
}

  
  render(){
    if(this.state.orderData.length > 0) {
    return(
      <div>
        <Row>
            <Col md={{size: 3, offset:5}} className="scale-logo">
              <img className="scale-img" src={require("../Login/scale_labs.png")} alt="scale logo"/>
            </Col>
            <Col md={{size: 2, offset: 2}} className="logout-bar">
              <img className="logout-img" src={require("./logout.svg")} alt="logout svg" onClick={this.logout}/>
              <br />
              Logout
            </Col>
          </Row>
        {this.state.orderData.map((ele, index) =>{
          return(
          <Container className="order-number" key= {index}>
            <Row style={{backgroundColor: "#d9dde5"}}>
              <Row style={{width: "100%", paddingLeft: "10px"}}>
                <Col md={{size: 3, offset: 0}} className="light-class">
                  Order Number:
                </Col>
                <Col md={{size: 3, offset: 0}} className="light-class" onClick={() => this.sortDate(this.state.orderData)} >
                  Order Placed: 
                  <img className= "svg-class" src={require("./sort.svg")} alt="sort logo" />
                </Col>
                <Col md={{size: 2, offset: 1}} className="light-class">
                  Ship To:
                </Col>
                <Col md={{size: 2, offset: 1}} className="light-class">
                  MarketPlace:
                </Col>
              </Row>
              
              <Row style={{width: "100%", paddingLeft: "10px"}}>
                <Col md={{size: 3, offset: 0}} className="bold-class">
                  {ele.orderId}
                </Col>
                <Col md={{size: 3, offset: 0}} className="bold-class">
                  {formatTimeStamp(ele.updatedAt)}
                </Col>
                <Col md={{size: 2, offset: 1}} className="bold-class">
                  {getAddress(ele.addressShipping)}
                </Col>
                <Col md={{size: 2, offset: 1}} className="bold-class">
                  {(ele.marketPlace).toUpperCase()}
                </Col>
              </Row>
            </Row>
          
            <Row>
              <Col md={{size: 2, offset: 0}} className="image-column">
                <img className="image-name" src={require("./phone.png")} alt= "phone " />
              </Col>
              <Col md={{size: 7, offset: 1}} className="product-column">
                <Row>
                  <Col md={{size: 1, offset: 0}} className="bold-class">
                    Product
                  </Col>
                  <Col md={{size: 6, offset: 0}} className="product-value text-class light-class">
                    {ele.productName}
                  </Col>
                </Row>
                <Row>
                  <Col md={{size: 1, offset: 0}} className="bold-class">
                    SKU
                  </Col>
                  <Col md={{size: 6, offset: 0}} className="product-value light-class">
                    {ele.sku}
                  </Col>
                </Row>
                <Row>
                  <Col md={{size: 1, offset: 0}} className="bold-class">
                    Price
                  </Col>
                  <Col md={{size: 6, offset: 0}} className="product-value light-class">
                    {ele.price} {ele.currency}
                  </Col>
                </Row>
              </Col>
            <Col md={{size: 2, offset: 0}} className="button-column">
              <Row className = "button-row">
                <button size="lg" className="button-size" color="primary"> Order History </button>
              </Row>
              <Row className = "button-row">
                <button size="lg" className="button-size" style = {{backgroundColor: buttonColor(ele.status).color}} color="primary"> {buttonColor(ele.status).status} </button>
              </Row>
            </Col>
          </Row>
        </Container>
          )
        })}
         
      </div>
      
    )
    }
    else{
      return(
        <div className="windows8">
	        <div className="wBall" id="wBall_1">
		      <div className="wInnerBall"></div>
          </div>
          <div className="wBall" id="wBall_2">
            <div className="wInnerBall"></div>
          </div>
          <div className="wBall" id="wBall_3">
            <div className="wInnerBall"></div>
          </div>
          <div className="wBall" id="wBall_4">
            <div className="wInnerBall"></div>
          </div>
          <div className="wBall" id="wBall_5">
            <div className="wInnerBall"></div>
          </div>
        </div>
      )
    }
  }
}

Order.contextTypes = {
  router: PropTypes.object.isRequired
}

export default Order;