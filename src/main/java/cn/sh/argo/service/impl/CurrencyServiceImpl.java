package cn.sh.argo.service.impl;

import cn.sh.argo.bean.CurrencyBean;
import cn.sh.argo.dao.CurrencyDao;
import cn.sh.argo.service.CurrencyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service("currencyService")
public class CurrencyServiceImpl implements CurrencyService {
    @Autowired
    private CurrencyDao iCurrencyDao;

    @Override
    public List<CurrencyBean> queryByDate(Map<String, Object> map) {
        return iCurrencyDao.queryByDate(map);
    }

    @Override
    public void saveCurrencies(List<CurrencyBean> currencyList) {
        iCurrencyDao.saveCurrencies(currencyList);
    }

}
