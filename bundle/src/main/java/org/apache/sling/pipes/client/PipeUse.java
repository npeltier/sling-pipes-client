package org.apache.sling.pipes.client;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.scripting.SlingBindings;
import org.apache.sling.api.scripting.SlingScriptHelper;
import org.apache.sling.pipes.Pipe;
import org.apache.sling.pipes.Plumber;
import org.apache.sling.scripting.sightly.pojo.Use;

import javax.script.Bindings;

public class PipeUse implements Use{

    Pipe pipe;

    public boolean isValid() {
        return pipe != null;
    }

    public Pipe getPipe(){
        return pipe;
    }

    @Override
    public void init(Bindings bindings) {
        SlingScriptHelper sling = (SlingScriptHelper) bindings.get(SlingBindings.SLING);
        Resource resource = (Resource) bindings.get(SlingBindings.RESOURCE);
        Plumber plumber = (Plumber)sling.getService(Plumber.class);
        pipe = plumber.getPipe(resource);
    }
}
