package org.apache.sling.pipes.client;

import org.apache.commons.collections.IteratorUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.scripting.SlingScriptHelper;
import org.apache.sling.pipes.Pipe;
import org.apache.sling.pipes.Plumber;
import org.apache.sling.scripting.sightly.pojo.Use;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.script.Bindings;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

/**
 * use for getting a sorted history of pipes from a tree
 */
public class HistoryUse implements Use {
    Logger logger = LoggerFactory.getLogger(this.getClass());

    private static final short PIPE_MAX = 20;

    List<Resource> history;

    Plumber plumber;

    private static final Comparator<Resource> RESOURCE_COMPARATOR = (o1, o2) -> {
        return -1 * o1.getName().compareTo(o2.getName());
    };

    public List<Resource> getHistory() {
        return history;
    }

    public void init(Bindings bindings) {
        plumber = ((SlingScriptHelper)bindings.get("sling")).getService(Plumber.class);
        history = retrievePipeHistory((Resource)bindings.get("resource"));
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
