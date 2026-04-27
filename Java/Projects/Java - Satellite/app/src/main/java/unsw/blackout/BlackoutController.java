package unsw.blackout;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import unsw.blackout.Device.DesktopDevice;
import unsw.blackout.Device.Device;
import unsw.blackout.Device.HandheldDevice;
import unsw.blackout.Device.LaptopDevice;
import unsw.blackout.Satellite.RelaySatellite;
import unsw.blackout.Satellite.Satellite;
import unsw.blackout.Satellite.StandardSatellite;
import unsw.blackout.Satellite.TeleportingSatellite;
import unsw.response.models.EntityInfoResponse;
import unsw.response.models.FileInfoResponse;
import unsw.utils.Angle;

/**
 * The controller for the Blackout system.
 *
 * WARNING: Do not move this file or modify any of the existing method
 * signatures
 */
public class BlackoutController {
    private List<Device> devices = new ArrayList<Device>();
    private List<Satellite> satellites = new ArrayList<Satellite>();

    public void createDevice(String deviceId, String type, Angle position) {
        if (type.equals("LaptopDevice")) {
            devices.add(new LaptopDevice(deviceId, position));
        } else if (type.equals("HandheldDevice")) {
            devices.add(new HandheldDevice(deviceId, position));
        } else if (type.equals("DesktopDevice")) {
            devices.add(new DesktopDevice(deviceId, position));
        } else {
            throw new IllegalArgumentException("Illegal type");
        }
    }

    private Device getDeviceByName(String deviceId) {
        return devices.stream().filter(d -> deviceId.equals(d.getId())).findAny().orElse(null);

    }

    public void removeDevice(String deviceId) {
        devices.remove(getDeviceByName(deviceId));
    }

    public void createSatellite(String satelliteId, String type, double height, Angle position) {
        if (type.equals("StandardSatellite")) {
            satellites.add(new StandardSatellite(satelliteId, height, position));
        } else if (type.equals("TeleportingSatellite")) {
            satellites.add(new TeleportingSatellite(satelliteId, height, position));
        } else if (type.equals("RelaySatellite")) {
            satellites.add(new RelaySatellite(satelliteId, height, position));
        } else {
            throw new IllegalArgumentException("Illegal type");
        }
    }

    private Satellite getSatelliteByName(String satelliteId) {
        return satellites.stream().filter(s -> satelliteId.equals(s.getId())).findAny().orElse(null);

    }

    public void removeSatellite(String satelliteId) {
        satellites.remove(getSatelliteByName(satelliteId));
    }

    public List<String> listDeviceIds() {
        return devices.stream().map(Device::getId).collect(Collectors.toList());
    }

    public List<String> listSatelliteIds() {
        return satellites.stream().map(Satellite::getId).collect(Collectors.toList());
    }

    public void addFileToDevice(String deviceId, String filename, String content) {
        Device device = getDeviceByName(deviceId);
        device.addFile(new File(filename, content));
    }

    public EntityInfoResponse getInfo(String id) {
        Entity entity = getEntity(id);
        List<File> files = entity.getFiles();
        EntityInfoResponse response;
        if (files.size() != 0) {
            Map<String, FileInfoResponse> fileMap = files.stream()
                    .collect(Collectors.toMap(File::getfileName, File::getResponse));

            response = new EntityInfoResponse(entity.getId(), entity.getPosition(), entity.getHeight(),
                    entity.getType(), fileMap);
        } else {
            response = new EntityInfoResponse(entity.getId(), entity.getPosition(), entity.getHeight(),
                    entity.getType());
        }

        return response;
    }

    public void simulate() {
        satellites.forEach((satellite) -> satellite.simulate(getCommunicableEntities(satellite)));
        devices.forEach((device) -> device.simulate(getCommunicableEntities(device)));
    }

    /**
     * Simulate for the specified number of minutes. You shouldn't need to modify
     * this function.
     */
    public void simulate(int numberOfMinutes) {
        for (int i = 0; i < numberOfMinutes; i++) {
            simulate();
        }
    }

    private Entity getEntity(String id) {
        Entity entity = getDeviceByName(id);
        if (entity == null) {
            entity = getSatelliteByName(id);

        }
        return entity;
    }

    private List<Entity> getCommunicableEntities(Entity entity) {
        List<Entity> entities = new ArrayList<Entity>();
        entities.addAll(satellites);
        entities.addAll(devices);
        return entity.getEntitiesInRange(entities);
    }

    public List<String> communicableEntitiesInRange(String id) {
        Entity entity = getEntity(id);

        return getCommunicableEntities(entity).stream().map(Entity::getId).collect(Collectors.toList());
    }

    public void sendFile(String fileName, String fromId, String toId) throws FileTransferException {
        getEntity(toId).receiveFile(fileName, getEntity(fromId), getCommunicableEntities(getEntity(fromId)));
    }

    public void createDevice(String deviceId, String type, Angle position, boolean isMoving) {
        createDevice(deviceId, type, position);
        // TODO: Task 3
    }

    public void createSlope(int startAngle, int endAngle, int gradient) {
        // TODO: Task 3
        // If you are not completing Task 3 you can leave this method blank :)
    }
}
