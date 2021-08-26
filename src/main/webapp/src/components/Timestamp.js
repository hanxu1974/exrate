class Timestamp {
    constructor(tm) {
        this.tm = tm;
    }

    get timestamp() {
        return this.tm;
    }

    set timestamp(tm) {
        this.tm = tm;
    }

    get date() {
        return Timestamp.timestamp2Date(this.tm);
    }

    get time() {
        return Timestamp.timestamp2Time(this.tm);
    }

    set date(date) {
        let d=new Date(date);
        let dateStart=new Date(d.getFullYear(),d.getMonth(),d.getDate());
        this.tm=dateStart.getTime();
    }

    /**
     * 日期不变，变更时间
     * @param t (时间辍偏移量)
     */
    set time(t) {
        let d=new Date(this.tm);
        let dateStart=new Date(d.getFullYear(),d.getMonth(),d.getDate());
        this.tm=dateStart.getTime()+t;
    }

    addTime(t){
        this.tm+=t;
    }

    static timestamp2Date(timestamp) {
        let date;
        if (timestamp) {
            date = new Date(timestamp);
        } else {
            date = new Date();
        }
        let Y = date.getFullYear(), m = date.getMonth() + 1, d = date.getDate();
        if (m < 10) {
            m = '0' + m;
        }
        if (d < 10) {
            d = '0' + d;
        }
        return Y + '-' + m + '-' + d;
    };

    static timestamp2Time(timestamp) {
        let date;
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

}

export default Timestamp;
