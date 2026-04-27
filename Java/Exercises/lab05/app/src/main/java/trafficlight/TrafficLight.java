package trafficlight;

import trafficlight.States.GreenLight;
import trafficlight.States.PedestrianLight;
import trafficlight.States.RedLight;
import trafficlight.States.State;
import trafficlight.States.YellowLight;

public class TrafficLight {
    private static final int DEFAULT = 10;
    private State state;
    private String id;

    private int count = 0;

    public TrafficLight(String state, String id) {
        if (state == "Red light") {
            this.state = new RedLight(DEFAULT);
        } else if (state == "Yellow light") {
            this.state = new YellowLight();
        } else if (state == "Green light") {
            this.state = new GreenLight(DEFAULT);
        } else if (state == "Pedestrian light") {
            this.state = new PedestrianLight();
        }
        this.id = id;
        count = this.state.getCount();
    }

    public void change(int numOfCars, int numOfPedestrians) {
        if (count > 0) {
            count -= 1;
            return;
        }
        state = state.getNextState(numOfCars, numOfPedestrians);
        count = state.getCount();
    }

    public int timeRemaining() {
        return count;
    }

    public String reportState() {
        return state.getState();
    }
}
