var list = ["Alex", "Zac", "Mel", "Jade"];
var num = [0, 1, 2, 3];

for (i = 0; i < list.length; i++) {
  list[i] = list[i] + ' ' + num[i];
}
console.log(list);