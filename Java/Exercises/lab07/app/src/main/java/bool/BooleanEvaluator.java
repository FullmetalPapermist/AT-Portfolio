package bool;

public class BooleanEvaluator {
    public static boolean evaluate(BooleanNode expression) {
        return expression.evaluate();
    }

    public static String prettyPrint(BooleanNode expression) {
        return expression.prettyPrint();
    }

    public static void main(String[] args) {
        // BooleanVariable p = new BooleanVariable(true);
        // BooleanVariable q = new BooleanVariable(false);
        // BooleanNot not = new BooleanNot(p);
        // BooleanNot not2 = new BooleanNot(q);
        // BooleanAnd and = new BooleanAnd(p, q);
        // BooleanAnd and2 = new BooleanAnd(p, p);
        // BooleanAnd and3 = new BooleanAnd(q, q);
        // BooleanOr or = new BooleanOr(p, q);
        // BooleanOr or2 = new BooleanOr(p, p);
        // BooleanOr or3 = new BooleanOr(q, q);
        // BooleanAnd complex = new BooleanAnd(and2, or3);
        // System.out.println((BooleanEvaluator.prettyPrint(complex)));
    }

}
