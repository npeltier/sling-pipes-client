package org.apache.sling.pipes.client;

import org.apache.commons.collections.IteratorUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.commons.json.JSONException;
import org.apache.sling.commons.json.JSONObject;
import org.apache.sling.commons.json.io.JSONRenderer;
import org.apache.sling.scripting.sightly.pojo.Use;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.script.Bindings;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class MappingUse implements Use {
    private static Logger logger = LoggerFactory.getLogger(MappingUse.class);

    private static final String MAPPING_PATH = "/libs/sling/pipes-client/mapping";
    List<Resource> children;

    @Override
    public void init(Bindings bindings) {
        List<Resource> map = new ArrayList<Resource>();
        ResourceResolver resolver = ((ResourceResolver) bindings.get("resolver"));
        Resource parent = resolver.getResource(MAPPING_PATH);
        logger.info("initiating mapping use with resource {}", parent.getPath());
        children = IteratorUtils.toList(parent.listChildren());
        map.addAll(children);
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
                pipeObject.put(entry.getKey(), entry.getValue());
            }
            dump.put(pipe.getName(), pipeObject);
        }
        return dump.toString();
    }
}
