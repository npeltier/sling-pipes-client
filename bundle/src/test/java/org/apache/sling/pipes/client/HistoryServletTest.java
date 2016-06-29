package org.apache.sling.pipes.client;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.pipes.impl.PlumberImpl;
import org.junit.Before;
import org.junit.Test;

import java.util.List;

import static org.apache.sling.pipes.client.PipeClientConstants.HISTORY_ROOT;
import static org.junit.Assert.*;

/**
 * testing history servlet algorithms
 */
public class HistoryServletTest extends AbstractPipeClientTest {

    HistoryServlet servlet;

    @Before
    public void setup() {
        PlumberImpl plumberImpl = new PlumberImpl();
        plumberImpl.activate();
        servlet = new HistoryServlet();
        servlet.plumber = plumberImpl;
        context.load().json("/history.json", HISTORY_ROOT);
    }

    @Test
    public void testRetrievePipeHistory() {
        List<Resource> resources = servlet.retrievePipeHistory(context.resourceResolver());
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
        assertFalse("history node is not a pipe", servlet.isPipe(context.resourceResolver().getResource(HISTORY_ROOT)));
        assertTrue("this node should be a pipe", servlet.isPipe(context.resourceResolver().getResource(HISTORY_ROOT + "/2016/06/23/03/16")));
    }
}