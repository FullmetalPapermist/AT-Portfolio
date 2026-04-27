package bool;

public class BooleanAnd extends BooleanComposite {
    public BooleanAnd(BooleanNode p, BooleanNode q) {
        super(p, q);
    }

    public String prettyPrint() {
        return "(AND " + getP().prettyPrint() + " " + getQ().prettyPrint() + ")";

    }

    public boolean evaluate() {
        return getP().evaluate() && getQ().evaluate();
    }

}
