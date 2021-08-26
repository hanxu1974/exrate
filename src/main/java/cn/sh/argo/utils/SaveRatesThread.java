package cn.sh.argo.utils;

import cn.sh.argo.bean.CurrencyBean;
import cn.sh.argo.service.RedisService;
import org.springframework.beans.factory.annotation.Autowired;
import cn.sh.argo.service.RedisService;

import java.util.ArrayList;
import java.util.List;

public class SaveRatesThread extends Thread {

    private List<CurrencyBean> currencyBeanList = new ArrayList<>();
    private String date;

    private RedisService redisService;


    public SaveRatesThread(String date, List<CurrencyBean> currencyList, RedisService redisService) {
        this.currencyBeanList = currencyList;
        this.date = date;
        this.redisService = redisService;
    }

    @Override
    public void run() {
        synchronized (currencyBeanList) {
            //            currencyService.saveCurrencies(currencyBeanList);
            redisService.set(date, currencyBeanList);
        }
    }
}
