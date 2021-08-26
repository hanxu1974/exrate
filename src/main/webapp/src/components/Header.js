import React from 'react'

class Header extends React.Component {
    render() {
        return <header style={{textAlign: 'center'}}>
            <a href="/exrate" style={{textDecoration: 'none', color: 'black'}}>
                <h2 style={{marginTop: '1em',marginBottom: '5px'}}> 汇率计算器</h2>
            </a>
            <a href="/exrate" style={{textDecoration: 'none', color: 'black'}}>
                <h5>(使用中国银行即时外汇牌价)</h5>
            </a>
            <p>作者: 韩宇骋 韩宇翔</p>
            <p style={{marginBottom: '2em'}}>上海市新北郊初级中学初一年级 </p>
        </header>
    }
}

export default Header;
