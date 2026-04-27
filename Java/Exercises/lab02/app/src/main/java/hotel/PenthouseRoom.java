package hotel;

import org.json.JSONObject;

public class PenthouseRoom extends Room {
    @Override
    public JSONObject toJSON() {
        return super.toJSON().put("type", "penthouse");
    }

    @Override
    public void printWelcomeMessage() {
        System.out.println(
                "Welcome to your penthouse apartment, complete with ensuite, lounge, kitchen and master bedroom.");
    }

}
