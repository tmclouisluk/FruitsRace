function handleUserLanding(userId, boardIndex, landType, isAIMode) {
	if (!(userId >= 0 && userId <=3)) {
		console.error('Invalid userId', userId);
		return;
	}
	if (!(boardIndex >= 0 && boardIndex <= 39)) {
		console.error('Invalid boardIndex', boardIndex);
		return;
	}
	if (!(landType >= 0 && landType <= 8)) {
		console.error('Invalid landType', landType);
		return;
	}
	if (!(isAIMode >= 0 && isAIMode <= 1)) {
		console.error('Invalid isAIMode', isAIMode);
		return;
	}
	
	switch (landType) {
		case 0: case 8:
			if (isLandEmpty(boardIndex)) {
				if (canUserBuy(userId, boardIndex)){
					if (isAIMode) {
						if(land.cost[boardIndex] <= playersMoney[userId]*70/100)
							buyLand(userId, boardIndex);
					} else {
						promptBuyDialog(boardIndex);		
					}
				} else {
					sendMessage("You don't have enough nutritions now. Add oil!", 2000);
				}
			} else if (isOwner(userId, boardIndex)) {
				if(!isSpecialLand(boardIndex)){
					if (isAIMode){
						if(calculateUpgradeCost(boardIndex) <= playersMoney[userId]*70/100)
							upgradeLand(userId, boardIndex);
					} else {
						promptUpgradeDialog(boardIndex);
					}
				}
			} else { // not empty, not owner, that implies opponent
				var opponentId = getLandOwner(boardIndex);
				var amountToPay = calculateAmountToPay(land.cost[boardIndex], calculateUpgradeCost(boardIndex));
				transferMoney(userId, opponentId, amountToPay);
				playersState[userId]=2;
				if (playersMoney[userId] >= 0){ // can user pay the fee?
					var str = gameSpritesName[userId] + "'s "+amountToPay+' nutritions is transferred to '+gameSpritesName[opponentId]+'!';
					sendMessage(str, isAIMode ? 2000 : null);
				} else {
					gameOver(userId);
				}
			}
			break; // 0=land, 8=special land
		// case 1:
		// 	break; // 1=owned
		case 2:
			DrawChanceCard(userId);
			break; // 2=chancecard
		case 3:
			DrawChest(userId);
			break; // 3=chest
		case 4:
			TaxEvent(userId);
			break; // 4=badevent
		// case 5:
		// 	break; // 5=start
		case 6:
			GoJail(userId);
			break; // 6=jail
		case 7:
			break; // 7=hightea
	}
}

/**
 * Core game control
 */
function RollDice(user) {
	if (!(user >= 0 && user <=3)) {
		console.error('Invalid user', user);
		return;
	}
	
	var posx = 270;
	var posy = 475;
	var duration = 2000;
	var diceframe = [0, 1, 2, 3, 4, 5, 4, 3, 2, 1];
	var aRate = 0.03;
	gamedice.amove(posx, posy, posx, posy, duration, function() {
		var step = Math.round(Math.random() * 5 + 1);
		console.log('Round=' + roundNow + ', Step=' + step + ', Expected position=' + (playersPosition[user] + step) % 40);
		gamedice.aCIndex = step - 1;
		Move(user, step);
	}, diceframe, 10, aRate);
}

function buyLand(userId, boardIndex) {
	playerMoneyControl(userId, -land.cost[boardIndex]);
	//playersMoney[userId] -= land.cost[boardIndex];
	land.marker[boardIndex] = (userId + 1) * 10;
	var iconObject = createPlayersIconObject(userId);
	iconObject.pos.x = gameSprites[userId].pos.x + 5;
	iconObject.pos.y = gameSprites[userId].pos.y + 20;
	iconObject.userId=userId;
	gameSpritesMark.push(iconObject);
}

function promptBuyDialog(boardIndex) {
	isDialogOpen = 1;
	confirmMsg = "It will cost you " + land.cost[boardIndex] + " nutritions. Are you sure?";
	$("#dialog-confirm").text(confirmMsg);
	$("#dialog-confirm").data('type', 'buy').dialog("open");
}

