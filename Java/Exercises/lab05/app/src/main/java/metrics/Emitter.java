package metrics;

import java.util.ArrayList;
import java.util.List;

public class Emitter {
    private List<Plot> plots = new ArrayList<Plot>();

    public void addPlot(Plot plot) {
        plots.add(plot);

    }

    public void updatePlots(double metric) {
        plots.forEach((plot) -> plot.update(metric));
    }

    public void emitMetric(double xValue) {
        Double metric = Math.sin(Math.toRadians(xValue));
        updatePlots(metric);
    }
}
