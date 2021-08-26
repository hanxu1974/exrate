package cn.sh.argo.dao;

import cn.sh.argo.bean.CurrencyBean;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

//CREATE TABLE `currency_rate` (
//        `id` int(11) NOT NULL AUTO_INCREMENT,
//        `currency` varchar(45) COLLATE utf8_unicode_ci DEFAULT NULL,
//        `publish_date` date DEFAULT NULL,
//        `buying_rate` decimal(10,0) DEFAULT NULL,
//        `cash_buying_rate` decimal(10,0) DEFAULT NULL,
//        `selling_rate` decimal(10,0) DEFAULT NULL,
//        `cash_selling_rate` decimal(10,0) DEFAULT NULL,
//        `conversion_rate` decimal(10,0) DEFAULT NULL,
//        `publish_time` timestamp NULL DEFAULT NULL,
//        PRIMARY KEY (`id`),
//        UNIQUE KEY `idx_unique` (`currency`,`publish_time`),
//        KEY `idx_date` (`currency`,`publish_date`)
//        ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

@Repository  //此注解代表这是一个持久层，用法类似@controller、@service
public interface CurrencyDao {
    public List<CurrencyBean> queryByDate(Map<String, Object> map);
    public void saveCurrencies(@Param("list") List<CurrencyBean> currencyList);
}


