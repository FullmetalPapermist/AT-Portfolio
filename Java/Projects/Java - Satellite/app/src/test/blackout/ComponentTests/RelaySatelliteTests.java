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

import blackout.TestHelpers;
import unsw.blackout.Entity;
import unsw.blackout.File;
import unsw.blackout.Device.DesktopDevice;
import unsw.blackout.Device.HandheldDevice;
import unsw.blackout.Device.LaptopDevice;
import unsw.blackout.Satellite.RelaySatellite;
import unsw.blackout.Satellite.StandardSatellite;
import unsw.blackout.Satellite.TeleportingSatellite;
import unsw.utils.Angle;

public class RelaySatelliteTests {
    private static final double SPEED = 1500;

    private void testContructor(String id, double height, Angle position) {
        RelaySatellite relaySatellite = new RelaySatellite(id, height, position);
        assertInstanceOf(RelaySatellite.class, relaySatellite);
        assertEquals(id, relaySatellite.getId());
        assertEquals(height, relaySatellite.getHeight());
        assertEquals(position, relaySatellite.getPosition());
        assertEquals("RelaySatellite", relaySatellite.getType());

    }

    @Test
    public void relaySatelliteTest() {
        String id = "abc123";
        double height = 20000;
        Angle position = Angle.fromDegrees(32);
        String id2 = "9s8dfu";
        double height2 = 30000;
        Angle position2 = Angle.fromRadians(3);

        assertDoesNotThrow(() -> {
            testContructor(id, height, position);
            testContructor(id2, height2, position2);

            RelaySatellite relaySatellite = new RelaySatellite(id, height, position);
            assertEquals(SPEED, relaySatellite.getSpeed());
            assertEquals(new ArrayList<File>(), relaySatellite.getFiles());
        });
    }

    @Test
    public void standardiseAngleTest() {

        String id3 = "9s8dfu";
        double height3 = 300000;
        Angle position3 = Angle.fromDegrees(-30);
        RelaySatellite s = new RelaySatellite(id3, height3, position3);
        TestHelpers.assertApproximatelyEquals(330, s.getPosition().toDegrees());
    }

    @Test
    public void testSimulate() {
        String id = "9s8dfu";
        double height = SPEED * 12387;
        Angle position = Angle.fromDegrees(150);
        RelaySatellite relaySatellite = new RelaySatellite(id, height, position);
        assertDoesNotThrow(() -> {
            relaySatellite.simulate(new ArrayList<Entity>());
        });
        TestHelpers.assertApproximatelyEquals(149.99537452332984, relaySatellite.getPosition().toDegrees());

        String id2 = "9s8dfu";
        double height2 = SPEED * 8732;
        Angle position2 = Angle.fromDegrees(130);
        RelaySatellite relaySatellite2 = new RelaySatellite(id2, height2, position2);
        assertDoesNotThrow(() -> {
            relaySatellite2.simulate(new ArrayList<Entity>());
        });

        TestHelpers.assertApproximatelyEquals(130.00656158720946, relaySatellite2.getPosition().toDegrees());

        String id3 = "9s8dfu";
        double height3 = SPEED * 100;
        Angle position3 = Angle.fromRadians(Math.PI * 20 / 18);
        RelaySatellite relaySatellite3 = new RelaySatellite(id3, height3, position3);
        assertDoesNotThrow(() -> {
            relaySatellite3.simulate(new ArrayList<Entity>());
        });
        TestHelpers.assertApproximatelyEquals(199.4270422048692, relaySatellite3.getPosition().toDegrees());

        String id4 = "9s8dfu";
        double height4 = SPEED * 100;
        Angle position4 = Angle.fromDegrees(346);
        RelaySatellite relaySatellite4 = new RelaySatellite(id4, height4, position4);
        assertDoesNotThrow(() -> {
            relaySatellite4.simulate(new ArrayList<Entity>());
        });
        TestHelpers.assertApproximatelyEquals(346.57295779513083, relaySatellite4.getPosition().toDegrees());

        String id5 = "9s8dfu";
        double height5 = SPEED * 100;
        Angle position5 = Angle.fromRadians(Math.PI * 23 / 12);
        RelaySatellite relaySatellite5 = new RelaySatellite(id5, height5, position5);
        assertDoesNotThrow(() -> {
            relaySatellite5.simulate(new ArrayList<Entity>());
        });
        TestHelpers.assertApproximatelyEquals(344.42704220486917, relaySatellite5.getPosition().toDegrees());

        String id6 = "9s8dfu";
        double height6 = SPEED * 100;
        Angle position6 = Angle.fromRadians(Math.PI * 7 / 9 + 0.005);
        RelaySatellite relaySatellite6 = new RelaySatellite(id6, height6, position6);
        assertDoesNotThrow(() -> {
            relaySatellite6.simulate(new ArrayList<Entity>());
        });

        TestHelpers.assertApproximatelyEquals(2.4384609527920613, relaySatellite6.getPosition().toRadians());
        assertDoesNotThrow(() -> {
            relaySatellite6.simulate(new ArrayList<Entity>());
        });
        TestHelpers.assertApproximatelyEquals(2.448460952792061, relaySatellite6.getPosition().toRadians());

        String id7 = "9s8dfu";
        double height7 = SPEED * 100;
        Angle position7 = Angle.fromRadians(Math.PI * 7 / 9 - 0.01);
        RelaySatellite relaySatellite7 = new RelaySatellite(id7, height7, position7);
        assertDoesNotThrow(() -> {
            for (int i = 0; i < 89; i++) {
                relaySatellite7.simulate(new ArrayList<Entity>());

            }
        });
        TestHelpers.assertApproximatelyEquals(0.88 + Math.PI * 7 / 9, relaySatellite7.getPosition().toRadians());

        assertDoesNotThrow(() -> {
            relaySatellite7.simulate(new ArrayList<Entity>());
        });
        TestHelpers.assertApproximatelyEquals(0.87 + Math.PI * 7 / 9, relaySatellite7.getPosition().toRadians());

    }

