package org.apache.sling.pipes.client;

import org.apache.sling.api.resource.Resource;

public class HeadUse extends AbstractUse{

    public static final String PN_EXTRAJS = "/etc/sling/pipes-client/extrajs";

    String[] extraJs;

    @Override
    protected void activate() {
        Resource resource = getResourceResolver().getResource(PN_EXTRAJS);
        if (resource != null){
            extraJs = resource.adaptTo(String[].class);
        }
    }

    public String[] getExtraJs() {
        return extraJs;
    }
}
