function _(elmnt){return document.getElementById(elmnt)}

let canvas = _("canvas");
let ctx = canvas.getContext("2d")

const environment ={
    baza : {
        height  :   15,
        width   :   800,
        coord_X :   (canvas.width-800)/2,
        coord_Y :   (canvas.height-50),
    },
    stick : {
        height  :   (canvas.height-75)-50,
        width   :   7,
        coord_Y :   75,
        coord_X :   200,
    },
    area : {
        width   :   210,
        height  :   (canvas.height-75)-80,
    },
    difference_width_between_bricks : null, 
}

let game;

class TDH{

    
    // daca pui # sugereaza ca var/functia este privata altfel fara inseamna public

    M       = [];
    area    = [];
    brick   = [];
    color  = [];
    noBricks = null;
    coada = "";

    constructor(Bricks){
       
        environment.difference_width_between_bricks = 30;

        this.noBricks = Number(Bricks);
        this.#Environmet();
        this.#DefinireaZonelorBetelor();
        this.#InitializareaMatricei();
        this.#DefinireaDimensiunilorCaramizilor();
        this.AfisareaMatricei();

        _('noMinimMiscari').textContent = Math.pow(2,this.noBricks)-1;
       
    }

    #Environmet(){
        ctx.fillStyle = 'black';
        ctx.fillRect(environment.baza.coord_X, environment.baza.coord_Y, environment.baza.width , environment.baza.height); // creaza baza
        for(let i=1; i<=3; i++){
            ctx.fillRect(environment.baza.coord_X+environment.stick.coord_X*i-Math.floor(environment.stick.width/2), environment.stick.coord_Y , environment.stick.width , environment.stick.height);
        }   // pune betele

      
    }

    #InitializareaMatricei(){
        for(let i=0; i<=this.noBricks+1; i++){
            this.M[i]=[];
        }
        for(let j=1; j<=3; j++){
            for(let i=0; i<=this.noBricks+1; i++){
                if(j==1){
                    this.M[i][j] = i;
                }else if(i==this.noBricks+1){
                    this.M[i][j] = 10;
                }
                else{
                    this.M[i][j] = 0;
                }
            }
        }    

        //MATRICEA DE CULORI
        this.color[1] = 'red';
        this.color[2] = 'orange';
        this.color[3] = 'yellow';
        this.color[4] = 'green';
        this.color[5] = 'blue';
        this.color[6] = 'cyan';
    }

    #DefinireaZonelorBetelor(){
        for(let i=1; i<=3; i++){
            this.area[i]={
                xBegins : environment.baza.coord_X+environment.stick.coord_X*i-Math.floor(environment.stick.width/2)-environment.area.width/2,
                xEnds : environment.baza.coord_X+environment.stick.coord_X*i-Math.floor(environment.stick.width/2)-environment.area.width/2 +environment.area.width,
                yBegins : environment.stick.coord_Y + 30, 
                yEnds : environment.stick.coord_Y+environment.stick.height,
            }
        }

    }

    #DefinireaDimensiunilorCaramizilor(){

        if(this.noBricks<5)environment.difference_width_between_bricks+=20;
        for(let i=1; i<=this.noBricks; i++){
            this.brick[i]={
                height : Math.ceil(environment.area.height/this.noBricks),
                width : environment.area.width-(this.noBricks-i)*environment.difference_width_between_bricks,
            }
        }
    }

    async AfisareaMatricei(){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.#Environmet();
        for(let j=1; j<=3; j++){
            for(let i=1; i<=this.noBricks; i++){
                if(this.M[i][j]>0){
                    ctx.fillStyle = this.color[this.noBricks-this.M[i][j]+1];
                    ctx.fillRect(this.area[j].xBegins+Math.floor(environment.difference_width_between_bricks/2)*(this.noBricks-this.M[i][j])+Math.floor(environment.stick.width/2)
                    , this.area[j].yBegins+(i-1)*this.brick[1].height , this.brick[this.M[i][j]].width ,this.brick[this.M[i][j]].height);
                }
            }
        }
        return 1;
    }



    //n reprezinta nr de brickuri pe care vreau sa le mut de pe pozitia/batul start pe pozitia/batul end
    AlgoritmHanoi(n,start,end){
        
        if(n==1){ // cazul de baza
            this.coada+=(start.toString() + end.toString());
        }
        else{
            let batIntermediar = 6 - start - end; // !!! batul intermediar se modifica de fiecare data in functie de unde ma aflu si unde vr sa ajung

            this.AlgoritmHanoi(n-1,start,batIntermediar); 
            /*
                ca sa mut cel de-al n-lea brick pe pozitia batului 'end' trebuie defapt sa mut cele n-1 brickuri de deasupra lui pe batul intermediar
                si tot asa pana ajung sa mut un brick -> intru pe cazul de baza 

            */
                this.coada += (start.toString() + end.toString());
            /*
                dupa ce s-au mutat toate brickuri din recursivitatea de mai sus se executa miscarea dorita, adica mutarea brick ului n pe batul 'end'
            */
            this.AlgoritmHanoi(n-1,batIntermediar,end)
            /*
                apoi trebuie sa mut brick urile de pe batul intermediar pe cel final 
            */
        }
    }

    //mutarea primului brick de pe batul 'from' catre batul 'to'
    MutareBrick(from,to){
        let a;
        for(let i=1; i<=this.noBricks; i++){
            if(this.M[i][from]!=0){
                a =  this.M[i][from];
                this.M[i][from] = 0;
                break;
            }
        }
      
        for(let i=1; i<=this.noBricks+1; i++){
            if(this.M[i][to]!=0){
                this.M[i-1][to] = a;
                break;
            }
        }  
        this.AfisareaMatricei();    
    }
}

