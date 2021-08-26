import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';
import history from './history'; // 如果是history路由
import Timestamp from './Timestamp';

class Currency extends React.Component {
    constructor() {
        super();
        this.state = {
            foreignCurrency: '',
            rmb: ''
        }
    }

    updateForeign = (event) => {
        this.setState({
            foreignCurrency: event.target.value,
        })
        let val = parseFloat(event.target.value);
        if (!isNaN(val)) {
            let rate = parseFloat(this.props.buyingRate);
            if (!isNaN(rate)) {
                let rmbVal = Math.round(val * rate) / 100;
                this.setState({
                    rmb: rmbVal
                })
                return;
            }
        }

        this.setState({
            rmb: ''
        })
    }

    updateRmb = (event) => {
        this.setState({
            rmb: event.target.value
        })
        let val = parseFloat(event.target.value);
        if (!isNaN(val)) {
            let rate = parseFloat(this.props.sellingRate);
            if (!isNaN(rate)) {
                let foreignVal = Math.round(val / rate * 10000) / 100;
                this.setState({
                    foreignCurrency: foreignVal
                })
                return;
            }
        }
        this.setState({
            foreignCurrency: ''
        })
    }

    render() {
        return <div>
            <CurrencyName name={this.props.currencyName}/>
            <ExchangeRate caption='现汇买入价' rate={this.props.buyingRate} background={'gray'}/>
            <ExchangeRate caption='现钞买入价' rate={this.props.cashBuyingRate}/>
            <ExchangeRate caption='现汇卖出价' rate={this.props.sellingRate} background={'gray'}/>
            <ExchangeRate caption='现钞卖出价' rate={this.props.cashSellingRate}/>
            <ExchangeRate caption='中行折算价' rate={this.props.cashSellingRate} background={'gray'}/>
            <PublishTime publishTime={this.props.publishTime} currencyName={this.props.currencyName}/>
            <CurrencyValue currencyName={this.props.currencyName} value={this.state.foreignCurrency}
                           updateValue={this.updateForeign}/>
            <CurrencyValue currencyName={'人民币'} value={this.state.rmb} updateValue={this.updateRmb}
                           background={'gray'}/>
            <ListGroup.Item></ListGroup.Item>
        </div>
    }


}

class CurrencyName extends React.Component {
    render() {
        return <ListGroup.Item><h2>{this.props.name}</h2></ListGroup.Item>
    }
}

class ExchangeRate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rate: this.formatRate(this.props.rate)
        }
    }
    formatRate(rate) {
        try {
            let val = parseFloat(rate);
            if (isNaN(val) || 0.0 === val) {
                return '';
            } else if (val < 10.0) {
                return val.toFixed(4);
            } else {
                return val.toFixed(2);
            }
        } catch
            (err) {
            return '0.00';
        }
    }

    render() {
        return <ListGroup.Item variant={this.props.background === 'gray' ? 'secondary' : 'light'}>
            <Row>
                <Col xs={5}>{this.props.caption}:</Col>
                <Col xs={7}>{this.state.rate}</Col>
            </Row>
        </ListGroup.Item>
    }
}

class PublishTime extends React.Component {
    dateChange = (event) => {
        let date = event.target.value;
        if (new Date(date) <= new Date()) {
            history.push('/exrate/date/' + this.props.currencyName + '/' + date);
        }
    }
    render() {
        let ts = new Timestamp(this.props.publishTime);
        return <div>
            <ListGroup.Item>
                <Row>
                    <Col xs={5}>发布日期:</Col>
                    <Col xs={7}>
                        <Form.Control type="date" defaultValue={ts.date} onChange={this.dateChange}/>
                    </Col>
                </Row>
            </ListGroup.Item>
            <ListGroup.Item variant="secondary">
                <Row>
                    <Col xs={5}>发布时间:</Col>
                    <Col xs={7}>
                        {Timestamp.timestamp2Time(this.props.publishTime)}
                    </Col>
                </Row>
            </ListGroup.Item>
        </div>
    }
}

class CurrencyValue extends React.Component {
    valueChange = (event) => {
        this.props.updateValue(event);
    }

    render() {
        return <ListGroup.Item variant={this.props.background === 'gray' ? 'secondary' : 'light'}>
            <Row>
                <Col xs={5}>
                    {this.props.currencyName}:
                </Col>
                <Col xs={7}>
                    <input className="form-control" type="text" value={this.props.value}
                           onChange={this.valueChange}/>
                </Col>
            </Row>
        </ListGroup.Item>
    }
}

export default Currency;
