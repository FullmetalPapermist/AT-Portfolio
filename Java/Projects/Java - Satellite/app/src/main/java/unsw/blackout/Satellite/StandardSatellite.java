package unsw.blackout.Satellite;

import java.util.List;

import unsw.blackout.Entity;
import unsw.blackout.File;
import unsw.blackout.Device.DesktopDevice;
import unsw.utils.Angle;

public class StandardSatellite extends SpecialisedSatellite {
    private static final double SPEED = 2500;
    private static final int MAX_FILES = 3;
    private static final int STORAGE = 80;
    private static final String TYPE = "StandardSatellite";
    private static final double MAX_RANGE = 150_000;
    private static final int UPLOAD = 1;
    private static final int DOWNLOAD = 1;
    private boolean isUploading = false;
    private boolean isDownloading = false;

    public StandardSatellite(String satelliteId, double height, Angle position) {
        super(satelliteId, height, position);
    }

    public int getUpload(Entity receiver) {
        return UPLOAD;
    }

    public void setIsUploading(boolean isUploading) {
        this.isUploading = isUploading;
    }

    public boolean canUpload() {
        return !isUploading;
    }

    public boolean canDownload(List<Entity> communicableEntities) {
        return !isDownloading
                && communicableEntities.stream().filter(e -> e.equals(this)).findAny().orElse(null) != null;
    }

    public int getDownload() {
        return DOWNLOAD;
    }

    public double getSpeed() {
        return SPEED;
    }

    public String getType() {
        return TYPE;
    }

    protected double getMaxRange() {
        return MAX_RANGE;
    }

    public boolean isInRange(Entity entity) throws IllegalArgumentException {
        if (!super.isInRange(entity)) {
            return false;
        } else {
            return !(entity instanceof DesktopDevice);
        }
    }

    public boolean hasStorage(int size) {
        if (getFiles().stream().mapToInt(f -> f.getSize()).sum() + size > STORAGE) {
            return false;
        }
        if (getFiles().size() >= MAX_FILES) {
            return false;
        }
        return true;
    }

    @Override
    public void simulate(List<Entity> communicableEntities) {
        super.simulate(communicableEntities);
        if (isDownloading) {
            File file = getRealFiles().stream().filter(f -> !f.isFileComplete()).findFirst().orElse(null);
            int download = Math.min(getDownload(), file.getSenderUpload(this, communicableEntities));

            if (download == 0) {
                getRealFiles().remove(file);
                isDownloading = false;
            } else {
                file.setBytesReceived(file.getBytesReceived() + download);
                if (file.isFileComplete()) {
                    isDownloading = false;
                }
            }
        }

    }

    @Override
    public void addFile(File file, Entity sender) {
        super.addFile(file, sender);
        isDownloading = true;
    }

}
