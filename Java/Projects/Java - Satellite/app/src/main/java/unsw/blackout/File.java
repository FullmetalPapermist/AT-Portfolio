package unsw.blackout;

import java.util.List;

import unsw.blackout.Satellite.StandardSatellite;
import unsw.response.models.FileInfoResponse;

public class File {
    private String fileName;
    private String fileContent;
    private static String nullErroMsg = "Cannot have null as file ";
    private boolean isFileComplete = false;
    private int bytesReceived = 0;
    private Entity sender;

    public File(String fileName, String fileContent) throws IllegalArgumentException {
        if (fileName == null || fileContent == null) {
            throw new IllegalArgumentException(nullErroMsg + "name or content");
        }
        checkEmptyName(fileName);
        this.fileName = fileName;
        setFileContent(fileContent);
    }

    public File(File file) {
        this.fileName = file.fileName;
        setFileContent(file.fileContent);
    }

    public Entity getSender() {
        return sender;
    }

    public void setSender(Entity sender) {
        this.sender = sender;
    }

    private void checkEmptyName(String name) throws IllegalArgumentException {
        if (name.length() == 0) {
            throw new IllegalArgumentException("Name cannot be empty");
        }
    }

    public String getfileName() {
        return fileName;
    }

    public String getFileContent() {
        if (isFileComplete()) {
            return fileContent;
        } else {
            return "";
        }
    }

    public int getSize() {
        return fileContent.length();
    }

    public boolean isFileComplete() {
        if (getSize() <= getBytesReceived()) {
            fileComplete();
        }
        return isFileComplete;
    }

    public void fileComplete() {
        setBytesReceived(getSize());
        isFileComplete = true;
    }

    public int getBytesReceived() {
        return bytesReceived;
    }

    public int getSenderUpload(Entity entity, List<Entity> communicableEntities) {
        if (communicableEntities.stream().filter(e -> e.equals(getSender())).findAny().orElse(null) == null) {
            return 0;
        }
        return sender.getUpload(entity);
    }

    public void setBytesReceived(int bytesReceived) {
        this.bytesReceived = bytesReceived;
    }

    public FileInfoResponse getResponse() {
        return new FileInfoResponse(getfileName(), getFileContent(), getSize(), isFileComplete);
    }

    public void notUploading() {
        if (sender instanceof StandardSatellite) {
            StandardSatellite standardSatellite = (StandardSatellite) sender;

            standardSatellite.setIsUploading(false);
        }
    }

    public void setFileContent(String fileContent) {
        this.fileContent = fileContent;
    }
}
