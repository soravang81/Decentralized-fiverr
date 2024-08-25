#!/bin/bash

# Set the number of retry attempts before closing buffers
ATTEMPTS_BEFORE_CLOSE=6

# Set the delay between retries (in seconds)
RETRY_DELAY=10

# Function to deploy the program
deploy_program() {
  solana program deploy target/deploy/d_fiverr.so --url https://api.devnet.solana.com --keypair /home/sourav/.config/solana/id.json
}

# Function to close buffers
close_buffers() {
  echo "Closing buffers..."
  solana program close --buffers
}

# Main infinite loop
attempt_count=0
while true; do
  ((attempt_count++))
  echo "Attempt $attempt_count"
  echo "Using account: $(solana address)"

  if deploy_program; then
    echo "Deployment successful!"
    exit 0
  else
    echo "Deployment failed. Retrying in $RETRY_DELAY seconds..."
    sleep $RETRY_DELAY
  fi

  # Check if we need to close buffers
  if ((attempt_count % ATTEMPTS_BEFORE_CLOSE == 0)); then
    close_buffers
  fi
done