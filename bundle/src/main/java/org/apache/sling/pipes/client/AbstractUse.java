package org.apache.sling.pipes.client;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.api.scripting.SlingBindings;
import org.apache.sling.api.scripting.SlingScriptHelper;
import org.apache.sling.pipes.Pipe;
import org.apache.sling.pipes.Plumber;
import org.apache.sling.scripting.sightly.pojo.Use;

import javax.script.Bindings;

public abstract class AbstractUse implements Use {

    Bindings bindings;

    Resource resource;

    Resource getResource(){
        if (resource == null) {
            Resource wrappingResource = (Resource) bindings.get(SlingBindings.RESOURCE);
            resource = wrappingResource.getResourceResolver().getResource(wrappingResource.getPath());
        }
        return resource;
    }

    ResourceResolver getResourceResolver() {
        return getResource().getResourceResolver();
    }

    SlingScriptHelper getSling() {
        return (SlingScriptHelper)bindings.get(SlingBindings.SLING);
    }

    Plumber getPlumber() {
        return (Plumber)getSling().getService(Plumber.class);
    }

    Pipe getCurrentPipe(){
        return getPlumber().getPipe(getResource());
    }

    public ValueMap getCurrentProperties(){
        return getResource().adaptTo(ValueMap.class);
    }

    @Override
    public void init(Bindings bindings) {
        this.bindings = bindings;
        activate();
    }

    protected abstract void activate();
}