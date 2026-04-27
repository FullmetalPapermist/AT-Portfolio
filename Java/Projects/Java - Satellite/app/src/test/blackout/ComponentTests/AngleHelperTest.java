package blackout.ComponentTests;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

import blackout.TestHelpers;
import unsw.utils.Angle;
import unsw.utils.AngleHelper;

public class AngleHelperTest {
    @Test
    public void standardiseAngleTest() {
        Angle angle = Angle.fromDegrees(390);
        Angle angle2 = AngleHelper.standardiseAngle(angle);
        assertEquals(angle.subtract(AngleHelper.REVOLUTION), angle2);

        Angle angle3 = Angle.fromDegrees(1000);
        Angle angle4 = AngleHelper.standardiseAngle(angle3);
        assertEquals(angle3.subtract(TestHelpers.getRevolutions(2)), angle4);

        Angle angle5 = Angle.fromDegrees(360);
        Angle angle6 = AngleHelper.standardiseAngle(angle5);
        assertEquals(angle5.subtract(AngleHelper.REVOLUTION), angle6);

    }

    @Test
    public void standardiseAngleNegativeTest() {
        Angle angle = Angle.fromDegrees(-60);
        Angle angle2 = AngleHelper.standardiseAngle(angle);
        assertEquals(angle.add(Angle.fromDegrees(360)), angle2);

        Angle angle3 = Angle.fromDegrees(-720);
        Angle angle4 = AngleHelper.standardiseAngle(angle3);
        assertEquals(angle3.add(Angle.fromDegrees(360 * 2)), angle4);

    }
}
