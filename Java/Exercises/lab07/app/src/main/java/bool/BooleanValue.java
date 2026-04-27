package bool;

public class BooleanValue implements BooleanNode {
    private boolean p;

    public BooleanValue(boolean p) {
        this.p = p;
    }

    public String prettyPrint() {
        if (p) {
            return "true";
        } else {
            return "false";
        }
    }

    public boolean evaluate() {
        return p;
    }

}
