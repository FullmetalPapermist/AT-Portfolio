package unsw.blackout.Device;

import static unsw.utils.MathsHelper.RADIUS_OF_JUPITER;
import static unsw.utils.MathsHelper.getDistance;
import static unsw.utils.MathsHelper.isVisible;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import unsw.blackout.Entity;
import unsw.blackout.File;
import unsw.blackout.FileTransferException;
import unsw.blackout.Satellite.RelaySatellite;
import unsw.blackout.Satellite.StandardSatellite;
import unsw.utils.Angle;

public abstract class Device implements Entity {
    private String deviceId;
    private Angle position;
    private List<File> files = new ArrayList<File>();
    private static final int UPLOAD = Integer.MAX_VALUE;
    private static final int DOWNLOAD = Integer.MAX_VALUE;
    private static final int BUSY = 0;

    protected Device(String deviceId, Angle position) {
        setDeviceId(deviceId);
        setPosition(position);
    }

    public String getId() {
        return deviceId;
    }

    private void setDeviceId(String deviceId) {
        if (deviceId == null) {
            throw new IllegalArgumentException("Device ID cannot be null");
        }

        if (deviceId.length() == 0) {
            throw new IllegalArgumentException("Device ID cannot be empty");
        }
        this.deviceId = deviceId;
    }

    public double getHeight() {
        return RADIUS_OF_JUPITER;
    }

    public Angle getPosition() {
        return position;
    }

    public void setPosition(Angle position) {
        if (position == null) {
            throw new IllegalArgumentException("Position cannot be null");
        }
        this.position = position;
    }

    public void addFile(File file) {
        File newFile = new File(file);
        newFile.fileComplete();
        System.out.println(newFile.isFileComplete());
        files.add(newFile);
    }

    public void addFile(File file, Entity sender) {
        File newFile = new File(file);
        newFile.setSender(sender);
        files.add(newFile);
    }

    public List<File> getFiles() {
        return new ArrayList<File>(files);
    }

    public File getFile(String fileName, boolean isComplete) {
        if (isComplete) {
            return getFiles().stream().filter(f -> fileName.equals(f.getfileName()) && f.isFileComplete()).findFirst()
                    .orElse(null);

        } else {
            return getFiles().stream().filter(f -> fileName.equals(f.getfileName())).findFirst().orElse(null);

        }
    }

    public void receiveFile(String fileName, Entity sender, List<Entity> communicableEntities)
            throws FileTransferException {
        File file = sender.getFile(fileName, true);
        if (file == null) {
            throw new FileTransferException.VirtualFileNotFoundException(fileName);
        } else if (!canDownload(communicableEntities) || !sender.canUpload()) {
            throw new FileTransferException.VirtualFileNoBandwidthException(fileName);
        } else if (getFile(fileName, false) != null) {
            throw new FileTransferException.VirtualFileAlreadyExistsException(fileName);
        } else {

            addFile(file, sender);
            if (sender instanceof StandardSatellite) {
                StandardSatellite standardSatellite = (StandardSatellite) sender;

                standardSatellite.setIsUploading(true);
            }

        }
    }

    protected abstract double getMaxRange();

    public boolean isInRange(Entity entity) {
        if (entity instanceof Device) {
            return false;
        } else if (!isVisible(entity.getHeight(), entity.getPosition(), getPosition())) {
            return false;
        } else {
            return !(getDistance(entity.getHeight(), entity.getPosition(), getPosition()) > getMaxRange());
        }
    }

    public List<Entity> getEntitiesInRange(List<Entity> entities) {
        List<Entity> inRange = entities.stream().filter((entity) -> isInRange(entity)).collect(Collectors.toList());
        List<Entity> relays = inRange.stream().filter(e -> e instanceof RelaySatellite).collect(Collectors.toList());
        for (Entity r : relays) {
            RelaySatellite relay = (RelaySatellite) r;
            relay.addRelayed(inRange, entities, this);
        }
        return inRange;
    }

    public boolean canDownload(List<Entity> communicableEntities) {
        return communicableEntities.stream().filter(e -> e.equals(this)).findAny().orElse(null) != null;
    }

    public boolean canUpload() {
        return true;
    }

    public int getUpload(Entity receiver) {
        if (isInRange(receiver)) {
            return UPLOAD;

        }
        return BUSY;
    }

    public void setIsUploading(boolean isUploading) {

    }

    public int getDownload() {
        return DOWNLOAD;
    }

    public void simulate(List<Entity> communicableEntities) {
        for (File file : files.stream().filter(f -> !f.isFileComplete()).collect(Collectors.toList())) {
            int download = file.getSenderUpload(this, communicableEntities);
            if (download == 0) {
                files.remove(file);
                file.notUploading();
            } else {
                file.setBytesReceived(file.getBytesReceived() + download);
                if (file.isFileComplete()) {
                    file.notUploading();
                }
            }
        }
    }

}
