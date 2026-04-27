package metrics.Strategy;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class Max implements Strategy {
    private static final int INCREMENT = 5;

    public void apply(List<Double> metrics) {
        List<Double> temp = new ArrayList<Double>(metrics);
        metrics.clear();
        for (int i = 1; i < temp.size() / INCREMENT; i++) {
            metrics.add(Collections.max(temp.subList((i - 1) * INCREMENT, i * INCREMENT)));
        }
    }

}
