import './App.css'
import React from 'react'
import ReactECharts from 'echarts-for-react';
import Timestamp from '../components/Timestamp'
import Header from '../components/Header'

const intervalMinutes = 30;

class DateView extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            date: this.props.location.state.date,
            rateList: this.props.location.state.rateList,
            minBuying: this.props.location.state.minBuying,
            maxBuying: this.props.location.state.maxBuying,
            kList: [],
            timeList: []
        }
    }

    analyseData() {

        const intervalMs = intervalMinutes * 60 * 1000;
        const dateStart = new Date(this.state.date);

        let rateGroupList = new Array(840 / intervalMinutes);   //rates group by time
        for (let i = 0; i < rateGroupList.length; i++) {
            rateGroupList[i] = [];
        }
        const firstTime = dateStart.getTime() + 60 * 60 * 1000; //UTC点+加90分钟

        let timeIndex = 0; //[9:30-10:00)

        let startTime = firstTime;
        let endTime = startTime + intervalMinutes * 60 * 1000;
        for (let i = 0; i < this.state.rateList.length; i++) {
            if (startTime < this.state.rateList[i].publishTime && this.state.rateList[i].publishTime < endTime) {
                rateGroupList[timeIndex].push(this.state.rateList[i]);
            } else if (this.state.rateList[i].publishTime > endTime) {
                for (let j = timeIndex + 1; j < 840 / intervalMinutes; j++) {
                    if (firstTime + j * intervalMs < this.state.rateList[i].publishTime
                        && this.state.rateList[i].publishTime < firstTime + (j + 1) * intervalMs) {

                        timeIndex = j;
                        startTime = firstTime + timeIndex * intervalMs;
                        endTime = startTime + intervalMs;
                        rateGroupList[timeIndex].push(this.state.rateList[i]);
                        break;
                    }
                }
            }
        }


        let kList = new Array(840 / intervalMinutes);      //k-line data
        for (let i = 0; i < kList.length; i++) {
            kList[i] = [];
        }
        for (let i = 0; i < rateGroupList.length; i++) {
            let len = rateGroupList[i].length;
            if (len > 0) {
                kList[i][0] = rateGroupList[i][0].buyingRate;
                kList[i][1] = rateGroupList[i][len - 1].buyingRate;
                kList[i][2] = rateGroupList[i][0].buyingRate;
                kList[i][3] = rateGroupList[i][0].buyingRate;

                for (let j = 1; j < len; j++) {
                    if (rateGroupList[i][j].buyingRate < kList[i][2]) {
                        kList[i][2] = rateGroupList[i][j].buyingRate;
                    } else if (rateGroupList[i][j].buyingRate > kList[i][3]) {
                        kList[i][3] = rateGroupList[i][j].buyingRate;
                    }
                }
            }
        }
        return kList;
    }

    render() {
        let timeList = [];
        const dateStart = new Date(this.state.date);
        //9:00-24:00，以分钟计
        for (let i = 60; i < 960; i += intervalMinutes) {
            let tm = new Timestamp(dateStart.getTime() + i * 60000);
            timeList.push(tm.time);
        }

        const options = {
            //grid: { top: 8, right: 8, bottom: 24, left: 36 },
            xAxis: {
                data: timeList,
            },
            yAxis: {},
            series: [
                {
                    data: this.analyseData(),
                    type: 'k',
                },
            ],
            tooltip: {
                trigger: 'axis',
            },
            dataZoom: [
                {
                    type: 'inside',//slider表示有滑动块的，inside表示内置的
                    show: true,
                    yAxisIndex: [0],
                    startValue: this.state.minBuying,
                    endValue: this.state.maxBuying
                }
            ],
        };

        return (
            <div className="App">
                <Header/>
                <ReactECharts option={options} style={{height: '640px'}} opts={{renderer: 'svg'}}/>
            </div>
        );
    }

    // componentDidMount() {
    //     let params = new URLSearchParams();
    //     params.append('date', this.state.date);
    //     params.append('currency', this.state.currency)
    //     Axios.post(apiPath + '/currency/getdate', params).then(
    //         res => {
    //             this.setState({
    //                 loading: false
    //             });
    //             this.updateRateList(res.data.data);
    //         });
    // }
    //
    // updateRateList(data) {
    //     let list = [];
    //     let minBuying = 0.0;
    //     let maxBuying = 0.0;
    //     let minSelling = 0.0;
    //     let maxSelling = 0.0;
    //     for (let i = 0; i < data.length; i++) {
    //         let rate = {
    //             key: i,
    //             buyingRate: data[i].buyingRate,
    //             sellingRate: data[i].sellingRate,
    //             publishTime: data[i].publishTime
    //         }
    //         list.push(rate);
    //         if (i === 0 || minBuying > parseFloat(data[i].buyingRate))
    //             minBuying = parseFloat(data[i].buyingRate);
    //         if (i === 0 || minSelling > parseFloat(data[i].sellingRate))
    //             minSelling = parseFloat(data[i].sellingRate);
    //         if (i === 0 || maxBuying < parseFloat(data[i].buyingRate))
    //             maxBuying = parseFloat(data[i].buyingRate);
    //         if (i === 0 || maxSelling < parseFloat(data[i].sellingRate))
    //             maxSelling = parseFloat(data[i].sellingRate);
    //     }
    //     this.setState({
    //         rateList: list,
    //         minBuying: minBuying,
    //         minSelling: minSelling,
    //         maxBuying: maxBuying,
    //         maxSelling: maxSelling
    //     });
    // }

    // dateChange = (event) => {
    //     let date = event.target.value;
    //     if (new Date(date) <= new Date()) {
    //         history.push('/exrate/date/' + this.state.currency + '/' + date);
    //         this.setState({
    //             loading: true
    //         });
    //         let params = new URLSearchParams();
    //         params.append('date', date);
    //         params.append('currency', this.state.currency);
    //         Axios.post(apiPath + '/currency/getdate', params).then(
    //             res => {
    //                 this.setState({
    //                     loading: false
    //                 });
    //                 this.updateRateList(res.data.data);
    //             });
    //
    //     }
    // }
}

export default DateView;
