#!/bin/bash

# IF statement
echo "Enter a number:"
read num

if [ $num -gt 0 ]; then
    echo "Number is positive"
elif [ $num -lt 0 ]; then
    echo "Number is negative"
else
    echo "Number is zero"
fi

# CASE statement
echo
echo "Choose an option:"
echo "1. Show current date"
echo "2. Show current directory"
echo "3. Show logged-in user"
read choice

case $choice in
    1) date ;;
    2) pwd ;;
    3) whoami ;;
    *) echo "Invalid choice" ;;
esac

# WHILE loop
echo
echo "WHILE loop (1 to 5):"
i=1
while [ $i -le 5 ]
do
    echo $i
    i=$((i+1))
done

# FOR loop
echo
echo "FOR loop (printing files in current directory):"
for file in *
do
    echo $file
done

# UNTIL loop
echo
echo "UNTIL loop (countdown from 5):"
j=5
until [ $j -eq 0 ]
do
    echo $j
    j=$((j-1))
done

echo "Done!"
