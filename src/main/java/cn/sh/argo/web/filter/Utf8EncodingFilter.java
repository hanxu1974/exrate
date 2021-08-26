package cn.sh.argo.web.filter;

import javax.servlet.*;
import javax.servlet.annotation.WebFilter;
import java.io.IOException;

/**
 * Servlet Filter implementation class Utf8EncodingFilter
 */
@WebFilter("/*")
public class Utf8EncodingFilter implements Filter {

    /**
     * Default constructor.
     */
    public Utf8EncodingFilter() {
    }

	/**
	 * @see Filter#destroy()
	 */
	@Override
	public void destroy() {
	}

	/**
	 * @see Filter#doFilter(ServletRequest, ServletResponse, FilterChain)
	 */
	@Override
	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
		request.setCharacterEncoding("utf-8");
//		response.setContentType("application/json;charset=UTF-8");
		response.setCharacterEncoding("utf-8");
		chain.doFilter(request, response);
	}

	/**
	 * @see Filter#init(FilterConfig)
	 */
	@Override
	public void init(FilterConfig fConfig) throws ServletException {
	}

}
