package cn.sh.argo.utils;

import cn.sh.argo.bean.CurrencyBean;
import org.jsoup.Connection;
import org.jsoup.Jsoup;
import org.jsoup.nodes.DataNode;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class JsoupUtils {

    private static Pattern pattern = Pattern.compile("var\\s+m_nRecordCount\\s*=\\s*[0-9]+\\s*;");
    public static List<CurrencyBean> getCurrentRates() {
        final String url = "https://www.boc.cn/sourcedb/whpj/";
        List<CurrencyBean> result = new ArrayList<>();
        Connection conn = Jsoup.connect(url)
                .ignoreContentType(true)
                .ignoreHttpErrors(true)
                .header("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9")
                .header("Accept-Encoding", "gzip, deflate")
                .header("Accept-Language", "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6")
                .header("Cache-Control", "max-age=0")
                .header("Connection", "keep-alive")
                .header("Host", url)
                .header("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.96 Safari/537.36 Edg/88.0.705.56");
        Element htmlBody;
        try {
            htmlBody = conn.execute().parse().body();
        } catch (Exception e) {
            return result;
        }
        Elements publishDivList = htmlBody.getElementsByClass("publish");

        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy.MM.dd hh:mm:ss");
        for (Element publishDiv : publishDivList) {
            Elements tableList = publishDiv.getElementsByTag("table");
            if (null != tableList && tableList.size() > 1) {
                Element table = tableList.get(1);
                Elements trList = table.getElementsByTag("tr");
                if (null != trList && trList.size() > 0) {
                    for (int i = 1; i < trList.size(); i++) {
                        Elements tdList = trList.get(i).getElementsByTag("td");
                        if (tdList.size() >= 7) {
                            String currencyName = tdList.get(0).html();
                            CurrencyBean currencyBean = new CurrencyBean();
                            currencyBean.setCurrency(currencyName);
                            //只考虑列表中
                            BigDecimal temp;
                            try {
                                temp = new BigDecimal(tdList.get(1).html());
                            } catch (Exception e) {
                                temp = new BigDecimal("0.0");
                            }
                            currencyBean.setBuyingRate(temp);
                            try {
                                temp = new BigDecimal(tdList.get(2).html());
                            } catch (Exception e) {
                                temp = new BigDecimal("0.0");
                            }
                            currencyBean.setCashBuyingRate(temp);
                            try {
                                temp = new BigDecimal(tdList.get(3).html());
                            } catch (Exception e) {
                                temp = new BigDecimal("0.0");
                            }
                            currencyBean.setSellingRate(temp);
                            try {
                                temp = new BigDecimal(tdList.get(4).html());
                            } catch (Exception e) {
                                temp = new BigDecimal("0.0");
                            }
                            currencyBean.setCashSellingRate(temp);
                            try {
                                temp = new BigDecimal(tdList.get(5).html());
                            } catch (Exception e) {
                                temp = new BigDecimal("0.0");
                            }
                            currencyBean.setConversionRate(temp);
                            try {
                                Date dateTime = simpleDateFormat.parse(tdList.get(6).html());
                                currencyBean.setPublishTime(new Timestamp(dateTime.getTime()));
                            } catch (ParseException e) {

                            }
                            result.add(currencyBean);
                        }
                    }
                }
            }
            break;
        }
        Collections.sort(result);
        return result;
    }

    public static int getRecordCount(String currentCurrency, String date) {
        final String url = "https://srh.bankofchina.com/search/whpj/search_cn.jsp";
        long tm = System.currentTimeMillis();
        List<CurrencyBean> currencyBeanList = new ArrayList<>();
        Connection conn = Jsoup.connect(url)
                .ignoreContentType(true)
                .ignoreHttpErrors(true)
                .header("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9")
                .header("Accept-Encoding", "gzip, deflate")
                .header("Accept-Language", "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6")
                .header("Cache-Control", "max-age=0")
                .header("Connection", "keep-alive")
                .header("Host", url)
                .header("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.96 Safari/537.36 Edg/88.0.705.56");
        conn.data("erectDate", date);
        conn.data("nothing", date);
        conn.data("pjname", currentCurrency);
        conn.data("page", "1");
        Element htmlBody;
        try {
            htmlBody = conn.post().body();
        } catch (Exception e) {
            return 0;
        }
        Elements scriptTags = htmlBody.getElementsByTag("script");
        for (Element tag : scriptTags) {
            for (DataNode node : tag.dataNodes()) {
                Matcher matcher = pattern.matcher(node.getWholeData());
                while (matcher.find()) {
                    try {
                        String val = matcher.group().replaceAll("var\\s+m_nRecordCount\\s*=\\s*", "").replaceAll(";", "");
                        int count = Integer.parseInt(val);
                        if (count > 0) {
                            Elements publishDivList = htmlBody.getElementsByClass("publish");
                            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
                            SimpleDateFormat stf = new SimpleDateFormat("yyyy.MM.dd hh:mm:ss");
                            for (Element publishDiv : publishDivList) {
                                Elements tableList = publishDiv.getElementsByTag("table");
                                if (null != tableList && tableList.size() > 0) {
                                    Element table = tableList.get(0);
                                    Elements trList = table.getElementsByTag("tr");
                                    if (null != trList && trList.size() > 0) {
                                        for (int i = 1; i < trList.size(); i++) {
                                            Elements tdList = trList.get(i).getElementsByTag("td");
                                            if (tdList.size() >= 7) {
                                                CurrencyBean currencyBean = new CurrencyBean();
                                                currencyBean.setCurrency(tdList.get(0).html());
                                                //只考虑列表中
                                                BigDecimal temp;
                                                try {
                                                    temp = new BigDecimal(tdList.get(1).html());
                                                } catch (Exception e) {
                                                    temp = new BigDecimal("0.0");
                                                }
                                                currencyBean.setBuyingRate(temp);
                                                try {
                                                    temp = new BigDecimal(tdList.get(2).html());
                                                } catch (Exception e) {
                                                    temp = new BigDecimal("0.0");
                                                }
                                                currencyBean.setCashBuyingRate(temp);
                                                try {
                                                    temp = new BigDecimal(tdList.get(3).html());
                                                } catch (Exception e) {
                                                    temp = new BigDecimal("0.0");
                                                }
                                                currencyBean.setSellingRate(temp);
                                                try {
                                                    temp = new BigDecimal(tdList.get(4).html());
                                                } catch (Exception e) {
                                                    temp = new BigDecimal("0.0");
                                                }
                                                currencyBean.setCashSellingRate(temp);
                                                try {
                                                    temp = new BigDecimal(tdList.get(5).html());
                                                } catch (Exception e) {
                                                    temp = new BigDecimal("0.0");
                                                }
                                                currencyBean.setConversionRate(temp);
                                                try {
                                                    Date dateTime = stf.parse(tdList.get(6).html());
                                                    currencyBean.setPublishTime(new Timestamp(dateTime.getTime()));
                                                } catch (ParseException e) {
                                                    e.printStackTrace();
                                                }
                                                try {
                                                    currencyBean.setPublishDate(sdf.parse(date));
                                                } catch (ParseException e) {
                                                    e.printStackTrace();
                                                }

                                                currencyBeanList.add(currencyBean);
                                            }
                                        }
                                    }
                                }
                                break;
                            }
                        }
                        GetRatesThread.addCurrencies(currencyBeanList);
                        System.out.println("parsed record_count=" + count);
                        System.out.println("page=1; list_size=" + GetRatesThread.getCurrnecyCount() + "; time=" + (System.currentTimeMillis() - tm));
                        return count;
                    } catch (Exception e) {
                    }

                }
            }
        }
        return 0;
    }
}
