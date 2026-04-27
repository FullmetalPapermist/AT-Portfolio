package trafficlight.States;

public class PedestrianLight implements State {
    private static final int COUNT = 2;
    private static final String NAME = "Pedestrian light";

    public int getCount() {
        return COUNT;
    }

    @Override
    public String getState() {
        return NAME;
    }

    @Override
    public State getNextState(int numOfCars, int numOfPedestrians) {
        int trafficDemand = numOfCars + numOfPedestrians;
        return new GreenLight(trafficDemand);
    }

}
