package cn.sh.argo.bean;

import java.io.Serializable;
import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.Date;

public class CurrencyBean implements Comparable<CurrencyBean>, Serializable {

    public static final String[] CURRENCIES = {
            "美元",
            "欧元",
            "英镑",
            "日元",
            "加拿大元",
            "澳大利亚元",
            "新加坡元",
            "港币",
            "新台币"
    };


    String currency;
    BigDecimal buyingRate;
    BigDecimal cashBuyingRate;
    BigDecimal sellingRate;
    BigDecimal cashSellingRate;
    BigDecimal conversionRate;
    Date publishDate;
    Timestamp publishTime;

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public BigDecimal getBuyingRate() {
        return buyingRate;
    }

    public void setBuyingRate(BigDecimal buyingRate) {
        this.buyingRate = buyingRate;
    }

    public BigDecimal getCashBuyingRate() {
        return cashBuyingRate;
    }

    public void setCashBuyingRate(BigDecimal cashBuyingRate) {
        this.cashBuyingRate = cashBuyingRate;
    }

    public BigDecimal getSellingRate() {
        return sellingRate;
    }

    public void setSellingRate(BigDecimal sellingRate) {
        this.sellingRate = sellingRate;
    }

    public BigDecimal getCashSellingRate() {
        return cashSellingRate;
    }

    public void setCashSellingRate(BigDecimal cashSellingRate) {
        this.cashSellingRate = cashSellingRate;
    }

    public BigDecimal getConversionRate() {
        return conversionRate;
    }

    public void setConversionRate(BigDecimal conversionRate) {
        this.conversionRate = conversionRate;
    }

    public Date getPublishDate() {
        return publishDate;
    }

    public void setPublishDate(Date publishDate) {
        this.publishDate = publishDate;
    }

    public Timestamp getPublishTime() {
        return publishTime;
    }

    public void setPublishTime(Timestamp publishTime) {
        this.publishTime = publishTime;
    }


    @Override
    public int compareTo(CurrencyBean cur1) {
        if (cur1 == null) {
            return -1;//如果传入的是空,  当前小.
        }
        if (cur1.getIndex() < 0) {
            return -1;//如果传入的index空,  当前小.
        }
        if (getIndex() < 0) {
            return 1;
        }

        if (getIndex() == cur1.getIndex()) {
            if (null == getPublishTime()) {
                return -1;
            }
            return getPublishTime().compareTo(cur1.getPublishTime());
        } else if (getIndex() < cur1.getIndex()) {
            return -1;
        } else {
            return 1;
        }

    }

    @Override
    public String toString() {
        return "Currency{" +
                "currency='" + currency + '\'' +
                ", publishDate=" + publishDate +
                ", buyingRate=" + buyingRate +
                ", cashBuyingRate=" + cashBuyingRate +
                ", sellingRate=" + sellingRate +
                ", cashSellingRate=" + cashSellingRate +
                ", conversionRate=" + conversionRate +
                ", publishTime=" + publishTime +
                '}';
    }

    public int getIndex() {
        for (int n = 0; n < CURRENCIES.length; n++) {
            if (CURRENCIES[n].equals(this.currency)) {
                return n;
            }
        }
        return -1;
    }
}
