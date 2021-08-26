import './App.css'

import React from 'react'
import Axios from "axios"
import Container from 'react-bootstrap/Container'

import Header from '../components/Header'
import CurrencyList from '../components/CurrencyList'
import Loading from '../components/Loading'

import apiPath from '../components/apiPath'


export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            msg: '加载中......',
            currencyList: []
        }
    }

    componentDidMount() {
        Axios.post(apiPath + '/currency/getcurrent').then(
            res => {
                this.setState({
                    loading: false
                });
                this.updateCurrencyList(res.data.data);
            });
    }

    updateCurrencyList(data) {
        let list = [];
        for (var i = 0; i < data.length; i++) {
            let currency = {
                key: i,
                name: data[i].currency,
                buyingRate: data[i].buyingRate,
                cashBuyingRate: data[i].cashBuyingRate,
                sellingRate: data[i].sellingRate,
                cashSellingRate: data[i].cashSellingRate,
                conversionRate: data[i].conversionRate,
                publishDate: data[i].publishTime,
                publishTime: data[i].publishTime
            };
            list.push(currency);
        }
        this.setState({currencyList: list});
    }

    render() {
        return (
            <div className="App">
                <Header/>
                <Loading loading={this.state.loading} msg={'加载中'}/>
                <Container>
                    <CurrencyList currencyList={this.state.currencyList}/>
                </Container>
            </div>
        )
    }
}

