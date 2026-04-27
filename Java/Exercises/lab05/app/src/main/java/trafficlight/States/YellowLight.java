package trafficlight.States;

public class YellowLight implements State {
    private static final String NAME = "Yellow light";
    private static final int COUNT = 1;

    public int getCount() {
        return COUNT;
    }

    public String getState() {
        return NAME;
    }

    public State getNextState(int numOfCars, int numOfPedestrians) {
        int trafficDemand = numOfCars + numOfPedestrians;
        return new RedLight(trafficDemand);
    }

}
