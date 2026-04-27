package blackout;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.List;

import unsw.utils.Angle;

public class TestHelpers {
    public static void assertListAreEqualIgnoringOrder(List<?> a, List<?> b) {
        // containsAll both ways is important to handle dupes
        assertTrue(a.size() == b.size() && a.containsAll(b) && b.containsAll(a));
    }

    public static void assertListAreNotEqualIgnoringOrder(List<?> a, List<?> b) {
        // containsAll both ways is important to handle dupes
        assertFalse(a.size() == b.size() && a.containsAll(b) && b.containsAll(a));
    }

    public static Angle getRevolutions(int revolutions) {
        return Angle.fromDegrees(360 * revolutions);
    }

    public static void assertApproximatelyEquals(double expected, double actual) {
        assertTrue(Math.abs(expected - actual) < 1e-10);
    }

}
