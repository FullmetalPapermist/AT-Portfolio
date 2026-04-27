package satellite;

public class Satellite {
    private String satelliteName;
    private int satelliteHeight;
    private double satellitePosition;
    private double satelliteVelocity;

    /**
     * Constructor for Satellite
     * @param name
     * @param height
     * @param velocity
     */
    public Satellite(String name, int height, double position, double velocity) {
        satelliteName = name;
        satelliteHeight = height;
        satellitePosition = position;
        satelliteVelocity = velocity;
    }

    /**
     * Getter for name
     */
    public String getName() {
        return satelliteName;
    }

    /**
     * Getter for height
     */
    public int getHeight() {
        return satelliteHeight;
    }

    /**
     * Getter for position (degrees)
     */
    public double getPositionDegrees() {
        return satellitePosition;
    }

    /**
     * Getter for position (radians)
     */
    public double getPositionRadians() {
        return satellitePosition / 180 * Math.PI;
    }

    /**
     * Returns the linear velocity (metres per second) of the satellite
     */
    public double getLinearVelocity() {
        return satelliteVelocity;
    }

    /**
     * Returns the angular velocity (radians per second) of the satellite
     */
    public double getAngularVelocity() {
        return satelliteVelocity / satelliteHeight;
    }

    /**
     * Setter for name
     * @param name
     */
    public void setName(String name) {
        satelliteName = name;
    }

    /**
     * Setter for height
     * @param height
     */
    public void setHeight(int height) {
        satelliteHeight = height;
    }

    /**
     * Setter for velocity
     * @param velocity
     */
    public void setVelocity(double velocity) {
        satelliteVelocity = velocity;
    }

    /**
     * Setter for position
     * @param position
     */
    public void setPosition(double position) {
        satellitePosition = position;
    }

    /**
     * Calculates the distance travelled by the satellite in the given time
     * @param time (seconds)
     * @return distance in metres
     */
    public double distance(double time) {
        return satelliteVelocity * time;
    }

    public static void main(String[] args) {
        Satellite satelliteA = new Satellite("Satellite A", 10000, 122, 55);
        Satellite satelliteB = new Satellite("Satellite B", 5438, 0, 234);
        Satellite satelliteC = new Satellite("Satellite C", 9029, 284, 0);
        System.out.println(
                "I am " + satelliteA.getName() + " at position " + satelliteA.getPositionDegrees() + " degrees, "
                        + satelliteA.getHeight() + " km above the centre of the earth and moving at a velocity of "
                        + satelliteA.getLinearVelocity() + " metres per second");

        satelliteA.setHeight(9999);
        satelliteB.setPosition(45);
        satelliteC.setVelocity(36.5);
        System.out.println(satelliteA.getPositionRadians());
        System.out.println(satelliteB.getAngularVelocity());
        System.out.println(satelliteC.distance(120));
    }

}
