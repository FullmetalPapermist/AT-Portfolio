package unsw.utils;

public class AngleHelper {
    public static final Angle REVOLUTION = Angle.fromRadians(2 * Math.PI);

    public static final Angle ZERO = Angle.fromRadians(0);

    public static Angle standardiseAngle(Angle angle) {
        Angle newAngle = Angle.fromDegrees(angle.toDegrees());
        while (newAngle.compareTo(ZERO) == -1) {
            newAngle = newAngle.add(REVOLUTION);
        }
        while (newAngle.compareTo(REVOLUTION) > -1) {
            newAngle = newAngle.subtract(REVOLUTION);
        }

        return newAngle;
    }

}
