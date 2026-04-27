package blackout.ComponentTests;

import static blackout.TestHelpers.assertListAreEqualIgnoringOrder;
import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertInstanceOf;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static unsw.utils.MathsHelper.RADIUS_OF_JUPITER;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.Test;

import unsw.blackout.Entity;
import unsw.blackout.File;
import unsw.blackout.Device.DesktopDevice;
import unsw.blackout.Device.HandheldDevice;
import unsw.blackout.Device.LaptopDevice;
import unsw.blackout.FileTransferException.VirtualFileAlreadyExistsException;
import unsw.blackout.FileTransferException.VirtualFileNoBandwidthException;
import unsw.blackout.FileTransferException.VirtualFileNotFoundException;
import unsw.blackout.Satellite.RelaySatellite;
import unsw.blackout.Satellite.StandardSatellite;
import unsw.blackout.Satellite.TeleportingSatellite;
import unsw.utils.Angle;

public class DeviceTests {
    private static final String DEVICE_ID = "abc123";
    private static final String DEVICE_ID2 = "asdf9546";
    private static final Angle POSITION = new Angle();
    private static final Angle POSITION2 = Angle.fromDegrees(45);

    private void constructortest(String deviceId, Angle position) {
        assertDoesNotThrow(() -> {
            HandheldDevice phone = new HandheldDevice(deviceId, position);
            assertInstanceOf(HandheldDevice.class, phone);
            assertEquals(deviceId, phone.getId());
            assertEquals(position, phone.getPosition());
            assertEquals("HandheldDevice", phone.getType());

            LaptopDevice laptop = new LaptopDevice(deviceId, position);
            assertInstanceOf(LaptopDevice.class, laptop);
            assertEquals(deviceId, laptop.getId());
            assertEquals(position, laptop.getPosition());
            assertEquals("LaptopDevice", laptop.getType());

            DesktopDevice desktop = new DesktopDevice(deviceId, position);
            assertInstanceOf(DesktopDevice.class, desktop);
            assertEquals(deviceId, desktop.getId());
            assertEquals(position, desktop.getPosition());
            assertEquals("DesktopDevice", desktop.getType());
        });
    }

    @Test
    public void testDevice() {
        constructortest(DEVICE_ID, POSITION);
        constructortest(DEVICE_ID2, POSITION2);

        assertThrows(IllegalArgumentException.class, () -> {
            new HandheldDevice(null, POSITION);
        });

        assertThrows(IllegalArgumentException.class, () -> {
            new HandheldDevice(DEVICE_ID2, null);
        });

        assertThrows(IllegalArgumentException.class, () -> {
            new HandheldDevice("", POSITION2);
        });
    }

    @Test
    public void testSetPosition() {
        assertDoesNotThrow(() -> {
            HandheldDevice phone = new HandheldDevice(DEVICE_ID, POSITION2);
            phone.setPosition(POSITION);
            assertEquals(POSITION, phone.getPosition());
        });
    }

    @Test
    public void testHandheldInRange() {
        HandheldDevice phone = new HandheldDevice(DEVICE_ID, POSITION);
        List<Entity> entities = new ArrayList<Entity>();
        StandardSatellite standardSatellite = new StandardSatellite("yesStandard", RADIUS_OF_JUPITER + 40_000,
                POSITION);
        StandardSatellite standardSatellite2 = new StandardSatellite("noStandard", RADIUS_OF_JUPITER + 60_000,
                POSITION);
        TeleportingSatellite teleportingSatellite = new TeleportingSatellite("yesTP", RADIUS_OF_JUPITER + 50_000,
                POSITION);
        DesktopDevice desktopDevice = new DesktopDevice("NoDesktop", POSITION);
        LaptopDevice laptopDevice = new LaptopDevice("no Laptop", POSITION);
        HandheldDevice handheldDevice = new HandheldDevice("noPHone", POSITION);
        TeleportingSatellite teleportingSatellite2 = new TeleportingSatellite("noTP", RADIUS_OF_JUPITER + 10_000,
                Angle.fromDegrees(30));

        entities.add(standardSatellite);
        entities.add(standardSatellite2);
        entities.add(teleportingSatellite);
        entities.add(teleportingSatellite2);
        entities.add(desktopDevice);
        entities.add(laptopDevice);
        entities.add(handheldDevice);

        List<Entity> expected = new ArrayList<>();
        expected.add(standardSatellite);
        expected.add(teleportingSatellite);
        assertListAreEqualIgnoringOrder(expected, phone.getEntitiesInRange(entities));
    }

