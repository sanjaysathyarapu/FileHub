#!/bin/bash

# Path to the server directory
SERVER_DIR="/home/ec2-user/server"

# Check if the server directory exists
if [ ! -d "$SERVER_DIR" ]; then
    echo "Server directory does not exist. Creating now..."
    mkdir -p "$SERVER_DIR"
    echo "Server directory created."
else
    echo "Server directory already exists."
fi

# Existing commands here to clear old deployment files, if any
# Example: rm -rf $SERVER_DIR/*