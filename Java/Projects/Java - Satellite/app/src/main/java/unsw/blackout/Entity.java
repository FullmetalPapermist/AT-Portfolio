package unsw.blackout;

import java.util.List;
import unsw.utils.Angle;

public interface Entity {
    public String getId();

    public double getHeight();

    public Angle getPosition();

    public String getType();

    public List<File> getFiles();

    public List<Entity> getEntitiesInRange(List<Entity> entities);

    public File getFile(String fileName, boolean isComplete);

    public void receiveFile(String fileName, Entity sender, List<Entity> communicableEntities)
            throws FileTransferException;

    public int getUpload(Entity receiver);

    public int getDownload();

    public boolean canUpload();

    public boolean canDownload(List<Entity> communicableEntities);

    public void simulate(List<Entity> communicableEntities);

    public boolean isInRange(Entity entity) throws IllegalArgumentException;
}
