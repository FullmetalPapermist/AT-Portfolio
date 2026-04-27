package hotel;

import org.json.JSONObject;

public class EnsuiteRoom extends Room {
    @Override
    public JSONObject toJSON() {
        return super.toJSON().put("type", "ensuite");
    }

    @Override
    public void printWelcomeMessage() {
        System.out
                .println("Welcome to your beautiful ensuite room which overlooks the Sydney harbour. Enjoy your stay");
    }

}
