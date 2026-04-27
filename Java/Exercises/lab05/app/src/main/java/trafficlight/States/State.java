package trafficlight.States;

public interface State {
    public int getCount();

    public String getState();

    public State getNextState(int numOfCars, int numOfPedestrians);
}
