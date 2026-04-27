package unsw.blackout.Satellite;

import static unsw.utils.MathsHelper.getDistance;
import static unsw.utils.MathsHelper.isVisible;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import unsw.blackout.Entity;
import unsw.blackout.File;
import unsw.blackout.Device.Device;
import unsw.utils.Angle;
import unsw.utils.AngleHelper;
import unsw.utils.MathsHelper;

public abstract class Satellite implements Entity {
    private String satelliteId;
    private double height;
    private Angle position;
    private List<File> files = new ArrayList<File>();
    private int direction = MathsHelper.CLOCKWISE;

    protected Satellite(String satelliteId, double height, Angle position) {
        setSatelliteId(satelliteId);
        setHeight(height);
        setPosition(position);
    }

    public String getId() {
        return new String(satelliteId);
    }

    private void setSatelliteId(String satelliteId) {
        this.satelliteId = satelliteId;
    }

    public double getHeight() {
        return height;
    }

    private void setHeight(double height) {
        this.height = height;
    }

    public Angle getPosition() {
        return position;
    }

    protected void setPosition(Angle position) {
        position = AngleHelper.standardiseAngle(position);
        this.position = position;
    }

    public abstract double getSpeed();

    protected void setDirection(int direction) {
        this.direction = direction;

    }

    protected int getDirection() {
        return direction;
    }

    public void simulate(List<Entity> communicableEntities) {
        Angle angularDisplacement = Angle.fromRadians(getSpeed() / getHeight() * direction);
        setPosition(getPosition().add(angularDisplacement));
    }

    protected abstract double getMaxRange();

    public boolean isInRange(Entity entity) throws IllegalArgumentException {
        if (entity == this) {
            return false;
        } else if (entity instanceof Satellite) {
            if (getDistance(getHeight(), getPosition(), entity.getHeight(), entity.getPosition()) > getMaxRange()) {
                return false;
            } else {
                return isVisible(getHeight(), getPosition(), entity.getHeight(), entity.getPosition());
            }
        } else if (entity instanceof Device) {
            if (getDistance(getHeight(), getPosition(), entity.getPosition()) > getMaxRange()) {
                return false;
            } else {
                return isVisible(getHeight(), getPosition(), entity.getPosition());

            }
        } else {
            throw new IllegalArgumentException("Unknown entity");
        }
    }

    public List<Entity> getEntitiesInRange(List<Entity> entities) {
        return entities.stream().filter((entity) -> isInRange(entity)).collect(Collectors.toList());
    }

    public List<File> getFiles() {
        return new ArrayList<File>(files);
    }

    protected List<File> getRealFiles() {
        return files;
    }

    public File getFile(String fileName, boolean isComplete) {
        if (isComplete) {
            return getFiles().stream().filter(f -> fileName.equals(f.getfileName()) && f.isFileComplete()).findFirst()
                    .orElse(null);

        } else {
            return getFiles().stream().filter(f -> fileName.equals(f.getfileName())).findFirst().orElse(null);

        }
    }

}
