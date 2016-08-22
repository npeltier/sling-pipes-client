package org.apache.sling.pipes.client;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.pipes.ContainerPipe;
import org.apache.sling.api.scripting.SlingBindings;
import org.apache.sling.pipes.BasePipe;
import org.apache.sling.pipes.ContainerPipe;
import org.apache.sling.scripting.sightly.pojo.Use;
import javax.script.Bindings;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

/**
 * use for retrieving a pipe details
 */
public class DetailUse implements Use {

    List<Resource> subpipes;

    boolean isPipe = false;

    @Override
    public void init(Bindings bindings) {
        subpipes = new ArrayList<>();
        Resource resource = ((Resource) bindings.get(SlingBindings.RESOURCE));
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