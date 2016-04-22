var particleSystem = [];

var attractors = [];

var tableA;

var tableB;

var aggregated = [];

var investorAggregated = [];

var connections = [];

var companiesToDisplay = [];

var investorToDisplay = [];

var investorSystem = [];

var img;

var img2;

var sum = 0; //整个的amount

//var angles = [ 30, 10, 45, 35, 60, 38, 75, 67 ];




function preload() {
    //load the table in
    tableA = loadTable("data/investments.csv", "csv", "header");
    tableB = loadTable("data/companies_categories.csv", "csv", "header");
    img = loadImage("colorCode3.png"); 
    img2 = loadImage("diagram.png");
}


function setup() {
    var canvas = createCanvas(windowWidth, windowHeight);
    noStroke();
    //background(255,255,255);
    
    frameRate(30);
    textFont("Syntax");
    
    
    
    for (var r = 0; r < tableA.getRowCount(); r++) {
        var cname = tableA.getString(r, "company_name"); 
        var iname = tableA.getString(r, "investor_name");
        var invested = tableA.getString(r, "amount_usd");
        var time = tableA.getString(r, "funded_at");
        
        invested = parseInt(invested); 
        if (!isNaN(invested)) { 
            if (aggregated.hasOwnProperty(cname)) {
                aggregated[cname] = aggregated[cname] + invested; 

            } else {
                aggregated[cname] = invested;
            }

        }
        investorAggregated[iname] = time;

    }

    
    var aAggregated = [];
    Object.keys(aggregated).forEach(function (name) { 
        var company = {};
        company.name = name;
        company.sum = aggregated[name];
        aAggregated.push(company);
    });


    var investors = [];
    Object.keys(investorAggregated).forEach(function (name) { 
        
        var investor = {};
        investor.name = name;
        investors.push(investor);
    });
    //console.log(investors);
   
    
    aAggregated.sort(function (a, b) { 
        return b.sum - a.sum; 
    });

    
    aAggregated = aAggregated.slice(0, 100);
    //console.log(aAggregated);   
    
    for (var r = 0; r < tableA.getRowCount(); r++) { 
        var cname = tableA.getString(r, "company_name"); 
        var iname = tableA.getString(r, "investor_name");
        var invested = tableA.getString(r, "amount_usd");
        var time = tableA.getString(r,"funded_at");
        invested = parseInt(invested); 

        var foundCompany = aAggregated.find(function (element, index, array) {            
            return element.name == cname;        
        });               

        if (foundCompany) { 
            var foundInvestor = investors.find(function (element, index, array) {            
                return (element.name == iname);        
            });
            if (foundInvestor) {
                var connection = {};
                connection.company = foundCompany; 
                connection.investor = foundInvestor; 
                connection.amount = invested;
                connection.time = time;
                connections.push(connection);


            }

        }

    }
    
        sort(connections);
    connections.sort(function (a, b) { 
        return a.amount - b.amount; 
    });

//       connections.sort(function (a, b) { 
//        if(a.time > b.time) return 1;
//        else if(a.time == b.time) return 0;
//        else if(a.time < b.time) return -1;
//        //array.sort -- comparason function -- number, string, object
//        //return b.time - a.time; //sort desending order here   -- asending order a.sum - b.sum
//    });

    for (var i = 0; i < aAggregated.length; i++) {
        var p = new Particles(aAggregated[i].name, aAggregated[i].sum);
        companiesToDisplay.push(p);
        particleSystem.push(p);

    }
    //console.log(companiesToDisplay);



    
    for (var i = 0; i < connections.length; i++) {
        var p = new InvestorParticle(connections[i].investor.name, connections[i].amount, connections[i].time);
        //print(p);
        
        connections[i].investor = p;
        investorSystem.push(p);
       
    }
    
    
    console.log(connections);

 
    var at = new Attractor(createVector(width / 2, height / 2), 5);
    attractors.push(at);

    
}
// 求一个sum，然后用amount除以sum，得出百分比，360度百分百。 弧度，上一个弧度加当前弧度等于目前转了多少弧度。
function pieChart(diameter, data) {
 
  var lastAngle = 0;
  var angle = 0;
  for (var i = 0; i < data.length; i++) {
    var gray = map(i, 0, data.length, 0, 255);
    fill(gray, 0, 255);
    arc(width/2, height/2, diameter, diameter, lastAngle, lastAngle+radians(360*data[i].amount/sum)); //占的百分比 360是度 radians弧度
    lastAngle += radians(360*data[i].amount/sum); 
  }
}

