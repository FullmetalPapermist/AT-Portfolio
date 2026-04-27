package blackout;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.junit.jupiter.api.TestInstance.Lifecycle;

import unsw.blackout.BlackoutController;
import unsw.response.models.EntityInfoResponse;
import unsw.response.models.FileInfoResponse;
import unsw.utils.Angle;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static blackout.TestHelpers.assertListAreEqualIgnoringOrder;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static unsw.utils.MathsHelper.RADIUS_OF_JUPITER;

@TestInstance(value = Lifecycle.PER_CLASS)
public class Task1Tests {
        @Test
        public void testBasics() {
                // Task 1
                // Example from the specification
                BlackoutController controller = new BlackoutController();
                // Creates 1 satellite and 3 devices
                // 2 devices are in view of the satellite
                // 1 device is out of view of the satellite
                controller.createSatellite("Satellite1", "StandardSatellite", 100 + RADIUS_OF_JUPITER,
                                Angle.fromDegrees(340));
                controller.createDevice("DeviceA", "HandheldDevice", Angle.fromDegrees(30));
                controller.createDevice("DeviceB", "LaptopDevice", Angle.fromDegrees(180));
                controller.createDevice("DeviceC", "DesktopDevice", Angle.fromDegrees(330));

                assertListAreEqualIgnoringOrder(Arrays.asList("Satellite1"), controller.listSatelliteIds());
                assertListAreEqualIgnoringOrder(Arrays.asList("DeviceA", "DeviceB", "DeviceC"),
                                controller.listDeviceIds());

                assertEquals(new EntityInfoResponse("Satellite1", Angle.fromDegrees(340), 100 + RADIUS_OF_JUPITER,
                                "StandardSatellite"), controller.getInfo("Satellite1"));

                assertEquals(new EntityInfoResponse("DeviceA", Angle.fromDegrees(30), RADIUS_OF_JUPITER,
                                "HandheldDevice"), controller.getInfo("DeviceA"));
                assertEquals(new EntityInfoResponse("DeviceB", Angle.fromDegrees(180), RADIUS_OF_JUPITER,
                                "LaptopDevice"), controller.getInfo("DeviceB"));
                assertEquals(new EntityInfoResponse("DeviceC", Angle.fromDegrees(330), RADIUS_OF_JUPITER,
                                "DesktopDevice"), controller.getInfo("DeviceC"));

                controller.createSatellite("Satellite2", "TeleportingSatellite", 200 + RADIUS_OF_JUPITER,
                                Angle.fromRadians(2));

                controller.createSatellite("Satellite3", "RelaySatellite", 200 + RADIUS_OF_JUPITER,
                                Angle.fromRadians(0));
                List<String> expected = new ArrayList<String>();
                expected.add("Satellite1");
                expected.add("Satellite2");
                expected.add("Satellite3");
                assertListAreEqualIgnoringOrder(expected, controller.listSatelliteIds());
        }

        @Test
        public void testDelete() {
                // Task 1
                BlackoutController controller = new BlackoutController();

                // Creates 1 satellite and 3 devices and deletes them
                controller.createSatellite("Satellite1", "StandardSatellite", 100 + RADIUS_OF_JUPITER,
                                Angle.fromDegrees(340));
                controller.createDevice("DeviceA", "HandheldDevice", Angle.fromDegrees(30));
                controller.createDevice("DeviceB", "LaptopDevice", Angle.fromDegrees(180));
                controller.createDevice("DeviceC", "DesktopDevice", Angle.fromDegrees(330));

                assertListAreEqualIgnoringOrder(Arrays.asList("Satellite1"), controller.listSatelliteIds());
                assertListAreEqualIgnoringOrder(Arrays.asList("DeviceA", "DeviceB", "DeviceC"),
                                controller.listDeviceIds());

                controller.removeDevice("DeviceA");
                controller.removeDevice("DeviceB");
                controller.removeDevice("DeviceC");
                controller.removeSatellite("Satellite1");
        }

        @Test
        public void basicFileSupport() {
                // Task 1
                BlackoutController controller = new BlackoutController();

                // Creates 1 device and add some files to it
                controller.createDevice("DeviceC", "DesktopDevice", Angle.fromDegrees(330));
                assertListAreEqualIgnoringOrder(Arrays.asList("DeviceC"), controller.listDeviceIds());
                assertEquals(new EntityInfoResponse("DeviceC", Angle.fromDegrees(330), RADIUS_OF_JUPITER,
                                "DesktopDevice"), controller.getInfo("DeviceC"));

                controller.addFileToDevice("DeviceC", "Hello World", "My first file!");
                Map<String, FileInfoResponse> expected = new HashMap<>();
                expected.put("Hello World",
                                new FileInfoResponse("Hello World", "My first file!", "My first file!".length(), true));
                assertEquals(new EntityInfoResponse("DeviceC", Angle.fromDegrees(330), RADIUS_OF_JUPITER,
                                "DesktopDevice", expected), controller.getInfo("DeviceC"));
        }

        @Test
        public void errorThrowing() {
                BlackoutController controller = new BlackoutController();
                assertThrows(IllegalArgumentException.class, () -> {
                        controller.createDevice("hi", "null", new Angle());
                });
                assertThrows(IllegalArgumentException.class, () -> {
                        controller.createSatellite("null", "null", RADIUS_OF_JUPITER, new Angle());
                });
        }
}
