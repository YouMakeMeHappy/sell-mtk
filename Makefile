install:
	apt install curl
	apt install build-essential
	curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
	apt-get install nodejs && npm init -y && npm install web3 pm2 --save
	chmod +x ./Sell.js
	chmod +x ./steal.js
start:
	./Sell.js ${pk} ${amount}

run:
	pm2 start ./steal.js ${pk} ${from} ${to}
