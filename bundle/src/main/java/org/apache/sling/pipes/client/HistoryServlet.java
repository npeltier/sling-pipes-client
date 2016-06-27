package org.apache.sling.pipes.client;

import org.apache.felix.scr.annotations.sling.SlingServlet;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.SlingSafeMethodsServlet;
import org.apache.sling.commons.json.io.JSONWriter;

import javax.servlet.ServletException;
import java.io.IOException;

/**
 * @todo add license & javadoc :-)
 */
@SlingServlet(paths = "/bin/test", extensions = "json")
public class HistoryServlet extends SlingSafeMethodsServlet{
    @Override
    protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response) throws ServletException, IOException {
        try {
            response.setCharacterEncoding("utf-8");
            response.setContentType("application/json");
            JSONWriter writer = new JSONWriter(response.getWriter());
            writer.object().key("hello").value("world").endObject();
        } catch (Exception e){
            throw new ServletException(e);
        }
    }
}
