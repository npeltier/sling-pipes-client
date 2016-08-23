package org.apache.sling.pipes.client;

import org.apache.commons.collections.IteratorUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.commons.json.JSONException;
import org.apache.sling.commons.json.JSONObject;
import org.apache.sling.pipes.BasePipe;
import org.apache.sling.pipes.Pipe;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

public class MappingUse extends AbstractUse {

    public static final String PN_TYPE = "pipeType";

    public static final String PN_ARGS = "args";

    private static final String MAPPING_PATH = "/libs/sling/pipes-client/mapping";

    List<Resource> children;

    ValueMap currentMapping;

    @Override
    public void activate() {
        buildChildren(getResourceResolver(), MAPPING_PATH);
    }

    protected void buildChildren(ResourceResolver resolver, String mapPath) {
        Resource parent = resolver.getResource(mapPath);
        children = IteratorUtils.toList(parent.listChildren());
    }

    public List<Resource> getChildren() {
        return children;
    }

    public String getJsonDump() throws JSONException {
        JSONObject dump = new JSONObject();
        for (Resource pipe : getChildren()){
            ValueMap properties = pipe.adaptTo(ValueMap.class);
            JSONObject pipeObject = new JSONObject();
            for (Map.Entry<String, Object> entry : properties.entrySet()){
                if (entry.getValue() instanceof String[]) {
                    pipeObject.put(entry.getKey(), Arrays.asList((String[])entry.getValue()));
                } else {
                    pipeObject.put(entry.getKey(), entry.getValue());
                }
            }
            dump.put(pipe.getName(), pipeObject);
        }
        return dump.toString();
    }

    /**
     * returns mapping corresponding to
     * @return
     */
    public ValueMap getMapping(){
        if (currentMapping != null){
            return currentMapping;
        }
        String resourceType = getResource().getResourceType();
        if (StringUtils.isNotBlank(resourceType)) {
            for (Resource confPipe : getChildren()) {
                ValueMap properties = confPipe.adaptTo(ValueMap.class);
                if (properties.get(PN_TYPE, "").equals(resourceType)){
                    currentMapping = properties;
                    return currentMapping;
                }
            }
        }
        return null;
    }

    public boolean isJsonEditable(){
        return getMapping() != null && getMapping().get(PN_ARGS, "").equals(BasePipe.NN_CONF);
    }
}
