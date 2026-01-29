#!/bin/bash

# Check for root
if [ "$EUID" -ne 0 ]; then
  echo "Please run as root"
  exit 1
fi

echo "===== User Management Menu ====="
echo "1. Add User"
echo "2. Delete User"
echo "3. Modify User"
echo "4. Display User Info"
echo "5. Exit"
echo "================================"

read -p "Enter your choice: " choice

case $choice in
  1)
    read -p "Enter username to add: " uname
    useradd "$uname"
    if [ $? -eq 0 ]; then
      echo "User '$uname' added successfully"
      passwd "$uname"
    else
      echo "Failed to add user"
    fi
    ;;
  
  2)
    read -p "Enter username to delete: " uname
    userdel -r "$uname"
    if [ $? -eq 0 ]; then
      echo "User '$uname' deleted successfully"
    else
      echo "Failed to delete user"
    fi
    ;;
  
  3)
    read -p "Enter username to modify: " uname
    echo "1. Change username"
    echo "2. Change shell"
    echo "3. Lock user"
    read -p "Enter option: " opt

    case $opt in
      1)
        read -p "Enter new username: " newname
        usermod -l "$newname" "$uname"
        echo "Username changed"
        ;;
      2)
        read -p "Enter new shell (e.g. /bin/bash): " shell
        usermod -s "$shell" "$uname"
        echo "Shell changed"
        ;;
      3)
        usermod -L "$uname"
        echo "User locked"
        ;;
      *)
        echo "Invalid option"
        ;;
    esac
    ;;
  
  4)
    read -p "Enter username to display info: " uname
    id "$uname"
    grep "^$uname:" /etc/passwd
    ;;
  
  5)
    echo "Exiting..."
    exit 0
    ;;
  
  *)
    echo "Invalid choice"
    ;;
esac