    @Test
    public void testInRange() {
        RelaySatellite relaySatellite = new RelaySatellite("mySatellite", RADIUS_OF_JUPITER + 300_000, new Angle());

        HandheldDevice handheldDevice = new HandheldDevice("yesHand", new Angle());
        HandheldDevice handheldDevice2 = new HandheldDevice("noHand", Angle.fromDegrees(30));
        LaptopDevice laptopDevice = new LaptopDevice("yesLap", new Angle());
        DesktopDevice desktopDevice = new DesktopDevice("noDesk", new Angle());
        StandardSatellite standardSatellite2 = new StandardSatellite("yesStandard", RADIUS_OF_JUPITER + 180_000,
                new Angle());
        TeleportingSatellite teleportingSatellite = new TeleportingSatellite("yesTP", RADIUS_OF_JUPITER + 100_000,
                new Angle());
        TeleportingSatellite teleportingSatellite2 = new TeleportingSatellite("noTP", RADIUS_OF_JUPITER + 610_000,
                new Angle());
        RelaySatellite relaySatellite2 = new RelaySatellite("yesRelay", RADIUS_OF_JUPITER, new Angle());

        List<Entity> entities = new ArrayList<Entity>();
        entities.add(handheldDevice);
        entities.add(handheldDevice2);
        entities.add(laptopDevice);
        entities.add(desktopDevice);
        entities.add(relaySatellite);
        entities.add(standardSatellite2);
        entities.add(teleportingSatellite);
        entities.add(teleportingSatellite2);
        entities.add(relaySatellite);
        entities.add(relaySatellite2);

        List<Entity> expected = new ArrayList<Entity>();
        expected.add(handheldDevice);
        expected.add(laptopDevice);
        expected.add(desktopDevice);
        expected.add(standardSatellite2);
        expected.add(teleportingSatellite);
        expected.add(relaySatellite2);

        assertListAreEqualIgnoringOrder(expected, relaySatellite.getEntitiesInRange(entities));

    }

    @Test
    void testRelay() {
        RelaySatellite relaySatellite = new RelaySatellite("mySatellite", RADIUS_OF_JUPITER + 50_000, new Angle());

        HandheldDevice handheldDevice = new HandheldDevice("yesHand", Angle.fromDegrees(0));
        DesktopDevice desktopDevice = new DesktopDevice("null", new Angle());
        StandardSatellite standardSatellite2 = new StandardSatellite("yesHand", RADIUS_OF_JUPITER + 350_000,
                new Angle());
        List<Entity> entities = new ArrayList<Entity>();
        entities.add(desktopDevice);
        entities.add(relaySatellite);
        entities.add(standardSatellite2);

        List<Entity> expected = new ArrayList<Entity>();
        expected.add(relaySatellite);
        expected.add(standardSatellite2);

        assertListAreEqualIgnoringOrder(expected, handheldDevice.getEntitiesInRange(entities));

        List<Entity> expected2 = new ArrayList<Entity>();
        expected2.add(relaySatellite);
        assertListAreEqualIgnoringOrder(expected2, desktopDevice.getEntitiesInRange(entities));

    }

    @Test
    public void testVisible() {
        RelaySatellite relaySatellite = new RelaySatellite("mySatellite", RADIUS_OF_JUPITER + 5_000, new Angle());

        HandheldDevice handheldDevice = new HandheldDevice("yesHand", Angle.fromDegrees(180));
        StandardSatellite standardSatellite2 = new StandardSatellite("yesHand", RADIUS_OF_JUPITER + 5_000,
                Angle.fromDegrees(180));
        List<Entity> entities = new ArrayList<Entity>();
        entities.add(handheldDevice);
        entities.add(standardSatellite2);

        List<Entity> expected = new ArrayList<Entity>();

        assertListAreEqualIgnoringOrder(expected, relaySatellite.getEntitiesInRange(entities));

    }

    @Test
    public void testReceive() {

        RelaySatellite relaySatellite = new RelaySatellite("mySatellite", RADIUS_OF_JUPITER + 5_000, new Angle());
        List<Entity> communicables = new ArrayList<Entity>();
        assertThrows(IllegalCallerException.class, () -> {
            relaySatellite.receiveFile(null, relaySatellite, communicables);
        });
    }
}
