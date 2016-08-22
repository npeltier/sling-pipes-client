package org.apache.sling.pipes.client;

import org.apache.sling.pipes.Pipe;

public class PipeUse extends AbstractUse{

    Pipe pipe;

    public boolean isValid() {
        return pipe != null;
    }

    public Pipe getPipe(){
        return pipe;
    }

    @Override
    public void activate() {
        pipe = getPlumber().getPipe(getResource());
    }
}