import React from 'react'
import ListGroup from 'react-bootstrap/ListGroup'

import Currency from './Currency';

class CurrencyList extends React.Component {
    render() {
        return <ListGroup>
            {this.props.currencyList.map((currency) =>
                <Currency key={currency.name}
                          currencyName={currency.name}
                          buyingRate={currency.buyingRate}
                          cashBuyingRate={currency.cashBuyingRate}
                          sellingRate={currency.sellingRate}
                          cashSellingRate={currency.cashSellingRate}
                          conversionRate={currency.conversionRate}
                          publishDate={currency.publishDate}
                          publishTime={currency.publishTime}
                />)}
        </ListGroup>
    }
}
export default CurrencyList;
