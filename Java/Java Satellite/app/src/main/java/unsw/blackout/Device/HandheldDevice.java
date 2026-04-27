package unsw.blackout.Device;

import unsw.utils.*;

public class HandheldDevice extends Device {
    private static final String TYPE = "HandheldDevice";
    private static final double MAX_RANGE = 50_000;

    public HandheldDevice(String deviceId, Angle position) throws IllegalArgumentException {
        super(deviceId, position);
    }

    public String getType() {
        return TYPE;
    }

    protected double getMaxRange() {
        return MAX_RANGE;
    }

}
