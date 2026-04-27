package hotel;

import org.json.JSONObject;

public class StandardRoom extends Room {
    @Override
    public JSONObject toJSON() {
        return super.toJSON().put("type", "standard");
    }

    @Override
    public void printWelcomeMessage() {
        System.out.println("Welcome to your standard room. Enjoy your stay :)");
    }

}
