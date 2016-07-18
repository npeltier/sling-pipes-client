package org.apache.sling.pipes.client;

import org.apache.commons.collections.IteratorUtils;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.scripting.sightly.pojo.Use;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.script.Bindings;
import java.util.ArrayList;
import java.util.List;

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
}
