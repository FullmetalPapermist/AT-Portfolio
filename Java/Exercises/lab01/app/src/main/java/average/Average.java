package average;

public class Average {
    /**
     * Returns the average of an array of numbers
     *
     * @param nums the array of integer numbers
     * @return the average of the numbers
     */
    public float computeAverage(int[] nums) {
        float result = 0;
        for (int num : nums) {
            result += num;
        }

        return result / nums.length;
    }

    public static void main(String[] args) {
        Average average = new Average();
        int[] array = {
                1, 2, 3, 4, 5, 6
        };

        System.out.println("The average is " + average.computeAverage(array));
    }
}
