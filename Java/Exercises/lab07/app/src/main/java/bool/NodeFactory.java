package bool;

import org.json.JSONObject;

public class NodeFactory {
    public static BooleanNode createBooleanNode(JSONObject obj) {
        String type = obj.getString("node");
        if (type.equals("value")) {
            return new BooleanValue(obj.getBoolean("value"));
        } else if (type.equals("not")) {
            return new BooleanNot(createBooleanNode(obj.getJSONObject("subnode")));
        } else if (type.equals("and")) {
            return new BooleanAnd(createBooleanNode(obj.getJSONObject("subnode1")),
                    createBooleanNode(obj.getJSONObject("subnode2")));
        } else if (type.equals("or")) {
            return new BooleanOr(createBooleanNode(obj.getJSONObject("subnode1")),
                    createBooleanNode(obj.getJSONObject("subnode2")));
        } else {
            throw new IllegalArgumentException("Invalid JSON object");
        }
    }

    public static void main(String[] args) {
        // Stringified JSON input given
        JSONObject obj = new JSONObject(
                "{\"node\":\"and\",\"subnode1\":{\"node\":\"or\",\"subnode1\":{\"node\":\"value\",\"value\":true},"
                        + "\"subnode2\":{\"node\":\"value\",\"value\":false}},"
                        + "\"subnode2\":{\"node\":\"value\",\"value\":true}}");
        // JSONObject obj2 = new JSONObject("{\"node\":\"value\",\"value\":true}");
        System.out.println(createBooleanNode(obj).prettyPrint());
    }
}
