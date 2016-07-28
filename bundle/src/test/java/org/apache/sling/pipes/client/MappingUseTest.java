package org.apache.sling.pipes.client;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.commons.json.JSONArray;
import org.apache.sling.commons.json.JSONException;
import org.apache.sling.commons.json.JSONObject;
import org.junit.Before;
import org.junit.Test;

import java.util.List;

import static org.junit.Assert.*;

/**
 * Created by karyu on 16/08/16.
 */
public class MappingUseTest extends AbstractPipeClientTest {

    MappingUse use;

    public static final String TEST_PATH = "/content/test";

    @Before
    public void setup() {
        use = new MappingUse();
        context.load().json("/mapping.json", TEST_PATH);
        use.buildChildren(context.resourceResolver(), TEST_PATH);
    }

    @Test
    public void testJSONDump() throws JSONException {
        JSONObject object = new JSONObject(use.getJsonDump());
        JSONObject slingQuery = object.optJSONObject("$");
        assertNotNull("there should be a $ json object child", slingQuery);
        JSONArray array = slingQuery.optJSONArray("args");
        assertNotNull("args should be a json array", array);
        assertEquals("first slingQuery arg should be path", "path", array.get(0));
    }
}