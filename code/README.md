# Link to our website

https://peak-performance-3c40e2c0ebea.herokuapp.com/

## Open up a split screen terminal:

    Change directory into the 'server' folder:
        npm install
        npm run dev

    Change directory into the 'client' folder:
        npm install
        npm run start

## Using docker to run all 3 services (mongodb, api, client)

Make sure to start the docker engine by starting up Docker Desktop. Note make sure to log in.

    docker login -u your_username -p your_password --This will log you in using bash

### Make sure you're in the code folder

### This will stop all containers from running

    docker stop $(docker ps -aq)

### This removes all containers (deletes them)

    docker rm $(docker ps -aq)


### This will remove all images

    docker rmi $(docker images -q)


# The commands below will build and run the server and client docker file for the development environment

    To build:
        Step 1: Open a terminal and cd into the code folder
        Step 2: Run the following commands. 
                - docker build -t api-dev -f server/Dockerfile.dev .
                - docker build -t client-dev -f client/Dockerfile.dev .

    To run:
        From the code folder run:  docker-compose -f docker-compose-dev.yml up
        Open your browser and navigate to http://localhost:3000

 
# The commands below will tag and upload the api and client images to Docker Hub

    Step 1:  Tag the images
            - docker tag api-dev:latest cs673olf24team3/peak-performance:api-dev
            - docker tag client-dev:latest cs673olf24team3/peak-performance:client-dev
    
    Step 2: Upload to Docker Hub
            - docker push cs673olf24team3/peak-performance:api-dev
            - docker push cs673olf24team3/peak-performance:client-dev
