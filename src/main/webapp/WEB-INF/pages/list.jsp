
<%@ page contentType="text/html;charset=UTF-8" language="java" isELIgnored="false" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<html>
<head>
    <title>Title</title>
</head>
<body>
<h2>查询所有的账户</h2>
<c:forEach items="${list}" var="currencyBean">
    ${currencyBean.currency}
    ${currencyBean.sellingRate}
    ${currencyBean.cashSellingRate}
    ${currencyBean.buyingRate}
    ${currencyBean.cashBuyingRate}
    ${currencyBean.conversionRate}
    ${currencyBean.publishTime}
</c:forEach>
</body>
</html>
