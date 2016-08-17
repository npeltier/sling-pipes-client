package org.apache.sling.pipes.client;

import org.apache.sling.api.resource.Resource;
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
        Resource resource = ((Resource) bindings.get("resource"));
        if (resource.isResourceType(ContainerPipe.RESOURCE_TYPE)){
            Resource parent = resource.getChild("conf");
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