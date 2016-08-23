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
public class DetailUse extends AbstractUse {

    List<Resource> subpipes;

    boolean isPipe = false;

    @Override
    public void activate() {
        Resource resource = getResource();
        subpipes = new ArrayList<>();
        isPipe = resource.isResourceType(ContainerPipe.RESOURCE_TYPE);
        if (isPipe){
            Resource parent = resource.getChild(BasePipe.NN_CONF);
            for (Iterator<Resource> it = parent.listChildren(); it.hasNext(); ) {
                subpipes.add(it.next());
            }
        }
    }

    public List<Resource> getSubpipes() {
        return subpipes;
    }

    public boolean isPipe() {
        return isPipe;
    }
}