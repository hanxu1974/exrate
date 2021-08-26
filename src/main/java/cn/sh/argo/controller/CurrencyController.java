package cn.sh.argo.controller;

import cn.sh.argo.bean.CurrencyBean;
import cn.sh.argo.service.CurrencyService;
import cn.sh.argo.service.RedisService;
import cn.sh.argo.utils.GetRatesThread;
import cn.sh.argo.utils.JsoupUtils;
import cn.sh.argo.utils.SaveRatesThread;
import com.alibaba.fastjson.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;


@Controller
public class CurrencyController {

    @Autowired
    private CurrencyService currencyService;

    @Autowired
    private RedisService redisService;

    @CrossOrigin
    @RequestMapping(value = "/currency/getcurrent", produces = "application/json;charset=UTF-8")
    public String getCurrentRates(HttpServletResponse response) {

        JSONObject responseObject = new JSONObject();
        List<CurrencyBean> currencyBeanList = JsoupUtils.getCurrentRates();
        responseObject.put("success", true);
        responseObject.put("status", "200");
        responseObject.put("msg", "成功");
        responseObject.put("data", currencyBeanList);
        try {
            response.getWriter().write(responseObject.toString());
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;

    }

    /**
     * 获取某天的数据。
     * 在Redis和数据库中缓存。
     * <p>
     * //     * @param date
     * //     * @param currency
     * //     * @param model
     *
     * @param response
     * @return
     */
    @CrossOrigin
    @RequestMapping(value = "/currency/getdate", produces = "application/json;charset=UTF-8")
    public @ResponseBody
    String getDateRates(@RequestParam(value = "date") String date,
                        @RequestParam(value = "currency", defaultValue = "美元") String currency,
                        Model model, HttpServletResponse response) {
        long tm = System.currentTimeMillis();
        JSONObject responseObject = new JSONObject();

        responseObject.put("success", true);
        responseObject.put("status", "200");
        responseObject.put("msg", "成功");

        List<CurrencyBean> currencyBeanList = new ArrayList<>();

        GetRatesThread.clearCurrencyList();

        Map<String, Object> map = new HashMap<>();
        map.put("currency", currency);
        map.put("publishDate", date);


        if (!isToday(date) && redisService.hasKey(date)) {
            System.out.println("using redis data....................");
            try {
                List<CurrencyBean> list = (List<CurrencyBean>) redisService.get(date);
                if (list != null && list.size() >= 1) {
                    currencyBeanList.addAll(list);
                }
            } catch (Exception e) {
            }
        } else {

//            List<CurrencyBean> list;
//            try {
//                list = isToday(date) ? null : currencyService.queryByDate(map);
//            } catch (Exception e) {
//                e.printStackTrace();
//                list = null;
//            }
//            //如果找到
//            if (list != null && list.size() >= 1) {
//                currencyBeanList.addAll(list);
//            } else {
            int page = 1;
            Vector<Thread> threadList = new Vector<Thread>();
            int recordCount = JsoupUtils.getRecordCount(currency, date);
            while (page * 20 < recordCount) {
                Thread thread = new GetRatesThread(currency, date, page + 1);
                threadList.add(thread);
                thread.start();
                page++;
                if (page % 5 == 0) {
                    try {
                        Thread.sleep(1000);
                    } catch (Exception e) {
                    }
                }
            }
            for (Thread iThread : threadList) {
                try {
                    // 等待所有线程执行完毕
                    iThread.join();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
            currencyBeanList.addAll(GetRatesThread.getCurrencyList());
            if (currencyBeanList.size() == recordCount) {
                Collections.sort(currencyBeanList);
                Thread thread = new SaveRatesThread(date, currencyBeanList,redisService);
                threadList.add(thread);
                thread.start();
            }
//            }
        }
        System.out.println("finally currencyList.size()=" + currencyBeanList.size() + "; total time =" + (System.currentTimeMillis() - tm));
        responseObject.put("data", currencyBeanList);
        try {
            response.getWriter().write(responseObject.toString());
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }

    private static boolean isToday(final String dateString) {
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
        Date date = null;
        try {
            date = format.parse(dateString);
        } catch (ParseException e) {
            e.printStackTrace();
            return false;
        }
        Calendar calendar = Calendar.getInstance();
        calendar.set(Calendar.SECOND, 0);
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.HOUR_OF_DAY, 0);
        calendar.set(Calendar.MILLISECOND, 0);
        Date today = calendar.getTime();
        return today.compareTo(date) == 0;
//        if (today.compareTo(date) == 0) {
//            System.out.println("date is today");
//            return true;
//        } else {
//            System.out.println("date is not today!!!");
//            return false;
//        }
    }
}
