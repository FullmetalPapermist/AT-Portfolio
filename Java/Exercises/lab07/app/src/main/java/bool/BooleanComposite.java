package bool;

public abstract class BooleanComposite implements BooleanNode {
    private BooleanNode p;
    private BooleanNode q;

    public BooleanComposite(BooleanNode p, BooleanNode q) {
        this.p = p;
        this.q = q;
    }

    public BooleanNode getP() {
        return p;
    }

    public BooleanNode getQ() {
        return q;
    }
}
