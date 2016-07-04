package org.apache.sling.pipes.client;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.scripting.sightly.pojo.Use;

import javax.script.Bindings;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

/**
 * use for retrieving a pipe details
 */
public class DetailUse implements Use {

    List<ValueMap> subpipes;

    @Override
    public void init(Bindings bindings) {
        subpipes = new ArrayList<>();
        Resource parent = ((Resource)bindings.get("resource")).getChild("conf");
        for (Iterator<Resource> it = parent.listChildren(); it.hasNext(); ){
            subpipes.add(it.next().adaptTo(ValueMap.class));
        }
    }

    public List<ValueMap> getSubpipes() {
        return subpipes;
    }
}
