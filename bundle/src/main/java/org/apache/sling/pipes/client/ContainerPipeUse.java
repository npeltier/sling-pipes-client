package org.apache.sling.pipes.client;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.pipes.ContainerPipe;
import org.apache.sling.pipes.BasePipe;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

/**
 * use for retrieving a pipe details
 */
public class ContainerPipeUse extends AbstractUse {

    List<Resource> subpipes;

    boolean isValidPipe = false;

    @Override
    public void activate() {
        Resource resource = getResource();
        subpipes = new ArrayList<>();
        isValidPipe = resource.isResourceType(ContainerPipe.RESOURCE_TYPE) && resource.getChild("conf") != null;
        if (isValidPipe){
            Resource parent = resource.getChild(BasePipe.NN_CONF);
            for (Iterator<Resource> it = parent.listChildren(); it.hasNext(); ) {
                subpipes.add(it.next());
            }
        }
    }

    public List<Resource> getSubpipes() {
        return subpipes;
    }

    public boolean isValidPipe() {
        return isValidPipe;
    }
}