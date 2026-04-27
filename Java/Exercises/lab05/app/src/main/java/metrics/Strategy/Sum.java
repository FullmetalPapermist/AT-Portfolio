package metrics.Strategy;

import java.util.ArrayList;
import java.util.List;

public class Sum implements Strategy {
    private static final int INCREMENT = 5;

    public void apply(List<Double> metrics) {
        List<Double> temp = new ArrayList<Double>(metrics);
        metrics.clear();
        for (int i = 1; i < temp.size() / INCREMENT; i++) {
            metrics.add(
                    temp.subList((i - 1) * INCREMENT, i * INCREMENT).stream().mapToDouble(Double::doubleValue).sum());
        }
    }

}
