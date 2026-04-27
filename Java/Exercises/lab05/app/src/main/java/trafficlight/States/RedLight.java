package trafficlight.States;

public class RedLight implements State {
    private boolean empty;
    private static final int LOWER_LIMIT = 10;
    private static final int EMPTY = 10;
    private static final int STANDARD = 6;
    private static final String NAME = "Red light";

    public RedLight(int trafficDemand) {

        if (trafficDemand < LOWER_LIMIT) {
            empty = true;
        } else {
            empty = false;
        }
    }

    public int getCount() {
        if (empty) {
            return EMPTY;
        } else {
            return STANDARD;
        }
    }

    public String getState() {
        return NAME;
    }

    public State getNextState(int numOfCars, int numOfPedestrians) {
        if (numOfPedestrians > 0) {
            return new PedestrianLight();
        } else {
            int trafficDemand = numOfCars + numOfPedestrians;
            return new GreenLight(trafficDemand);

        }
    }

}
