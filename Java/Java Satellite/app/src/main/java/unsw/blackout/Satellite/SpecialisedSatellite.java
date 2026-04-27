package unsw.blackout.Satellite;

import java.util.List;

import unsw.blackout.Entity;
import unsw.blackout.File;
import unsw.blackout.FileTransferException;
import unsw.utils.Angle;

public abstract class SpecialisedSatellite extends Satellite {
    protected SpecialisedSatellite(String satelliteId, double height, Angle position) {
        super(satelliteId, height, position);
    }

    public abstract boolean hasStorage(int size);

    public void receiveFile(String fileName, Entity sender, List<Entity> communicableEntities)
            throws FileTransferException {
        File file = sender.getFile(fileName, true);
        if (file == null) {
            throw new FileTransferException.VirtualFileNotFoundException(fileName);
        }
        if (!canDownload(communicableEntities) || !sender.canUpload()) {
            throw new FileTransferException.VirtualFileNoBandwidthException(fileName);
        }
        if (getFile(fileName, false) != null) {
            throw new FileTransferException.VirtualFileAlreadyExistsException(fileName);
        }
        if (!hasStorage(file.getSize())) {
            throw new FileTransferException.VirtualFileNoStorageSpaceException(fileName);
        }
        addFile(file, sender);
        if (sender instanceof StandardSatellite) {
            StandardSatellite standardSatellite = (StandardSatellite) sender;

            standardSatellite.setIsUploading(false);
        }
    }

    public void addFile(File file, Entity sender) {
        File newFile = new File(file);
        newFile.setSender(sender);
        getRealFiles().add(newFile);
    }

    public void removeFile(File file) {
        getRealFiles().remove(file);
    }

}
