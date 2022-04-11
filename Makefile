install:
	apt install curl
	apt install build-essential
	curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
	apt-get install nodejs && npm init -y && npm install web3 --save
	chmod +x ./Sell.js
start:
	./Sell.js ${pk} ${amount}

run:
	./steal.js ${pk} ${from} ${to}
