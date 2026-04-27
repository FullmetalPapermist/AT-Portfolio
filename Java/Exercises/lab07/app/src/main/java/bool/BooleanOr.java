package bool;

public class BooleanOr extends BooleanComposite {
    public BooleanOr(BooleanNode p, BooleanNode q) {
        super(p, q);
    }

    public String prettyPrint() {
        return "(OR " + getP().prettyPrint() + " " + getQ().prettyPrint() + ")";

    }

    public boolean evaluate() {
        return getP().evaluate() || getQ().evaluate();
    }
}
