set terminal png size 800,600
set output "TCPThroughput.png"
set title "TCP Throughput vs Time"
set xlabel "Time (s)"
set ylabel "Throughput (Mbps)"
set grid
set key outside

plot "tcp1.tr" using 1:2 with lines title "Flow 1 (n0 → n5)" lt rgb "blue", \
     "tcp2.tr" using 1:2 with lines title "Flow 2 (n3 → n5)" lt rgb "red"
