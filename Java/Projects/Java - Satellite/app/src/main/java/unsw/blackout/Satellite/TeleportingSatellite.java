package unsw.blackout.Satellite;

import static unsw.utils.MathsHelper.ANTI_CLOCKWISE;
import static unsw.utils.MathsHelper.CLOCKWISE;

import java.util.ArrayList;
import java.util.List;
import unsw.blackout.Entity;

import unsw.blackout.File;
import unsw.blackout.Device.Device;
import unsw.utils.Angle;

public class TeleportingSatellite extends SpecialisedSatellite {
    private static final double SPEED = 1000;
    private static final Angle TELEPORT_POINT = Angle.fromDegrees(180);
    private static final int STORAGE = 200;
    private static final String TYPE = "TeleportingSatellite";
    private static final double MAX_RANGE = 200_000;
    private static final int UPLOAD = 10;
    private static final int DOWNLOAD = 15;
    private List<File> uploading = new ArrayList<File>();

    private List<File> downloading = new ArrayList<File>();

    public TeleportingSatellite(String satelliteId, double height, Angle position) {
        super(satelliteId, height, position);
        setDirection(ANTI_CLOCKWISE);
        if (position.compareTo(Angle.fromDegrees(180)) == 0) {
            teleport();
        }
    }

    private static void teleportFile(File file) {
        file.fileComplete();
        String newContent = file.getFileContent().substring(0, file.getBytesReceived() - 1);
        String ts = file.getFileContent().substring(file.getBytesReceived());
        newContent = newContent + ts.replace("t", ts) + file.getFileContent().replace("t", "");
        file.setFileContent(newContent);
    }

    private void teleport() {
        setPosition(Angle.fromDegrees(0));
        if (getDirection() == CLOCKWISE) {
            setDirection(ANTI_CLOCKWISE);
        } else {
            setDirection(CLOCKWISE);
        }

        for (File download : downloading) {
            if (download.getSender() instanceof Device) {
                removeFile(download);
                downloading.remove(download);
            } else {
                teleportFile(download);
            }
        }
        uploading.stream().forEach(TeleportingSatellite::teleportFile);

    }

    public double getSpeed() {
        return SPEED;
    }

    public String getType() {
        return TYPE;
    }

    private void downloadFile(File file) {
        file.setBytesReceived(getDownload() + file.getBytesReceived());
        if (file.isFileComplete()) {
            downloading.remove(file);
        }
    }

    @Override
    public void simulate(List<Entity> communicableEntities) {
        Angle prevAngle = getPosition();
        super.simulate(communicableEntities);
        if (prevAngle.compareTo(Angle.fromDegrees(90)) == getPosition().compareTo(Angle.fromDegrees(90))) {
            if (prevAngle.compareTo(TELEPORT_POINT) != getPosition().compareTo(TELEPORT_POINT)) {
                teleport();
            }

        }
        for (File file : getRealFiles()) {
            if (communicableEntities.stream().filter(e -> e.equals(file.getSender())).findAny().orElse(null) == null) {
                downloadFile(file);
            } else {
                getRealFiles().remove(file);
                downloading.remove(file);
            }
        }
    }

    protected double getMaxRange() {
        return MAX_RANGE;
    }

    public boolean hasStorage(int size) {
        return !(getFiles().stream().mapToInt(f -> f.getSize()).sum() + size > STORAGE);

    }

    public int getUpload(Entity receiver) {
        return UPLOAD;
    }

    public int getDownload() {
        return DOWNLOAD / downloading.size();
    }

    public boolean canUpload() {
        return uploading.size() < UPLOAD;
    }

    public boolean canDownload(List<Entity> communicableEntities) {
        return downloading.size() < DOWNLOAD;
    }

    public void setIsUploading(boolean isUploading, File file) {
        if (isUploading) {
            uploading.add(file);

        } else {
            uploading.remove(file);
        }
    }

    public void setisDownloading(boolean isDownloading, File file) {
        if (isDownloading) {
            downloading.add(file);

        } else {
            downloading.remove(file);
        }
    }

}