window.addEventListener('load',()=>{
    game = new TDH(3);      
})

let mouse = {
    coordX : undefined,
    coordY : undefined,
    drag : false,
    clickedBrick : null,
}

_('canvas').addEventListener('mousedown',(e)=>{
    if(e.offsetY>=game.area[1].yBegins && e.offsetY<=game.area[1].yEnds){
        for(let i=1; i<=3; i++){
            if(e.offsetX>=game.area[i].xBegins && e.offsetX<=game.area[i].xEnds){

                let x = e.offsetX-game.area[i].xBegins; 
                let y = e.offsetY-game.area[i].yBegins;

                //console.log('esti pe zona',i)

                for(let j=1; j<=game.noBricks; j++){
                    if(game.M[j][i]!=0){
                        if((y>=game.brick[1].height* (j-1)) && (y<=game.brick[1].height*j)){
                            if((x>=Math.floor(environment.difference_width_between_bricks/2)*(game.noBricks-game.M[j][i])) 
                            && (x<=Math.floor(environment.difference_width_between_bricks/2)*(game.noBricks-game.M[j][i])+game.brick[game.M[j][i]].width)){
                                if(game.M[j-1][i]==0){
                                    console.log('poti sa misti caramida')
                                    mouse.clickedBrick = game.M[j][i];
                                    mouse.coordX = x - Math.floor(environment.difference_width_between_bricks/2)*(game.noBricks-game.M[j][i]);
                                    mouse.coordY = y - game.brick[1].height* (j-1);
                                    game.M[j][i] = -1;
                                    mouse.drag = true;
                                }  
                            }
                        }
                    }
                }
            }
        }
    }
})

window.onmouseup = (e)=>{

    let BrickPlaced = false;
    if(mouse.drag){
        
        for(let i=1; i<=3; i++){
            if(e.offsetX>=game.area[i].xBegins && e.offsetX<=game.area[i].xEnds){
                for(let j=1; j<=game.noBricks; j++){
                    if(game.M[j][i]==0 && game.M[j+1][i]>mouse.clickedBrick){
                        game.M[j][i]=mouse.clickedBrick;
                        BrickPlaced = true;
                        _('contor').textContent++
                    }
                }
            }
        }

        for(let j=1; j<=3; j++){
            for(let i=1; i<=game.noBricks; i++){
                if(game.M[i][j]==-1){
                    if(BrickPlaced){
                        game.M[i][j] = 0;
                    }
                    else {
                        game.M[i][j] = mouse.clickedBrick;
                    }
                }
            }
        }
    }
    
    game.AfisareaMatricei().then(
        (value)=>{
            if(value==1 && game.M[1][3]==1){ 
                setTimeout(function(){alert("Game Over");restart();},200);
            }
        },
    )

    /*
    if(this.M[1][3]==1){
        alert("Game Over");
        restart();
    }
   */
    mouse.drag=false;
}

_('canvas').onmousemove = (e)=>{

    let x = e.offsetX - mouse.coordX;
    let y = e.offsetY - mouse.coordY;

    if(mouse.drag){
        //ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.AfisareaMatricei();
        ctx.fillStyle = game.color[game.noBricks+1-mouse.clickedBrick]
        ctx.fillRect(x,y, game.brick[mouse.clickedBrick].width ,game.brick[mouse.clickedBrick].height);  
    }
}


function restart(){
    _('contor').textContent=0;
    var e = _("id-select");
    var value = e.value; 
    game = null;
    game = new TDH(value);
}

_('id-select').oninput = ()=>{
    restart();
}
_('instructiuni').onclick= ()=>{

    let s = "Incearca sa muti discurile de TURNUL 1 pe TURNUL 3\n";
    s += "Nu este permis sa pui un mare peste unul mai mic "; 

    alert(s);
}
_('restart').onclick = ()=>{
    restart();
}
_('rezolva').onclick = ()=>{

    let res; 
    if(game.M[1][1]!=1){
         res = confirm("Se va renunta la jocul curent, doriti sa continuati?");
         restart();
    }
    else res = 1;

    if(res){

        _('id-select').disabled = true;

        _('restart').disabled = _('instructiuni').disabled = _('rezolva').disabled = true;
        game.AlgoritmHanoi(game.noBricks,1,3);

        var i = 0, j=1;
        const myInterval=setInterval(function(){
            let x = game.coada[i];
            i = i+2;
            let y = game.coada[j];
            j = j+2;
            if(game.coada.length<i-1){
                clearInterval(myInterval);
                alert("Rezolvare terminata!");
                _('restart').disabled = _('instructiuni').disabled = _('rezolva').disabled =   _('id-select').disabled = false;
                restart();
            }   
            game.MutareBrick(x,y);
        },400)
    }
}   