function upgradeLand(userId, boardIndex) {
	var upgradeCost = calculateUpgradeCost(boardIndex);
	playerMoneyControl(userId, -upgradeCost);
	land.marker[boardIndex]++;

	var buildingObject = createBuildingObject(getLandLevel(boardIndex) - 1);
	if (playersPosition[userId] >= 0 && playersPosition[userId] <= 10) {
		buildingObject.pos.x = gameSprites[userId].pos.x + 5;
		buildingObject.pos.y = 620;
	}
	else if (playersPosition[userId] >= 11 && playersPosition[userId] <= 20) {
		buildingObject.pos.x = 70;
		buildingObject.pos.y = gameSprites[userId].pos.y + 20;
	}
	else if (playersPosition[userId] >= 21 && playersPosition[userId] <= 29) {
		buildingObject.pos.x = gameSprites[userId].pos.x + 5;
		buildingObject.pos.y = 140;
	}
	else if (playersPosition[userId] >= 31 && playersPosition[userId] <= 39) {
		buildingObject.pos.x = 530;
		buildingObject.pos.y = gameSprites[userId].pos.y + 20;
	}
	buildingObject.userId=userId;
	gameBuildings.push(buildingObject);
}

function promptUpgradeDialog(boardIndex) {
	isDialogOpen = 1;
	confirmMsg = "You need " + land.cost[boardIndex] + " nutritions to upgrade. Are you sure?";
	$("#dialog-confirm").text(confirmMsg);
	$("#dialog-confirm").data('type', 'upgrade').dialog("open");
}

function confirmPayment(paymentType) {
	var userId = parseInt($('#currentUser').val());
	var boardIndex = playersPosition[userId];
	if (paymentType == 'upgrade') {
		upgradeLand(userId, boardIndex);
	}
	else {
		buyLand(userId, boardIndex);
	}
}

function GoJail(user) {
	isJail[user] = 1;
	playersState[user] = 1;
}

function gameOver(user){
	var boardIndex = playersPosition[user];
	sendMessage(''+gameSpritesName[user]+' is running out of nutritions! Game over!', 2000);
	isGameOver[user]=1;
	var length=0;
	if(noGameOver<2){
		length=150;
		gameSprites[user].pos.x=length+(noGameOver%3)*50;
	}
	else{
		length=400;
		gameSprites[user].pos.x=400;
	}
	for(var i=0; i<land.marker.length;i++){
		if(land.marker[i] == (user + 1) * 10)
			land.marker[i]=0;
	}
	
	for(var i=0; i<gameSpritesMark.length; i++){
		if(gameSpritesMark[i]!=null){
			if(gameSpritesMark[i].userId==user)
				delete gameSpritesMark[i];
		}
	}
	for(var i=0; i<gameBuildings.length; i++){
		if(gameBuildings[i]!=null){
			if(gameBuildings[i].userId==user)
				delete gameBuildings[i];
		}
	}
	gameSprites[user].pos.y=420;
	playersState[user]=2;
	noGameOver++;
}

/**
 * Transaction function
 */
function transferMoney(user1, user2, amount) {
	playerMoneyControl(user1, -amount);
	playerMoneyControl(user2, amount);
}

function playerMoneyControl(user, amount) {
	if (!(user >= 0 && user <=3)) {
		console.error('Invalid user', user);
		return;
	}
	playersMoney[user] += amount;
}


/**
 * Math logic
 */
function calculateAmountToPay(landCost, buildingCost) {
	return (landCost + buildingCost) / 2;
}

function calculateUpgradeCost(boardIndex) {
	return land.cost[boardIndex] * land.upgradefactor[getLandLevel(boardIndex)];
}

/**
 * Condition checking
 */

function isOwner(user, boardIndex) {
	return parseInt(land.marker[boardIndex] / 10) == user + 1;
}

function isLandEmpty(boardIndex) {
	return land.marker[boardIndex] === 0;
}

function canUserBuy(user, boardIndex) {
	return playersMoney[user] >= land.cost[boardIndex];
}

function isChanceCard(boardIndex) {
	return boardroad[boardIndex] === 2;
}

function isSpecialLand(boardIndex){
	return boardroad[boardIndex] == 8;
}