function getInvestorParticle(investorName) {
    for (var i =0; i < investorSystem.length; i++){
        if (investorSystem[i].name == investorName){
            print(investorName);
            return investorSystem[i];
        }
    }
}

function Clickfunction()
{
    //("http://xuanzh.github.io/XuanZhang_FinalProject/");
}

function draw() {

    background(230,230,250);
    
    //background(255,255,255);
    //stroke(255);
    //pieChart(100, angles);
    pieChart(200, investorToDisplay);
    
    //image(img, 0, 0);
    image(img, 970, height/10, img.width/2.8, img.height/2.8);
    image(img2, 1010, height/5, img2.width/3.6, img2.height/3.6);
    
    fill(0, 102, 153);
    textSize(28);
    textAlign(LEFT);
    //text("FINDING INVESTORS", 50, 60);
    text("HOW FUNDING WORKS", 25, 65);
    textSize(18);
    
    text("The investments in different companies", 25, 90);
    textSize(10);
    text("Link address: http://xuanzh.github.io/XuanZhang_FinalProject/", 25, 115);
    textSize(14);
    fill(0, 102, 153, 80);
    text("Legend", 980, 70);
    text("Data Source: Crunchbase", 980, 550);
    text("Introduction", 25, 455);
    textSize(10);
    text("Xuan Zhang | ARTG 5330 Visualization Technologies | Pedro Cruz | 4/19/2015", 25, 25);
    textSize(11);
    
    text("This CrunchBase data provides information about companies,", 25, 490);
    text("products, people, investors and the activities that connect them.", 25, 505);
    
    text("This visualization is about how different kinds of companies", 25, 535);
    text("was invested from a lot of investors. and according to database, ", 25, 550);
    text("major categories of company, which was broadly divided into ", 25, 565);
    text("seven categories (as the legend 1 showed): Web, Cleantech,", 25, 580);
    text("Hospitality, Biotech, Nanotech, Mobile and others. ", 25, 595);
    text("Furthermore, the size of circle represented the exact amount", 25, 610);
    text("the corresponding company gained from different investors, ", 25, 625);
    text("and also in terms of all the investors’ investments, the investor’s ", 25, 640);
    text("sizes are also varying when you click a specific company (as the", 25, 655);
    text("legend 2 showed).", 25, 670);
    
    textSize(9);
    text("This is the “CrunchBase 2013 Snapshot” and was extracted from", 980, 580);
    text("CrunchBase at 2013-12-12 14:48:13 +0000. By using this data,", 980, 590);
    text("you agree to follow the CrunchBase Terms of Service and Privacy Policy.", 980, 600);
    text("License to this data is described in the Terms of Service section referencing", 980, 610);
    text("“Access to CrunchBase 2013 Snapshot”.", 980, 620);
    text("http://info.crunchbase.com/docs/terms-of-service/", 980, 630);
    text("http://info.crunchbase.com/docs/privacy-policy/", 980, 640);
    
    
    for (var STEP = 0; STEP < 3; STEP++) { 
        for (var i = 0; i < particleSystem.length - 1; i++) {
            for (var j = i + 1; j < particleSystem.length; j++) {
                var pa = particleSystem[i];
                var pb = particleSystem[j];
                var ab = p5.Vector.sub(pb.position, pa.position);
                var distSq = ab.magSq();
                if (distSq <= sq(pa.radius + pb.radius)) {
                    var dist = sqrt(distSq);
                    var overlap = (pa.radius + pb.radius) - dist;
                    ab.div(dist);
                    ab.mult(overlap * 0.5);
                    pb.position.add(ab);
                    ab.mult(-1);
                    pa.position.add(ab);
                    pa.vel.mult(0.97);
                    pb.vel.mult(0.97); // this line decrease the particle's velocity everytime the particle collision

                }
            }
        }
    }

    
    //draw particles for companies;
    companiesToDisplay.forEach(function(d){
        d.update();
        d.draw(); 
    })


    // draw particles for investors
    // 如果它不是零，让它每次清零一次
    if(sum != 0){
        sum = 0;
    }
    investorToDisplay.forEach(function(p){
        p.update();
        p.draw();
        sum += p.amount; //sum现在是amount
    });
    
    
    
    // draw pie chart 直径 100可调
   
   // console.log(investorToDisplay);
   

    //draw attractors for companies         
    attractors.forEach(function (at) {
        at.draw();
    });

   

}
//加了两个变量mpositionx and y， 这俩变量的xy就是pie chart对应的正中心的点。
// reset一遍position，希望点的位置固定，占pie chart的位置，重新给它一个位置。
function resetPos(data){
  var centerx = innerWidth/2;
  var centery = innerHeight/2;
  var lastAngle = 0;
  var angle = 0;
  for (var i = 0; i < data.length; i++) {
    //var gray = map(i, 0, data.length, 0, 255);
    //fill(gray, 0, 255);
    data.mpositionx = centerx + cos(angle-180*data[i].amount/sum) * 25;
    data.mpositiony = centery + sin(angle-180*data[i].amount/sum) * 25;
    angle += 360*data[i].amount/sum;
  }
}


