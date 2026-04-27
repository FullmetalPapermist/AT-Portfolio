package blackout;

import java.util.ArrayList;
import java.util.List;

import unsw.blackout.Entity;
import unsw.blackout.File;
import unsw.blackout.FileTransferException;
import unsw.utils.Angle;

public class FakeEntity implements Entity {
    @Override
    public String getId() {
        return "hello";
    }

    @Override
    public double getHeight() {
        return 0;
    }

    @Override
    public Angle getPosition() {
        return new Angle();
    }

    @Override
    public String getType() {
        return "fake";
    }

    @Override
    public List<File> getFiles() {
        return new ArrayList<>();
    }

    @Override
    public List<Entity> getEntitiesInRange(List<Entity> entities) {
        return new ArrayList<>();
    }

    @Override
    public boolean isInRange(Entity entity) throws IllegalArgumentException {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'isInRange'");
    }

    @Override
    public int getUpload(Entity receiver) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getUpload'");
    }

    @Override
    public int getDownload() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getDownload'");
    }

    @Override
    public boolean canUpload() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'canUpload'");
    }

    @Override
    public File getFile(String fileName, boolean isComplete) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getFile'");
    }

    @Override
    public void receiveFile(String fileName, Entity sender, List<Entity> communicableEntities)
            throws FileTransferException {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'receiveFile'");
    }

    @Override
    public boolean canDownload(List<Entity> communicableEntities) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'canDownload'");
    }

    @Override
    public void simulate(List<Entity> communicableEntities) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'simulate'");
    }

}
