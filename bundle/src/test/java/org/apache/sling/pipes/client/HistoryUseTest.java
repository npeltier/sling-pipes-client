package org.apache.sling.pipes.client;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.pipes.impl.PlumberImpl;
import org.junit.Before;
import org.junit.Test;

import java.util.List;

import static org.junit.Assert.*;

/**
 * testing history servlet algorithms
 */
public class HistoryUseTest extends AbstractPipeClientTest {

    HistoryUse use;

    public static final String TEST_PATH = "/content/test";

    @Before
    public void setup() {
        PlumberImpl plumberImpl = new PlumberImpl();
        plumberImpl.activate();
        use = new HistoryUse();
        use.plumber = plumberImpl;
        context.load().json("/history.json", TEST_PATH);
    }

    @Test
    public void testRetrievePipeHistory() {
        List<Resource> resources = use.retrievePipeHistory(context.resourceResolver().getResource(TEST_PATH));
        int expectedNumber = 16;
        assertNotNull("returned list should not be null", resources);
        assertEquals ("there should be exactly " + expectedNumber + " elements", expectedNumber, resources.size());
        for (int i = 0; i < expectedNumber; i ++) {
            String expectedName = Integer.toString(expectedNumber - i);
            assertEquals("the " + (i + 1) + "th expected element should be " + expectedName, expectedName, resources.get(i).getName());
        }
    }

    @Test
    public void testIsPipe() {
        assertFalse("history node is not a pipe", use.isPipe(context.resourceResolver().getResource(TEST_PATH)));
        assertTrue("this node should be a pipe", use.isPipe(context.resourceResolver().getResource(TEST_PATH + "/2016/06/23/03/16")));
    }
}