function windowResized() {
    resizeCanvas(windowWidth, windowHeight);

}

//creat a mouse click event for companies

//class for drawing companies particles
var Particles = function (name, sum) {
    this.name = name;
    this.sum = sum;
    var R;
    var G;
    var B;

    var rowCat = tableB.findRow(this.name, "name");
    if (rowCat != null) {
        this.category = rowCat.get("category_code");
    } else {
        //print(this.name);
        this.category = "other";
    }

   switch(this.category){
        case "web":
            R = 37;
            G = 83;
            B = 89;   
            break;
        case "cleantech":
            R = 171;
            G = 59;
            B = 58;
            break;
        case "hospitality":
            R = 123;
            G = 144;
            B = 210;
            break;
        case "biotech":
            R = 232;
            G = 122;
            B = 144;
            break;
        case "nanotech":
            R = 120;
            G = 194;
            B = 196;
            break;
        case "mobile":
            R = 178;
            G = 143;
            B = 206;
            break;
        default: 
            R = 221;
            G = 210;
            B = 59;
    }
    

    var isMouseOver = false;


    this.radius = sqrt(sum) / 4000;


    var initialRadius = this.radius;
    var maxR = 70;


    var tempAng = random(TWO_PI);
    this.position = createVector(cos(tempAng), sin(tempAng));
    this.position.div(this.radius); //try to put bigger one near to the center --> if the radius is high the posistion is lower
    this.position.mult(1000);
    this.position.set(this.position.x + width / 2, this.position.y + height / 2); //create initial position and make it center. 
    this.vel = createVector(0, 0);
    var acc = createVector(0, 0);

    this.update = function () {
        checkMouse(this);

        attractors.forEach(function (A) {
            var att = p5.Vector.sub(A.getPos(), this.position); //if did not put this after the function(A), this here means A// 
            var distanceSq = att.magSq();
            if (distanceSq > 10) {
                att.normalize()
                att.div(10);
                acc.add(att);
            }
        }, this);
        this.vel.add(acc); //should add this.acceleration here! if use this.velocity here, the same with velocity
        this.position.add(this.vel);
        acc.mult(0); //reset the acceraltion      

    }



    this.draw = function () {

        noStroke();
        if (isMouseOver) {
            fill(225, 225, 225);
        } else {
            fill(R, G, B);

        }

        ellipse(this.position.x, this.position.y, this.radius * 2, this.radius * 2);

        if (this.radius == maxR) {

            fill(0, 0, 0);
            textSize(9);
            textAlign(CENTER);
            text(this.name, this.position.x, this.position.y);
            text("$" + nfc(this.sum), this.position.x, this.position.y + 16);
            text(this.category, this.position.x, this.position.y + 32);
        }
    }



    function checkMouse(instance) { // this is a pravite function inside of particles function, 'this' is nor work here
        var mousePos = createVector(mouseX, mouseY);
        if (mousePos.dist(instance.position) <= instance.radius) {
            incRadius(instance);
            isMouseOver = true;
        } else {
            decRadius(instance);
            isMouseOver = false;
        }
    }


    function incRadius(instance) {
        instance.radius += 4;
        if (instance.radius > maxR) {
            instance.radius = maxR;
        }
    }


    function decRadius(instance) {
        instance.radius -= 4;
        if (instance.radius < initialRadius) {
            instance.radius = initialRadius;
        }
    }

    this.getMouseOver = function () {
        return isMouseOver;
    }
}


