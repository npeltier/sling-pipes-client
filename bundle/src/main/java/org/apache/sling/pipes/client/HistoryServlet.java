package org.apache.sling.pipes.client;

import org.apache.commons.collections.IteratorUtils;
import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.sling.SlingServlet;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.servlets.SlingSafeMethodsServlet;
import org.apache.sling.commons.json.JSONException;
import org.apache.sling.commons.json.io.JSONWriter;
import org.apache.sling.pipes.Pipe;
import org.apache.sling.pipes.Plumber;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import javax.servlet.ServletException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;


/**
 * write last pipes in the repository under history, assuming that they are sorted in a structure like
 * /etc/pipes/history/2016/06/21/14/Pipe
 */
@SlingServlet(resourceTypes="pipes/client/history", extensions = "json")
public class HistoryServlet extends SlingSafeMethodsServlet {
    Logger logger = LoggerFactory.getLogger(this.getClass());

    private static final short PIPE_MAX = 20;

    private static final Comparator<Resource> RESOURCE_COMPARATOR = new Comparator<Resource>() {
        public int compare(Resource o1, Resource o2) {
            return -1 * o1.getName().compareTo(o2.getName());
        }
    };

    @Reference
    Plumber plumber;

    @Override
    protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response) throws ServletException, IOException {
        try {
            response.setCharacterEncoding("utf-8");
            response.setContentType("application/json");
            ResourceResolver resolver = request.getResourceResolver();
            JSONWriter writer = new JSONWriter(response.getWriter());
            writeHistory(request, writer);
        } catch (Exception e){
            logger.error("unable to retrieve history", e);
            throw new ServletException(e);
        }
    }

    protected void writeHistory(SlingHttpServletRequest request, JSONWriter writer) throws JSONException {
        writer.array();
        for (Resource resource : retrievePipeHistory(request.getResource())){
            logger.debug("adding resource {} to the history", resource.getPath());
            writer.object();
            writer.key("name").value(resource.getName());
            writer.key("path").value(resource.getPath());
            writer.endObject();
        }
        writer.endArray();
    }

    /**
     * retrieves a list of pipes in invert chronological order, with a max of PIPE_MAX elements
     * @param resource
     * @return
     */
    protected List<Resource> retrievePipeHistory(Resource resource) {
        return retrieveResourcePipeHistory(resource);
    }

    private List<Resource> retrieveResourcePipeHistory(Resource resource) {
        List<Resource> history = new ArrayList<Resource>();
        List<Resource> children = IteratorUtils.toList(resource.listChildren());
        //we consider there is only one type of resource at a given level
        boolean inPipes = children.size() > 0 ? isPipe(children.get(0)) : false;
        if(inPipes){
            history.addAll(children);
        }else {
            Collections.sort(children, RESOURCE_COMPARATOR);
            for (Resource child : children) {
                history.addAll(retrieveResourcePipeHistory(child));
            }
        }
        return history;
    }

    /**
     * assert a given resource is a pipe
     * @param resource
     * @return
     */
    protected boolean isPipe(Resource resource){
        Pipe pipe = plumber.getPipe(resource);
        return pipe != null;
    }
}
