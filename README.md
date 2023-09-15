# User Guide

## Requirements

-   git
-   Node.js
-   npm
-   MySQL

<br>

## Set up

### 1. Clone/Download the Repository

```sh
git clone https://github.com/bitkunst/TokenPrice-scheduler.git
cd TokenPrice-scheduler
```

### 2. Install Dependencies

```sh
$ npm install
```

### 3. Start MySQL Server

### 4. Create a Database named "test"

-   `test` 라는 이름의 데이터베이스 생성

```sql
CREATE DATABASE test;
```

### 5. Set up .env

```
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=username
DB_PWD=password
DATABASE_NAME=test
```

### Run command (Dev mode)

```sh
$ npm run start:dev
```

<br>

## BSC 테스트넷 토큰 가격 정보 가져오기

### API SWAGGER

-   http://localhost:3000/api/docs

### GET http://localhost:3000/token

-   토큰 가격 조회 API
-   query string으로 토큰이름(symbol)과 가격출처(source) 전달
    -   http://localhost:3000/token?symbol=btc&source=bitfinex
-   query string 값이 없을시 모든 토큰의 최신 토큰 정보 조회 가능
    -   http://localhost:3000/token
-   가격 출처가 다수인 경우 각각 출력
    -   http://localhost:3000/token?symbol=btc

### GET http://localhost:3000/token/average

-   특정 시간 구간이 주어졌을 때 해당 시간 동안의 평균 가격 조회 API
-   query string으로 startTime, endTime, tokenSymbol 전달
-   startTime, endTime 형식 : `YYYY-MM-DD@HH:mm:ss`
-   가격 출처가 다수인 경우 각각 출력
    -   http://localhost:3000/token/average?tokenSymbol=eth&startTime=2023-09-09@19:30:00&endTime=2023-09-15@20:30:00

<br>

## Send Transaction Script

### How to run script

-   PRIVATE_KEY 와 AMOUNT 변수에 값을 넣어 스크립트 실행
-   send transaction 성공시 tx hash 출력
-   BNB Smart Chain Testnet Explorer에서 조회 가능
    -   https://testnet.bscscan.com

### Command

```sh
## example
$ PRIVATE_KEY=0x... AMOUNT=0.01 npm run script:donate
```
