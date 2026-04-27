#!/usr/bin/env python3
import subprocess

def run_q1_test():
    expected_output = """\
Faculty                                 #Schools #Staff
College of Fine Arts (COFA)                    0      0
Faculty of Arts and Social Sciences            0      1
Faculty of Arts, Design and Architecture       8    409
Faculty of Built Environment                   0      5
Faculty of Engineering                         8    411
Faculty of Law and Justice                     4      8
Faculty of Medicine and Health                 6     87
Faculty of Science                             8    255
UNSW Business School                           9    379
UNSW College                                   0      3"""

    print("=== Testing q1.py ===")
    result = subprocess.run(['python3', 'q1.py'], capture_output=True, text=True)
    actual_output = result.stdout.strip()

    if actual_output == expected_output:
        print("✅ q1.py output matches expected result.\n")
        return True
    else:
        print("❌ q1.py output does NOT match expected result.")
        print("\n--- Expected ---")
        print(expected_output)
        print("\n--- Actual ---")
        print(actual_output)
        print()
        return False


def run_q2_tests():
    tests = [
        {
            "input": "COMP3311",
            "expected": "COMP3311 (Database Systems):\n22T1(70.77) -> 22T3(72.00)"
        },
        {
            "input": "MATH1081",
            "expected": "MATH1081 (Discrete Mathematics):\n22T2(58.61) -> 22T3(59.92) -> 23T1(61.22) -> 23T2(64.56)"
        },
        {
            "input": "COMPCOMP",
            "expected": "Subject COMPCOMP not found."
        },
        {
            "input": "comp3311",
            "expected": "Subject comp3311 not found."
        },
        {
            "input": "MATH1151",
            "expected": "No increasing run found for MATH1151."
        }
    ]

    print("=== Testing q2.py ===")
    all_passed = True

    for test in tests:
        subject = test["input"]
        expected = test["expected"]

        result = subprocess.run(['python3', 'q2.py', subject], capture_output=True, text=True)
        output = result.stdout.strip()

        print(f"--- Test: {subject} ---")
        if output == expected:
            print("✅ PASS\n")
        else:
            print("❌ FAIL")
            print("Expected:")
            print(expected)
            print("Got:")
            print(output + "\n")
            all_passed = False

    return all_passed


def main():
    q1_passed = run_q1_test()
    q2_passed = run_q2_tests()

    if q1_passed and q2_passed:
        print("🎉 All tests passed.")
    else:
        print("❌ Some tests failed.")

if __name__ == "__main__":
    main()
