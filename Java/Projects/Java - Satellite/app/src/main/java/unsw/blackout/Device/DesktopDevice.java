package unsw.blackout.Device;

import unsw.blackout.Entity;
import unsw.blackout.Satellite.StandardSatellite;
import unsw.utils.*;

public class DesktopDevice extends Device {
    private static final String TYPE = "DesktopDevice";
    private static final double MAX_RANGE = 200_000;

    public DesktopDevice(String deviceId, Angle position) throws IllegalArgumentException {
        super(deviceId, position);
    }

    public String getType() {
        return TYPE;
    }

    protected double getMaxRange() {
        return MAX_RANGE;
    }

    @Override
    public boolean isInRange(Entity entity) {
        if (!super.isInRange(entity)) {
            return false;
        } else {
            return !(entity instanceof StandardSatellite);
        }
    }
}
