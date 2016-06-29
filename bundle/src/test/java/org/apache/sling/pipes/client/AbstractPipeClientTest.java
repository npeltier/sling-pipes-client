package org.apache.sling.pipes.client;

import org.apache.sling.testing.mock.sling.ResourceResolverType;
import org.apache.sling.testing.mock.sling.junit.SlingContext;
import org.junit.Rule;

/**
 * Created by karyu on 28/06/16.
 */
public class AbstractPipeClientTest {
    @Rule
    public SlingContext context = new SlingContext(ResourceResolverType.JCR_MOCK);
}
