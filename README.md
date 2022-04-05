# Test API

Create an API using Framework Express and MongoDB as database handler.

## Requeriments

Repository          | Version
------------------- | ---------------
**Nodejs**          | 16.14.2
**MongoDB**         | 5.0.6
**Express**         | 4.17.3
**Docker**          | 20.10.14
**Docker-Compose**  | 1.29.2


## Clone Repository

Clone this repository with:


```
$ git clone https://github.com/andresroyarce/JooycarTest.git
```

Navegate to the directory. Then create a default *.env* file based on the example by copying it with this command:


```
$ cp .env.example .env
```

You can use the defaults values. Before run the docker containers, you must have installed *docker engine* and *docker compose*.

## Run test

For run the test use this command:

```
$  sudo docker-compose -f docker-compose.test.yml run node
```

## Run container

For run the container, use this command:


```
$  sudo docker-compose up --build
```
