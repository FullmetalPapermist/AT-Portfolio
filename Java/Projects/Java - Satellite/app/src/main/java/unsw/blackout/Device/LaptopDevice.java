package unsw.blackout.Device;

import unsw.utils.*;

public class LaptopDevice extends Device {
    private static final String TYPE = "LaptopDevice";
    private static final double MAX_RANGE = 100_000;

    public LaptopDevice(String deviceId, Angle position) throws IllegalArgumentException {
        super(deviceId, position);
    }

    @Override
    public String getType() {
        return TYPE;
    }

    protected double getMaxRange() {
        return MAX_RANGE;
    }

}
