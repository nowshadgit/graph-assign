import React from 'react'
import Chart from 'chart.js'
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import './DashBoard.scss'
import DropDown from '../Components/DropDown/DropDown'
import {ACTIONS} from '../apiConfig/actions.constants'
import dummy from '../images/img1.jpg'
import * as Zoom from 'chartjs-plugin-zoom'

class DashBoard extends React.Component {
    FROM = "FROM"
    TO = "TO"
    constructor(props){
        super(props);
        this.state = {
            showProducts:3,
            [this.FROM]:0,
            [this.TO]:0
        }
        this.chartRef = React.createRef();
    }

    createChart=(labels, data)=>{

        new Chart(this.chartRef.current, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: '',
                    borderColor: "blue",
                    fill:false,
                    data: data,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scaleShowLabels: false,
                legend:false,
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero:true,
                            fontSize: 16,
                            fontColor: 'rgba(0,0,0,1)',
                            min: 0,
                            max: 100,
                            callback: function(value) {
                                return '';
                            },
                            
                        },
                        gridLines: {
                            display:false,
                        },
                        scaleLabel: {
                            display: true,
                            labelString: "Engagement %"
                        }
                    }],
                    xAxes: [{
                        ticks: {
                            beginAtZero:true
                        },
                        gridLines: {
                            borderDash: [8, 4],
                            color: "#348632",
                        }
                    }]
                },
                plugins: {
                    zoom: {
                        zoom: {
                            enabled: true,
                            mode: 'xy',
                        }
                    }
                }
            }   
        });
    }
    
    filterGraphData=(from, to, graphData)=>{
        const labels = []
        const data = []
        for(let each of graphData){
            const year = each.year.split('-')[0]
            if((!from && !to) || (from <= year && to >= year)){
                labels.push(each.year)
                data.push(each.engagement)
            }
        }
        return {labels, data}
    }

    componentDidUpdate(prevProps, prevState){
        const {dashBoardStore} = this.props
        const {graphData} = dashBoardStore
        
        if((prevProps.dashBoardStore.graphData.length !== graphData.length) ||
            (prevState[this.FROM].value != this.state[this.FROM].value 
            || prevState[this.TO].value != this.state[this.TO].value)
            ){
            const {labels, data} = this.filterGraphData(this.state[this.FROM].value, this.state[this.TO].value, graphData)
            this.createChart(labels, data)
        }
    }

    componentDidMount(){
        const {getProducts, getGraphData, getYears} = this.props
        getProducts()
        getGraphData()
        getYears()
    }

    showMoreImg =(e)=>{
        e.preventDefault()
        this.setState({showProducts:this.state.showProducts+3})
    }

    handleDropDownChange =(value, id)=>{

        if(id=== this.FROM && ((this.state[this.TO].value
            && value.value <= this.state[this.TO].value) || !this.state[this.FROM])
        ){
            this.setState({[id]:value})
        }

        if(this.TO === id && this.state[this.FROM].value
            && value.value >= this.state[this.FROM].value){
                this.setState({[id]:value})
        }
        
    }

    render(){
        const {showProducts} = this.state
        const {dashBoardStore} = this.props
        const { products, years } = dashBoardStore
        const productsEle =  products && products.length ? 
        products.slice(0,showProducts)
        .map((each, idx)=>{
        return (
                
            <div className="col-xs-12 col-sm-12 col-md-4 col-lg-3 ml-xs-0 ml-3 mb-3" key={idx.toString()}>
                <div className="card">
                    <div className="card-body">
                        <span className="pro-head">{each.name}</span>
                        <img src={dummy} alt={"..Loading"} className="img-target"/>
                        <span className="pro-price mt-3 float-right " >{each.c_type} {each.price}</span>
                    </div>
                </div>
            </div>
        )
    })  : <div>No Data found</div>

        return (
            <div className="container-fluid">
                <div className="mt-5 card offset-md-2 col-md-8 col-sm-12">
                    <div className="row p-3 card-body">
                        <div className="col-xm-12 col-sm-5 col-md-5 col-lg-3 mb-2">
                            <DropDown 
                            value={this.state[this.FROM]} 
                            id={this.FROM} 
                            prefix={"From"} 
                            options={years} 
                            handleChange={this.handleDropDownChange}
                            /> 
                        </div>
                        <div className="col-xm-12 col-sm-5 col-md-5 col-lg-3">
                            <DropDown 
                            value={this.state[this.TO]} 
                            id={this.TO} 
                            prefix={"To"} 
                            options={years}
                            handleChange={this.handleDropDownChange}
                            /> 
                        </div>
                        <div className="col-sm-12 col-md-12 mt-3">
                            <div className="card">
                                <div className="card-body ">
                                    <div className="graph">
                                        <canvas ref={this.chartRef} height="250" width="700" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row m-2 mt-5 ">
                    <div className="row offset-md-2 offset-lg-2">
                        {productsEle}
                    </div>
                    {products && (showProducts < products.length) && <div className="col-1 offset-9">
                        <a className="more-link" onClick={this.showMoreImg}>...more</a>
                    </div>}
                </div>
            </div>
        )
    }

}


DashBoard.propTypes = {
    dashBoardStore: PropTypes.object.isRequired
};
  
const mapStateToProps = state => ({
    dashBoardStore: state.dashBoardReducerStore,
});

const mapDispatchToProps = dispatch => {
    return {
        getGraphData: () => {
            dispatch({type: ACTIONS.DASHBOARD.GET_GRAPH_DATA });
        },
        getProducts: () => {
            dispatch({type: ACTIONS.DASHBOARD.GET_PRODUCTS });
        },
        getYears: () => {
            dispatch({type: ACTIONS.DASHBOARD.GET_YEARS });
        }
    };
};

export default withRouter(
connect(
    mapStateToProps,
    mapDispatchToProps
)(DashBoard)
);