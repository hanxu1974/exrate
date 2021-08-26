import React from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import ListGroup from 'react-bootstrap/ListGroup'

class RateList extends React.Component {
    render() {
        return <ListGroup>
            <ListGroup.Item variant='dark'>
                <Row>
                    <Col><p>发布时间</p></Col>
                    <Col><p>现汇买入价</p></Col>
                    <Col><p>现汇卖出价</p></Col>
                </Row>
            </ListGroup.Item>
            {this.props.rateList.map((currency, index) =>
                <CurrencyRate key={index}
                              index={index}
                              buyingRate={currency.buyingRate}
                              sellingRate={currency.sellingRate}
                              publishTime={currency.publishTime}
                />)}
        </ListGroup>
    }
}

class CurrencyRate extends React.Component {
    timestamp2Time(timestamp) {
        var date;
        if (timestamp) {
            date = new Date(timestamp);
        } else {
            date = new Date();
        }
        let H = date.getHours();
        let i = date.getMinutes();
        let s = date.getSeconds();
        if (H < 10) {
            H = '0' + H;
        }
        if (i < 10) {
            i = '0' + i;
        }
        if (s < 10) {
            s = '0' + s;
        }
        let t = H + ':' + i + ':' + s;
        return t;
    }

    render() {
        return <ListGroup.Item variant={this.props.index % 2 === 0 ? 'light' : 'secondary'}>
            <Row>
                <Col>{this.timestamp2Time(this.props.publishTime)}</Col>
                <Col>{this.props.buyingRate}</Col>
                <Col>{this.props.sellingRate}</Col>
            </Row>
        </ListGroup.Item>
    }
}

export default RateList;
