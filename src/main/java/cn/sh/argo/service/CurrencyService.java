package cn.sh.argo.service;

import cn.sh.argo.bean.CurrencyBean;

import java.util.List;
import java.util.Map;

public interface CurrencyService {
    public List<CurrencyBean> queryByDate(Map<String, Object> map);
    public void saveCurrencies(List<CurrencyBean> currencyList);
}