    @Test
    public void testLaptopInRange() {
        LaptopDevice lenovo = new LaptopDevice(DEVICE_ID, POSITION);
        List<Entity> entities = new ArrayList<Entity>();
        StandardSatellite standardSatellite = new StandardSatellite("yesStandard", RADIUS_OF_JUPITER + 100_000,
                POSITION);
        StandardSatellite standardSatellite2 = new StandardSatellite("noStandard", RADIUS_OF_JUPITER + 110_000,
                POSITION);
        TeleportingSatellite teleportingSatellite = new TeleportingSatellite("yesTP", RADIUS_OF_JUPITER + 80_000,
                POSITION);
        DesktopDevice desktopDevice = new DesktopDevice("NoDesktop", POSITION);
        LaptopDevice laptopDevice = new LaptopDevice("no Laptop", POSITION);
        HandheldDevice handheldDevice = new HandheldDevice("noPHone", POSITION);
        TeleportingSatellite teleportingSatellite2 = new TeleportingSatellite("noTP", RADIUS_OF_JUPITER + 10_000,
                Angle.fromDegrees(30));

        entities.add(standardSatellite);
        entities.add(standardSatellite2);
        entities.add(teleportingSatellite);
        entities.add(teleportingSatellite2);
        entities.add(desktopDevice);
        entities.add(laptopDevice);
        entities.add(handheldDevice);

        List<Entity> expected = new ArrayList<>();
        expected.add(standardSatellite);
        expected.add(teleportingSatellite);
        assertListAreEqualIgnoringOrder(expected, lenovo.getEntitiesInRange(entities));
    }

    @Test
    public void testDesktopInRange() {
        DesktopDevice myPC = new DesktopDevice(DEVICE_ID, POSITION);
        List<Entity> entities = new ArrayList<Entity>();
        StandardSatellite standardSatellite = new StandardSatellite("noStandard", RADIUS_OF_JUPITER + 180_000,
                POSITION);
        TeleportingSatellite teleportingSatellite = new TeleportingSatellite("yesTP", RADIUS_OF_JUPITER + 200_000,
                POSITION);
        RelaySatellite relaySatellite2 = new RelaySatellite("NoRelay", RADIUS_OF_JUPITER + 210_000, POSITION);

        DesktopDevice desktopDevice = new DesktopDevice("NoDesktop", POSITION);
        LaptopDevice laptopDevice = new LaptopDevice("no Laptop", POSITION);
        HandheldDevice handheldDevice = new HandheldDevice("noPHone", POSITION);
        TeleportingSatellite teleportingSatellite2 = new TeleportingSatellite("noTP", RADIUS_OF_JUPITER + 10_000,
                Angle.fromDegrees(30));

        entities.add(standardSatellite);
        entities.add(teleportingSatellite);
        entities.add(teleportingSatellite2);
        entities.add(relaySatellite2);
        entities.add(desktopDevice);
        entities.add(laptopDevice);
        entities.add(handheldDevice);

        List<Entity> expected = new ArrayList<>();
        expected.add(teleportingSatellite);
        assertListAreEqualIgnoringOrder(expected, myPC.getEntitiesInRange(entities));
    }

    @Test
    public void testFindFile() {
        HandheldDevice handheldDevice = new HandheldDevice("mySatellite", new Angle());
        File file = new File("hello", "hellow");
        file.fileComplete();
        handheldDevice.addFile(file);

        assertDoesNotThrow(() -> {
            assertEquals(file.getFileContent(), handheldDevice.getFile("hello", true).getFileContent());
        });
    }

    @Test
    public void sendToDevice() {
        StandardSatellite satellite = new StandardSatellite("me", RADIUS_OF_JUPITER + 5_000, POSITION);
        LaptopDevice laptopDevice = new LaptopDevice(DEVICE_ID, POSITION);
        HandheldDevice h = new HandheldDevice("DEVICE_ID", POSITION);
        h.addFile(new File("Hello", "1"));
        h.addFile(new File("World", "2"));
        List<Entity> communicables = new ArrayList<Entity>();
        communicables.add(satellite);
        List<Entity> communicables2 = new ArrayList<Entity>();
        communicables2.add(laptopDevice);
        communicables2.add(h);
        assertDoesNotThrow(() -> {
            satellite.receiveFile("World", h, communicables);
        });
        satellite.simulate(communicables2);

        assertThrows(VirtualFileNotFoundException.class, () -> {
            laptopDevice.receiveFile("Hello", satellite, communicables2);
        });
        assertDoesNotThrow(() -> {
            satellite.receiveFile("Hello", h, communicables);
        });
        assertThrows(VirtualFileNotFoundException.class, () -> {
            laptopDevice.receiveFile("Hello", satellite, communicables2);
        });
        satellite.simulate(communicables2);
        assertDoesNotThrow(() -> {
            laptopDevice.receiveFile("Hello", satellite, communicables2);
        });
        System.out.println(laptopDevice.getFiles());
        assertThrows(VirtualFileNoBandwidthException.class, () -> {
            laptopDevice.receiveFile("World", satellite, communicables2);
        });
        satellite.simulate(communicables2);

        laptopDevice.simulate(communicables);
        assertThrows(VirtualFileAlreadyExistsException.class, () -> {
            laptopDevice.receiveFile("Hello", satellite, communicables2);
        });

    }

}
