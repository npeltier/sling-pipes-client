package org.apache.sling.pipes.client;

import org.apache.commons.collections.IteratorUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.commons.json.JSONException;
import org.apache.sling.commons.json.JSONObject;
import org.apache.sling.pipes.BasePipe;

import javax.jcr.Node;
import javax.jcr.NodeIterator;
import java.util.Arrays;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

public class MappingUse extends AbstractUse {

    public static final String PN_TYPE = "pipeType";

    public static final String PN_ARGS = "args";

    public static final String PN_FAMILY = "family";

    private static final String MAPPING_PATH = "/libs/sling/pipes-client/subpipe/mapping";

    List<Resource> children;

    Iterator<ValueMap> childrenProperties;

    ValueMap currentMapping;

    @Override
    public void activate() {
        buildChildren(getResourceResolver(), MAPPING_PATH);
    }

    protected void buildChildren(ResourceResolver resolver, String mapPath) {
        Resource parent = resolver.getResource(mapPath);
        children = IteratorUtils.toList(parent.listChildren());
        childrenProperties = IteratorUtils.transformedIterator(parent.listChildren(), o -> ((Resource)o).adaptTo(ValueMap.class));
    }

    public List<Resource> getChildren() {
        return children;
    }

    protected JSONObject buildJSONNode(Resource resource) throws JSONException{
        ValueMap properties = resource.adaptTo(ValueMap.class);
        JSONObject pipeObject = new JSONObject();
        for (Map.Entry<String, Object> entry : properties.entrySet()){
            if (entry.getValue() instanceof String[]) {
                pipeObject.put(entry.getKey(), Arrays.asList((String[])entry.getValue()));
            } else {
                pipeObject.put(entry.getKey(), entry.getValue());
            }
        }
        return pipeObject;
    }

    protected JSONObject buildJSONNodeTree(Resource resource) throws Exception {
        JSONObject dump = buildJSONNode(resource);
        Node node = resource.adaptTo(Node.class);
        for (NodeIterator children = node.getNodes(); children.hasNext();){
            Node child = children.nextNode();
            dump.put(child.getName(), buildJSONNodeTree(resource.getChild(child.getName())));
        }
        return dump;
    }

    public String getPipeTreeDump() throws Exception {
        return buildJSONNodeTree(getResource()).toString();
    }

    public String getJsonDump() throws JSONException {
        JSONObject dump = new JSONObject();
        for (Resource pipe : getChildren()){
            dump.put(pipe.getName(), buildJSONNode(pipe));
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

    public String getFamily(){
        return getMapping().get(PN_FAMILY, "read");
    }

    public boolean isJsonEditable(){
        return getMapping() != null && getMapping().get(PN_ARGS, "").equals(BasePipe.NN_CONF);
    }
}
