package blackout.ComponentTests;

import org.junit.jupiter.api.Test;

import blackout.TestHelpers;

import static blackout.TestHelpers.assertListAreEqualIgnoringOrder;
import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertInstanceOf;
import static unsw.utils.MathsHelper.RADIUS_OF_JUPITER;

import java.util.ArrayList;
import java.util.List;

import unsw.blackout.Entity;
import unsw.blackout.File;
import unsw.blackout.Device.DesktopDevice;
import unsw.blackout.Device.HandheldDevice;
import unsw.blackout.Device.LaptopDevice;
import unsw.blackout.Satellite.RelaySatellite;
import unsw.blackout.Satellite.StandardSatellite;
import unsw.blackout.Satellite.TeleportingSatellite;
import unsw.utils.Angle;

public class TeleportingSatelliteTests {
    private static final double SPEED = 1000;

    private void testContructor(String id, double height, Angle position) {
        TeleportingSatellite teleportingSatellite = new TeleportingSatellite(id, height, position);
        assertInstanceOf(TeleportingSatellite.class, teleportingSatellite);
        assertEquals(id, teleportingSatellite.getId());
        assertEquals(height, teleportingSatellite.getHeight());
        assertEquals(position, teleportingSatellite.getPosition());
        assertEquals("TeleportingSatellite", teleportingSatellite.getType());

    }

    @Test
    public void teleportingSatelliteTest() {
        String id = "abc123";
        double height = 20000;
        Angle position = Angle.fromDegrees(32);
        String id2 = "9s8dfu";
        double height2 = 30000;
        Angle position2 = Angle.fromRadians(3);

        assertDoesNotThrow(() -> {
            testContructor(id, height, position);
            testContructor(id2, height2, position2);

            TeleportingSatellite teleportingSatellite = new TeleportingSatellite(id, height, position);

            assertEquals(SPEED, teleportingSatellite.getSpeed());
            assertEquals(new ArrayList<File>(), teleportingSatellite.getFiles());
        });
        Angle position3 = Angle.fromDegrees(180);
        TeleportingSatellite t = new TeleportingSatellite(id, height, position3);
        assertEquals(Angle.fromDegrees(0), t.getPosition());
    }

    @Test
    public void testSimulate() {

        String id = "9s8dfu";
        double height = SPEED * 687;
        Angle position = Angle.fromRadians(3.3);
        TeleportingSatellite teleportingSatellite = new TeleportingSatellite(id, height, position);
        assertDoesNotThrow(() -> {
            teleportingSatellite.simulate(new ArrayList<Entity>());
        });
        TestHelpers.assertApproximatelyEquals(189.1594723633508, teleportingSatellite.getPosition().toDegrees());

        String id2 = "9s8dfu";
        double height2 = SPEED * 100;
        Angle position2 = Angle.fromRadians(Math.PI - 0.01);
        TeleportingSatellite teleportingSatellite2 = new TeleportingSatellite(id2, height2, position2);
        assertDoesNotThrow(() -> {
            teleportingSatellite2.simulate(new ArrayList<Entity>());
        });
        TestHelpers.assertApproximatelyEquals(0, teleportingSatellite2.getPosition().toDegrees());

        for (int i = 1; i < 315; i++) {
            teleportingSatellite2.simulate(new ArrayList<Entity>());
            TestHelpers.assertApproximatelyEquals((2 * Math.PI) - (0.01 * i),
                    teleportingSatellite2.getPosition().toRadians());

        }
        teleportingSatellite2.simulate(new ArrayList<Entity>());
        TestHelpers.assertApproximatelyEquals(0, teleportingSatellite2.getPosition().toDegrees());

        teleportingSatellite2.simulate(new ArrayList<Entity>());
        TestHelpers.assertApproximatelyEquals(0.01, teleportingSatellite2.getPosition().toRadians());

        String id3 = "9s8dfu";
        double height3 = SPEED * 687;
        Angle position3 = Angle.fromRadians(0);
        TeleportingSatellite teleportingSatellite3 = new TeleportingSatellite(id3, height3, position3);
        assertDoesNotThrow(() -> {
            teleportingSatellite3.simulate(new ArrayList<Entity>());
        });
        TestHelpers.assertApproximatelyEquals(0.001455604075691412, teleportingSatellite3.getPosition().toRadians());

    }

    @Test
    public void testInRange() {
        TeleportingSatellite teleportingSatellite = new TeleportingSatellite("mySatellite", RADIUS_OF_JUPITER + 200_000,
                new Angle());

        HandheldDevice handheldDevice = new HandheldDevice("yesHand", new Angle());
        HandheldDevice handheldDevice2 = new HandheldDevice("noHand", Angle.fromDegrees(1));
        LaptopDevice laptopDevice = new LaptopDevice("yesLap", new Angle());
        DesktopDevice desktopDevice = new DesktopDevice("yesDesk", new Angle());
        StandardSatellite standardSatellite = new StandardSatellite("yesStandard", RADIUS_OF_JUPITER + 400_000,
                new Angle());
        TeleportingSatellite teleportingSatellite2 = new TeleportingSatellite("yesTP", RADIUS_OF_JUPITER + 100_000,
                new Angle());
        RelaySatellite relaySatellite = new RelaySatellite("yesRelay", RADIUS_OF_JUPITER + 300_000, new Angle());
        RelaySatellite relaySatellite2 = new RelaySatellite("noRelay", RADIUS_OF_JUPITER + 410_000, new Angle());

        List<Entity> entities = new ArrayList<Entity>();
        entities.add(handheldDevice);
        entities.add(handheldDevice2);
        entities.add(laptopDevice);
        entities.add(desktopDevice);
        entities.add(teleportingSatellite);
        entities.add(standardSatellite);
        entities.add(teleportingSatellite2);
        entities.add(relaySatellite);
        entities.add(relaySatellite2);

        List<Entity> expected = new ArrayList<Entity>();
        expected.add(handheldDevice);
        expected.add(laptopDevice);
        expected.add(desktopDevice);
        expected.add(standardSatellite);
        expected.add(teleportingSatellite2);
        expected.add(relaySatellite);
        assertListAreEqualIgnoringOrder(expected, teleportingSatellite.getEntitiesInRange(entities));

    }

    @Test
    public void testVisible() {
        TeleportingSatellite teleportingSatellite = new TeleportingSatellite("mySatellite", RADIUS_OF_JUPITER + 5_000,
                new Angle());

        HandheldDevice handheldDevice = new HandheldDevice("yesHand", Angle.fromDegrees(180));
        StandardSatellite standardSatellite2 = new StandardSatellite("yesHand", RADIUS_OF_JUPITER + 5_000,
                Angle.fromDegrees(180));
        List<Entity> entities = new ArrayList<Entity>();
        entities.add(handheldDevice);
        entities.add(standardSatellite2);

        List<Entity> expected = new ArrayList<Entity>();

        assertListAreEqualIgnoringOrder(expected, teleportingSatellite.getEntitiesInRange(entities));

    }
}
