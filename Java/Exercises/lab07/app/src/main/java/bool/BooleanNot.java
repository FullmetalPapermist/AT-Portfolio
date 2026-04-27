package bool;

public class BooleanNot implements BooleanNode {
    private BooleanNode p;

    public BooleanNot(BooleanNode p) {
        this.p = p;
    }

    public String prettyPrint() {
        return "(NOT " + p.prettyPrint() + ")";

    }

    public boolean evaluate() {
        return !p.evaluate();
    }
}
