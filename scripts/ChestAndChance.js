goodstrings=["People are starting to talk about your nutrition.",
			"Your nutritions are renowned in the whole town.",
			"Your nutritions bring all the boys to the yard.",
			"There are now museums dedicated to you.",
			"A national day has been created in honor of you.",
			"Your nutritions have achieved sentience."
			];
			
badstrings=["Nobody wants to discuss your nutritions.",
			"Your nutritions go in the trash.",
			"'You make me sick.' -King.",
			"'You disgust me.' -King.",
			"'Absolutely disgusting.' -King."
			];

function DrawChanceCard(user){
	if (Math.random()>0.5){
		GoodChanceCard(user);
	}
	else{
		BadChanceCard(user);
	}
}

function DrawChest(user){
	var chance = Math.round(Math.random()*10)%2;
	var chanceofstrings = Math.round(Math.random()*10)%6;
	var string=goodstrings[chanceofstrings];
	if (chance == 0)
	{
		//+money
		var money = Math.round(Math.random()*50)*100;
		string+="    <"+gameSpritesName[user]+" gets tons of nutritions("+money+").>";
		sendMessage(string, 5000);
		playerMoneyControl(user, money);
	}
	else if (chance == 1)
	{
		//+steps
		var step = Math.round(Math.random()*4);
		if(step==0)
			step++;
		isRandomEvent=1;
		roundNow--;
		if (roundNow < 0)
			roundNow = 3;
		string+="    <"+gameSpritesName[user]+" gets a chance to move "+step+" steps.>";
		sendMessage(string, 5000, function(){
			Move(user, step);
			//isRandomEvent=0;
		});
	}
}

function TaxEvent(user){
	var money = Math.round(Math.random()*30)*100;
	var chanceofstrings = Math.round(Math.random()*10)%5;
	var string=badstrings[chanceofstrings];
	string+="    <"+gameSpritesName[user]+" has to pay tax: "+money+".>";
	sendMessage(string, 5000);
	playerMoneyControl(user, -money);
	playersState[user]=2;
	if (playersMoney[roundNow] < 0 && isGameOver[roundNow]==0)
		gameOver(roundNow);
}

function GoodChanceCard(user){
	var chance = Math.round(Math.random()*10)%2;
	var chanceofstrings = Math.round(Math.random()*10)%6;
	var string=goodstrings[chanceofstrings];
	//alert(chance);
	if (chance == 0)
	{
		//+money
		var money = Math.round(Math.random()*50)*100;
		string+="    <"+gameSpritesName[user]+" gets tons of nutritions("+money+").>";
		sendMessage(string, 5000);
		playerMoneyControl(user, money);
	}
	else if (chance == 1)
	{
		//+steps
		var step = Math.round(Math.random()*4);
		if(step==0)
			step++;
		isRandomEvent=1;
		roundNow--;
		if (roundNow < 0)
			roundNow = 3;
		string+="    <"+gameSpritesName[user]+" gets a chance to move "+step+" steps.>";
		sendMessage(string, 5000, function(){
			Move(user, step);
			// isRandomEvent=0;
		});
	}
}

function BadChanceCard(user){
    var money = Math.round(Math.random()*30)*100;
    var chanceofstrings = Math.round(Math.random()*10)%5;
	var string=badstrings[chanceofstrings];
	string+="    <"+gameSpritesName[user]+" has to pay tax: "+money+".>";
	sendMessage(string, 5000);
	playerMoneyControl(user, -money);
	playersState[user]=2;
	if (playersMoney[roundNow] < 0 && isGameOver[roundNow]==0)
		gameOver(roundNow);
}