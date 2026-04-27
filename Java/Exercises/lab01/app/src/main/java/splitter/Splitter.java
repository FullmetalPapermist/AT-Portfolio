package splitter;

import java.util.Scanner;

public class Splitter {
    public static void main(String[] args) {
        System.out.println("Enter a sentence specified by spaces only:");
        Scanner scanner = new Scanner(System.in);

        String[] strings = scanner.nextLine().split(" ");

        for (String string : strings) {
            System.out.println(string);
        }
        scanner.close();
    }
}
