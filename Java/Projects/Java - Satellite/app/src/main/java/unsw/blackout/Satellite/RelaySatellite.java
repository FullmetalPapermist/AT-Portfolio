package unsw.blackout.Satellite;

import java.util.List;

import unsw.blackout.Entity;
import unsw.blackout.Device.DesktopDevice;
import unsw.blackout.Device.Device;
import unsw.utils.Angle;
import unsw.utils.MathsHelper;

public class RelaySatellite extends Satellite {
    private static final double SPEED = 1500;
    private static final String TYPE = "RelaySatellite";
    private static final Angle UPPER_LIMIT = Angle.fromRadians(Math.PI * 19 / 18);
    private static final Angle LOWER_LIMIT = Angle.fromRadians(Math.PI * 7 / 9);
    private static final Angle MIDPOINT = Angle.fromDegrees(345);
    private static final double MAX_RANGE = 300_000;

    public RelaySatellite(String satelliteId, double height, Angle position) {
        super(satelliteId, height, position);
        if (getPosition().compareTo(LOWER_LIMIT) < 1) {
            setDirection(MathsHelper.ANTI_CLOCKWISE);
        }
        if (getPosition().compareTo(MIDPOINT) > 0) {
            setDirection(MathsHelper.ANTI_CLOCKWISE);
        }
    }

    public double getSpeed() {
        return SPEED;
    }

    public String getType() {
        return TYPE;
    }

    @Override
    public void simulate(List<Entity> communicableEntities) {
        super.simulate(communicableEntities);
        if (getPosition().compareTo(LOWER_LIMIT) < 1) {
            setDirection(MathsHelper.ANTI_CLOCKWISE);
        }
        if (getPosition().compareTo(UPPER_LIMIT) > -1) {
            setDirection(MathsHelper.CLOCKWISE);
        }
    }

    protected double getMaxRange() {
        return MAX_RANGE;
    }

    public void receiveFile(String fileName, Entity sender, List<Entity> communicableEntities) {
        throw new IllegalCallerException("Relay cannot cannot receive files");
    }

    public int getUpload(Entity receiver) {
        return Integer.MAX_VALUE;
    }

    public int getDownload() {
        return Integer.MAX_VALUE;
    }

    public boolean canUpload() {
        return false;
    }

    public boolean canDownload(List<Entity> communicableEntities) {
        return false;
    }

    public void addRelayed(List<Entity> inRange, List<Entity> entities, Entity entity) {
        List<Entity> relayed = getEntitiesInRange(entities);
        relayed.removeAll(inRange);
        for (Entity e : relayed) {
            if (e instanceof DesktopDevice && entity instanceof StandardSatellite) {
                continue;
            }
            if (entity instanceof DesktopDevice && e instanceof StandardSatellite) {
                continue;
            }
            if (e instanceof Device && entity instanceof Device) {
                continue;
            }
            inRange.add(e);
            if (e instanceof RelaySatellite) {
                RelaySatellite relay = (RelaySatellite) entity;
                relay.addRelayed(inRange, entities, entity);
            }

        }

    }

}
