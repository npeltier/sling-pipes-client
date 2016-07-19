package org.apache.sling.pipes.client;

import org.apache.commons.collections.IteratorUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.pipes.ContainerPipe;
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
    private static Logger logger = LoggerFactory.getLogger(HistoryUse.class);

    private static final short PIPE_MAX = 20;

    List<Resource> history;

    private static final Comparator<Resource> RESOURCE_COMPARATOR = (o1, o2) -> {
        return -1 * o1.getName().compareTo(o2.getName());
    };

    public List<Resource> getHistory() {
        return history;
    }

    public void init(Bindings bindings) {
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
        return resource.isResourceType(ContainerPipe.RESOURCE_TYPE);
    }
}
