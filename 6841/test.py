from itertools import combinations
s = {
        "lengthMax": True,
        "upper" : True,
        "lower" : True,
        "number" : True,
        "special" : True,
        "emoji" : True,
        "whitespace" : True,
        "repeat" : True
    }

# for combo in combinations(s, 6):  # 2 for pairs, 3 for triplets, etc
#     d = {
#         "upper" : True,
#         "lower" : True,
#         "number" : True,
#         "special" : True,
#         "emoji" : True,
#         "whitespace" : True,
#         "repeat" : True
#     }
#     d[combo[0]] = False
#     d[combo[1]] = False
#     d[combo[2]] = False
#     d[combo[3]] = False
#     d[combo[4]] = False
#     d[combo[5]] = False

#     password = ""

#     if d["upper"]:
#         password += "A"

#     if d["lower"]:
#         password += "a"

#     if d["number"]:
#         password += "1"

#     if d["special"]:
#         password += "!"

#     if not d["emoji"]:
#         password += "😁"

#     if not d["whitespace"]:
#         password += " "

#     if not d["repeat"]:
#         if d["upper"]:
#             password += "BBB"
#         elif d["lower"]:
#             password += "bbb"
#         elif d["number"]:
#             password += "000"
#         elif d["special"]:
#             password += "!!!"
#         else:
#             continue

#     print(password)

for combo in combinations(s, 5):  # 2 for pairs, 3 for triplets, etc
    d = {
        "upper" : True,
        "special" : True,
        "emoji" : True,
        "whitespace" : True,
        "repeat" : True
    }
    d[combo[0]] = False
    d[combo[1]] = False
    d[combo[2]] = False
    d[combo[3]] = False
    d[combo[4]] = False
    # d[combo[5]] = False

    password = "user123"

    if not d["whitespace"]:
        password += " "

    if d["upper"]:
        password += "A"

    if d["special"]:
        password += "!"

    if not d["emoji"]:
        password += "😁"

    if not d["repeat"]:
        password += "bbb"

    print(password)
