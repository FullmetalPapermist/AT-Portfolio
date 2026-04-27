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
import unsw.blackout.FileTransferException.VirtualFileNoStorageSpaceException;
import unsw.blackout.FileTransferException.VirtualFileNotFoundException;
import unsw.blackout.Satellite.RelaySatellite;
import unsw.blackout.Satellite.StandardSatellite;
import unsw.blackout.Satellite.TeleportingSatellite;
import unsw.utils.Angle;
import blackout.FakeEntity;
import blackout.TestHelpers;

public class StandardSatelliteTests {
    private static final double SPEED = 2500;

    private void testContructor(String id, double height, Angle position) {
        StandardSatellite standardSatellite = new StandardSatellite(id, height, position);
        assertInstanceOf(StandardSatellite.class, standardSatellite);
        assertEquals(id, standardSatellite.getId());
        assertEquals(height, standardSatellite.getHeight());
        assertEquals(position, standardSatellite.getPosition());
        assertEquals("StandardSatellite", standardSatellite.getType());

    }

    @Test
    public void standardSatelliteTest() {
        String id = "abc123";
        double height = 200000;
        Angle position = Angle.fromDegrees(32);
        String id2 = "9s8dfu";
        double height2 = 300000;
        Angle position2 = Angle.fromRadians(3);

        assertDoesNotThrow(() -> {
            testContructor(id, height, position);
            testContructor(id2, height2, position2);

            StandardSatellite standardSatellite = new StandardSatellite(id, height, position);
            assertEquals(SPEED, standardSatellite.getSpeed());
            assertEquals(new ArrayList<File>(), standardSatellite.getFiles());
        });
    }

    @Test
    public void standardiseAngleTest() {

        String id3 = "9s8dfu";
        double height3 = 300000;
        Angle position3 = Angle.fromDegrees(390);
        StandardSatellite s = new StandardSatellite(id3, height3, position3);
        TestHelpers.assertApproximatelyEquals(Angle.fromDegrees(30).toRadians(), s.getPosition().toRadians());
    }

    @Test
    public void testSimulate() {
        String id3 = "9s8dfu";
        double height3 = SPEED * 687;
        Angle position3 = Angle.fromRadians(3.3);
        StandardSatellite standardSatellite = new StandardSatellite(id3, height3, position3);
        assertDoesNotThrow(() -> {
            standardSatellite.simulate(new ArrayList<Entity>());
        });
        TestHelpers.assertApproximatelyEquals(188.9926724229925, standardSatellite.getPosition().toDegrees());

        String id4 = "9s8dfu";
        double height4 = SPEED * 100;
        Angle position4 = Angle.fromRadians(0.01);
        StandardSatellite standardSatellite2 = new StandardSatellite(id4, height4, position4);
        assertDoesNotThrow(() -> {
            standardSatellite2.simulate(new ArrayList<Entity>());
            standardSatellite2.simulate(new ArrayList<Entity>());
        });
        TestHelpers.assertApproximatelyEquals(359.42704220486917, standardSatellite2.getPosition().toDegrees());

        String id5 = "9s8dfu";
        double height5 = SPEED * 100;
        Angle position5 = Angle.fromDegrees(Math.PI * 23 / 12);
        StandardSatellite standardSatellite3 = new StandardSatellite(id5, height5, position5);
        assertDoesNotThrow(() -> {
            standardSatellite3.simulate(new ArrayList<Entity>());
        });

        assertEquals(5.448428124249613, standardSatellite3.getPosition().toDegrees());

    }

    @Test
    public void testInRange() {
        StandardSatellite standardSatellite = new StandardSatellite("mySatellite", RADIUS_OF_JUPITER + 150_000,
                new Angle());

        HandheldDevice handheldDevice = new HandheldDevice("yesHand", new Angle());
        HandheldDevice handheldDevice2 = new HandheldDevice("noHand", Angle.fromDegrees(1));
        LaptopDevice laptopDevice = new LaptopDevice("yesLap", new Angle());
        DesktopDevice desktopDevice = new DesktopDevice("noDesk", new Angle());
        StandardSatellite standardSatellite2 = new StandardSatellite("yesStandard", RADIUS_OF_JUPITER + 300_000,
                new Angle());
        TeleportingSatellite teleportingSatellite = new TeleportingSatellite("yesTP", RADIUS_OF_JUPITER + 100_000,
                new Angle());
        RelaySatellite relaySatellite = new RelaySatellite("yesRelay", RADIUS_OF_JUPITER + 300_000, new Angle());
        RelaySatellite relaySatellite2 = new RelaySatellite("noRelay", RADIUS_OF_JUPITER + 310_000, new Angle());

        List<Entity> entities = new ArrayList<Entity>();
        entities.add(handheldDevice);
        entities.add(handheldDevice2);
        entities.add(laptopDevice);
        entities.add(desktopDevice);
        entities.add(standardSatellite);
        entities.add(standardSatellite2);
        entities.add(teleportingSatellite);
        entities.add(relaySatellite);
        entities.add(relaySatellite2);

        List<Entity> expected = new ArrayList<Entity>();
        expected.add(handheldDevice);
        expected.add(laptopDevice);
        expected.add(standardSatellite2);
        expected.add(teleportingSatellite);
        expected.add(relaySatellite);

        System.out.println(expected);
        System.out.println(standardSatellite.getEntitiesInRange(entities));

        assertListAreEqualIgnoringOrder(expected, standardSatellite.getEntitiesInRange(entities));

    }

