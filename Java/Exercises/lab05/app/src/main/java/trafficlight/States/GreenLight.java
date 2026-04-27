package trafficlight.States;

public class GreenLight implements State {
    private boolean busy;
    private static final int UPPER_LIMIT = 100;
    private static final int BUSY = 6;
    private static final int STANDARD = 4;
    private static final String NAME = "Green light";

    public GreenLight(int trafficDemand) {
        if (trafficDemand > UPPER_LIMIT) {
            busy = true;
        } else {
            busy = false;
        }
    }

    public int getCount() {
        if (busy) {
            return BUSY;
        } else {
            return STANDARD;
        }
    }

    public String getState() {
        return NAME;
    }

    public State getNextState(int numOfCars, int numOfPedestrians) {
        return new YellowLight();
    }

}
