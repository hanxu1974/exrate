import './App.css'

import React from 'react'
import Axios from "axios"
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'

import Header from '../components/Header'
import Loading from '../components/Loading'
import RateList from '../components/RateList'

import apiPath from '../components/apiPath'
import history from '../components/history'


class DatePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            msg: '加载中......',
            rateList: [],
            minBuying: 0.0,
            maxBuying: 0.0,
            minSelling: 0.0,
            maxSelling: 0.0,
            date: this.props.match.params.date,
            currency: this.props.match.params.currency
        }
    }

    render() {
        return (
            <div className="App">
                <Header/>
                <Loading loading={this.state.loading} msg={'加载中'}/>
                <Container>
                    <Row>
                        <Col xs={8}>
                            <Form.Control type="date" defaultValue={this.state.date} onChange={this.dateChange}/>
                        </Col>
                        <Col xs={4}>
                            <Button onClick={this.showDateView}>K线图</Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col></Col>
                        <Col>现汇买入价</Col>
                        <Col>现汇卖出价</Col>
                    </Row>
                    <Row>
                        <Col>最低：</Col>
                        <Col>{this.state.minBuying}</Col>
                        <Col>{this.state.minSelling}</Col>
                    </Row>
                    <Row style={{marginBottom: '1em'}}>
                        <Col>最高：</Col>
                        <Col>{this.state.maxBuying}</Col>
                        <Col>{this.state.maxSelling}</Col>
                    </Row>
                    <RateList rateList={this.state.rateList}/>
                </Container>
            </div>
        );
    }

    componentDidMount() {
        let params = new URLSearchParams();
        params.append('date', this.state.date);
        params.append('currency', this.state.currency)
        Axios.post(apiPath + '/currency/getdate', params).then(
            res => {
                this.setState({
                    loading: false
                });
                this.updateRateList(res.data.data);
            });
    }

    updateRateList(data) {
        let list = [];
        let minBuying = 0.0;
        let maxBuying = 0.0;
        let minSelling = 0.0;
        let maxSelling = 0.0;
        for (let i = 0; i < data.length; i++) {
            let rate = {
                key: i,
                buyingRate: data[i].buyingRate,
                sellingRate: data[i].sellingRate,
                publishTime: data[i].publishTime
            }
            list.push(rate);
            if (i === 0 || minBuying > parseFloat(data[i].buyingRate))
                minBuying = parseFloat(data[i].buyingRate);
            if (i === 0 || minSelling > parseFloat(data[i].sellingRate))
                minSelling = parseFloat(data[i].sellingRate);
            if (i === 0 || maxBuying < parseFloat(data[i].buyingRate))
                maxBuying = parseFloat(data[i].buyingRate);
            if (i === 0 || maxSelling < parseFloat(data[i].sellingRate))
                maxSelling = parseFloat(data[i].sellingRate);
        }
        this.setState({
            rateList: list,
            minBuying: minBuying,
            minSelling: minSelling,
            maxBuying: maxBuying,
            maxSelling: maxSelling
        });
    }

    dateChange = (event) => {
        let date = event.target.value;
        if (new Date(date) <= new Date()) {
            history.push('/exrate/date/' + this.state.currency + '/' + date);
            this.setState({
                loading: true
            });
            let params = new URLSearchParams();
            params.append('date', date);
            params.append('currency', this.state.currency);
            Axios.post(apiPath + '/currency/getdate', params).then(
                res => {
                    this.setState({
                        loading: false
                    });
                    this.updateRateList(res.data.data);
                });

        }
    }

    showDateView = () => {
        // history.push('/exrate/dateview' + this.state.currency + '/' + this.state.date);
        history.push(
            {
                pathname: '/exrate/dateview',
                state: {
                    date: this.state.date,
                    rateList: this.state.rateList,
                    minBuying: this.state.minBuying,
                    maxBuying: this.state.maxBuying
                }
            });
    }
}

export default DatePage;