//class for drawing investor 
var InvestorParticle = function (name, amount, time) {

    this.name = name;
    this.amount = amount;
    this.time = time;
    this.rank = 0;
    var isMouseOver = false;
    
    var mpositionx = innerWidth/2;
    var mpositiony = innerHeight/2;
    
    var investorRadius = sqrt(amount)/600;


    var tempAng = 0;

    this.pos = createVector(cos(tempAng), sin(tempAng));


    this.update = function () {
        checkMouse(this);
        //drawline();
        resetPos(investorToDisplay);
    }



    this.draw = function (a) {
       //console.log(rank);
        noStroke();
        if(this.rank == 1){
            fill(255,0,0); //fill the company color.
        }else if(this.rank == 0){
            fill(0,255,10);
        }
        ellipse(this.pos.x, this.pos.y, investorRadius, investorRadius);
        
         fill(0, 0, 0);
         textAlign(CENTER);
         textSize(9);
         text(name, this.pos.x, this.pos.y + investorRadius);
         text("$" + nfc(amount), this.pos.x, this.pos.y + investorRadius + 15);
         text(time, this.pos.x, this.pos.y + investorRadius + 30);
        stroke(200);
        fill(255,20,20);
        // line(1,10,200,200);
        
        
        if(isMouseOver){
            //line(innerWidth/2,innerHeight/2,this.pos.x,this.pos.y);
            line(mpositionx,mpositiony,this.pos.x,this.pos.y);
            //console.log(mpositionx+ "+" + mpositiony);
        }
    }


    this.getRadius = function () {
        return investorRadius; //strength here is a variable.
    }
    
    function checkMouse(instance) { // this is a pravite function inside of particles function, 'this' is nor work here
        var mousePos = createVector(mouseX, mouseY);
        if (mousePos.dist(instance.pos) <= instance.getRadius()) {
            isMouseOver = true;
        } else {
            isMouseOver = false;
        }
    }
    
    
};


function mouseClicked() {
    
    var mousePos = createVector(mouseX, mouseY);
    console.log(mousePos);
    if((mousePos.x>85)&&(mousePos.x<300)&&(mousePos.y>106)&&(mousePos.y<120))
        {
            Clickfunction();
        }
    
    var particleClikced = null;
    
    for (var i = 0; i < particleSystem.length; i++) {
         var particle = particleSystem[i];
         if(particle.getMouseOver()){
            particleClikced = particle;
            }
    }
    
        connections.sort(function (a, b) { 
        //console.log(a);
        return b.amount - a.amount; 
    });
    
    connections.forEach(function(a){
        //console.log(a.amount);         
    });
    
    
    if(particleClikced != null){
        
      
        investorToDisplay = [];
        companiesToDisplay = [];
        //connectionsDisplay = [];
        
        companiesToDisplay.push(particleClikced);
        
        var cname = particleClikced.name;
        
        connections.forEach(function(c){
            
            if(cname == c.company.name){
               
                var iname = c.investor.name;
                var iparticle = getInvestorParticle(iname);
               
          
                var foundInvestor = investorToDisplay.find(function (element) {
                    if (element == iparticle) return true;
                    else return false;
                });
                
                if(!foundInvestor){
                    investorToDisplay.push(iparticle);
                }
                
            }
        });
        

    
        var ang = 0;
        var i = 0;
        investorToDisplay.sort(function (a, b) { 
            return b.amount - a.amount; 
        });

        investorToDisplay.forEach(function(p){
            if(p.amount < investorToDisplay[2].amount){
                p.rank = 1;
            }else{
                p.rank = 0;
            }
            
            p.pos.x = width/2 + cos(ang) * 230;
            p.pos.y = height/2 + sin(ang) * 230;
            ang += TWO_PI/investorToDisplay.length;
    //        p.update;
    //        p.changecolor();
           console.log(p.rank);
        });

    

        }else{
        investorToDisplay = [];
        companiesToDisplay = [];
        
        particleSystem.forEach(function(p){
            companiesToDisplay.push(p);
        });
    }
}

var Attractor = function (position, s) {
    var pos = position.copy();
    var strength = s;

    this.draw = function () {
        noStroke();
        fill(0, 0, 0, 0);
        ellipse(pos.x, pos.y, strength, strength);
    }

    this.getStrength = function () {
        return strength; //strength here is a variable.
    }

    this.getPos = function () {
        return pos.copy();
    }
};