    @Test
    public void testVisible() {
        StandardSatellite standardSatellite = new StandardSatellite("mySatellite", RADIUS_OF_JUPITER + 5_000,
                new Angle());

        HandheldDevice handheldDevice = new HandheldDevice("yesHand", Angle.fromDegrees(180));
        StandardSatellite standardSatellite2 = new StandardSatellite("yesHand", RADIUS_OF_JUPITER + 5_000,
                Angle.fromDegrees(180));
        List<Entity> entities = new ArrayList<Entity>();
        entities.add(handheldDevice);
        entities.add(standardSatellite2);

        List<Entity> expected = new ArrayList<Entity>();

        assertListAreEqualIgnoringOrder(expected, standardSatellite.getEntitiesInRange(entities));

    }

    @Test
    public void testInRangeThrows() {
        StandardSatellite standardSatellite = new StandardSatellite("mySatellite", RADIUS_OF_JUPITER + 5_000,
                new Angle());
        List<Entity> entities = new ArrayList<>();
        FakeEntity fake = new FakeEntity();
        entities.add(fake);
        assertThrows(IllegalArgumentException.class, () -> {
            standardSatellite.getEntitiesInRange(entities);
        });

    }

    @Test
    public void testFindFile() {
        StandardSatellite standardSatellite = new StandardSatellite("mySatellite", RADIUS_OF_JUPITER, new Angle());
        File file = new File("1", "1");
        HandheldDevice handheldDevice = new HandheldDevice("mySatellite", new Angle());
        handheldDevice.addFile(file);
        List<Entity> communicables = new ArrayList<Entity>();
        communicables.add(standardSatellite);
        assertDoesNotThrow(() -> {
            standardSatellite.receiveFile("1", handheldDevice, communicables);
            assertEquals(file.getFileContent(), standardSatellite.getFile("1", false).getFileContent());
        });
    }

    @Test
    public void sendToSatellite() {
        HandheldDevice handheldDevice = new HandheldDevice("mySatellite", new Angle());
        File file = new File("hello", "1");
        File file2 = new File("YOLO",
                "asdkffhasklfhaskldfhasdkfhasdkfhasdlfjaslddfjaslddfjklasjdfiojvosdjasdiojasodfu0");
        File file3 = new File("peep", "2");
        File file4 = new File("yoho", "3");
        File file5 = new File("no", "4");
        handheldDevice.addFile(file);
        handheldDevice.addFile(file2);
        handheldDevice.addFile(file3);
        handheldDevice.addFile(file4);
        handheldDevice.addFile(file5);

        StandardSatellite standardSatellite = new StandardSatellite("mySatellite", RADIUS_OF_JUPITER + 10_000,
                new Angle());

        List<Entity> communicables = new ArrayList<Entity>();
        communicables.add(standardSatellite);
        List<Entity> communicables2 = new ArrayList<Entity>();
        communicables2.add(handheldDevice);
        assertThrows(VirtualFileNotFoundException.class, () -> {
            standardSatellite.receiveFile("hellow", handheldDevice, communicables);

        });
        assertDoesNotThrow(() -> {
            standardSatellite.receiveFile("hello", handheldDevice, communicables);

        });
        assertThrows(VirtualFileNoBandwidthException.class, () -> {
            standardSatellite.receiveFile("hello", handheldDevice, communicables);

        });

        standardSatellite.simulate(communicables2);
        assertThrows(VirtualFileAlreadyExistsException.class, () -> {
            standardSatellite.receiveFile("hello", handheldDevice, communicables);

        });
        assertThrows(VirtualFileNoStorageSpaceException.class, () -> {
            standardSatellite.receiveFile("YOLO", handheldDevice, communicables);

        });
        assertDoesNotThrow(() -> {
            standardSatellite.receiveFile("peep", handheldDevice, communicables);
            standardSatellite.simulate(communicables2);
            standardSatellite.receiveFile("yoho", handheldDevice, communicables);
            standardSatellite.simulate(communicables2);

        });
        assertThrows(VirtualFileNoStorageSpaceException.class, () -> {
            standardSatellite.receiveFile("no", handheldDevice, communicables);

        });
    }

    @Test
    public void sendToSatelliteThrows() {
        HandheldDevice handheldDevice = new HandheldDevice("mySatellite", new Angle());
        File file = new File("hello", "1");

        handheldDevice.addFile(file);

        StandardSatellite standardSatellite = new StandardSatellite("mySatellite", RADIUS_OF_JUPITER + 50_000,
                new Angle());
        List<Entity> communicables = new ArrayList<Entity>();
        communicables.add(standardSatellite);
        assertDoesNotThrow(() -> {
            standardSatellite.receiveFile("hello", handheldDevice, communicables);

        });
        standardSatellite.simulate(communicables);
        assertEquals(null, standardSatellite.getFile("hello", false));

    }

}
