function random(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
function get_element_noron_id(id) {
    for (let kat of this.katmanlar) {
        for (let i of kat.children) {

            if (i.getAttribute("noron_id") == id) {
                return i;
            }
        }
    }
    return 0
}

class arayuz_MODEL{
    constructor(model,div){
        this.model=model;
        this.div=div;
        this.enbuyuklength = 0;
        this.id = random(-555,555).toString() +  random(-555,555).toString()+ random(-555,555).toString();
        div.className+= " model"
        this.katmanlar=[];


        this.hersey();
        this.agirliklari_Yansit();
    }
    hersey() {
        this.div.innerHTML = '      <canvas class="model_arka" id="' + this.id + '" stroke="red"></canvas><canvas id="' +this.id + '2"   class="model_arka2" stroke="red"></canvas>';
       
    
        for (let i of this.model.katmanlar) {
    
            if (i.zler.length > 10) {
                this.enbuyuklength = 10;
                break;
            }
            if (i.zler.length > this.enbuyuklength) {
                this.enbuyuklength = i.zler.length
            }
        }
        var katman_divler = [];
        let eskihtml = ""
        for (let kj = 0; kj < this.model.katmanlar.length; kj++) {
            let i = this.model.katmanlar[kj];
            let katman_div = document.createElement("div");
    
            katman_div.className = "katman";
            if (i.zler.length < 11) {
                for (let a = 0; a < i.zler.length; a++) {
                    let noron_div = document.createElement("div");
                    noron_div.className = "noron";
    
                    noron_div.innerHTML = i.zler[a].toString().substring(0, 5);
    
    
                    let renk = 255 - ((i.zler[a] * 255));
                    let frenk = 255 - (255 - ((i.zler[a] * 255)))
                    if (i.zler[a] > 0.3 && i.zler[a] < 0.7) {
                        frenk = 255
                    }
                    noron_div.style.backgroundColor = "rgb(" + renk.toString() + "," + renk.toString() + "," + renk.toString() + ")";
                    noron_div.style.color = "rgb(" + frenk.toString() + "," + frenk.toString() + "," + frenk.toString() + ")";
                    noron_div.id = a;
                    //    noron_div.setAttribute("noron_id", i[a].id);
    
                    katman_div.appendChild(noron_div);
                }
            } else {
                for (let a = 0; a < 11; a++) {
                    if (a == 10) {
                        let yuvarlak = document.createElement("div");
                        yuvarlak.className = "nokta";
                        yuvarlak.innerHTML = "+" + (i.zler.length - 10)
                        katman_div.appendChild(yuvarlak);
    
                    } else {
                        let noron_div = document.createElement("div");
                        noron_div.className = "noron";
                        noron_div.innerHTML = i.zler[a].toString().substring(0, 5);
                        let renk = 255 - ((i.zler[a] * 255));
                        let frenk = 255 - (255 - ((i.zler[a] * 255)))
                        if (i.zler[a] > 0.3 && i.zler[a] < 0.7) {
                            frenk = 255
                        }
    
                        noron_div.style.backgroundColor = "rgb(" + renk.toString() + "," + renk.toString() + "," + renk.toString() + ")";
                        noron_div.style.color = "rgb(" + frenk.toString() + "," + frenk.toString() + "," + frenk.toString() + ")";
                        noron_div.id = a;
    
                        //   noron_div.setAttribute("noron_id", i[a].id);
    
                        katman_div.appendChild(noron_div);
                    }
    
                }
            }
            let span = document.createElement("span");
    
            if (kj == 0) {
                span.innerText = "Giriş Katmanı"
            }
            if (kj != 0 && kj != this.model.katmanlar.length) {
                span.innerText = "Ara Katman"
            }
            if (kj == this.model.katmanlar.length - 1) {
                span.innerText = "Çıkış Katmanı\n (Model Çıktısı)"
            }
            let enbuyuk_width = this.enbuyuklength * 50
            let padding = (enbuyuk_width - (i.zler.length * 50)) / 2
            katman_div.appendChild(span)
            katman_div.style.paddingTop = padding.toString() + "px";
            this.div.appendChild(katman_div)
            this.katmanlar.push(katman_div);
            katman_divler.push(katman_div);
        }
        eskihtml = this.div.innerHTML;
    }
    
    agirliklari_Yansit() {
        for (let i = 0; i < this.katmanlar.length; i++) {
            for (let nor of this.katmanlar[i].children) {
                if (nor.id != "") {
                    nor.innerHTML = this.model.katmanlar[i].zler[parseInt(nor.id)].toString().substring(0, 5);
                }
            }
        }
        document.getElementById(this.id).setAttribute("width", (this.div.offsetWidth - 20) + "px");
        document.getElementById(this.id).setAttribute("height", (this.div.offsetHeight + 200) + "px");
        var c = document.getElementById(this.id);
        var ctx = c.getContext("2d");
    
        for (let kj = 0; kj < this.katmanlar.length - 1; kj++) {
            let katman = this.katmanlar[kj];
            let skatman = this.katmanlar[kj + 1];
            for (let nor of katman.children) {
                if (nor.id != "") {
                    let z = parseFloat(nor.innerHTML);
                    let renk = 255 - ((z * 255));
                    let frenk = 255 - (255 - ((z * 255)))
                    if (z > 0.3 && z < 0.7) {
                        frenk = 255
                    }
                    nor.style.backgroundColor = "rgb(" + renk.toString() + "," + renk.toString() + "," + renk.toString() + ")";
                    nor.style.color = "rgb(" + frenk.toString() + "," + frenk.toString() + "," + frenk.toString() + ")";
                    for (let snor of skatman.children) {
                        if (snor.id != "") {
    
                            let rect = nor.getBoundingClientRect();
                            let rect2 = snor.getBoundingClientRect();
                            ctx.beginPath();
                            let derece = this.model.katmanlar[kj + 1].agirliklar[parseInt(snor.id)][parseInt(nor.id)] * 255;
                            ctx.lineWidth = 2 + ((derece / 255) * 2);
                            //ctx.lineWidth = 3;
                            if (derece < 0) {
                                ctx.strokeStyle = "rgba(" + 255 + ",0,0," + (Math.abs(derece) / 255) + ")"
                            } else {
                                ctx.strokeStyle = "rgba(0," + 255 + ",0," + (Math.abs(derece) / 255) + ")"
                            }
                            /*
                                noron_div.style.backgroundColor = "rgb(" + renk.toString() + "," + renk.toString() + "," + renk.toString() + ")";
                                noron_div.style.color = "rgb(" + frenk.toString() + "," + frenk.toString() + "," + frenk.toString() + ")";
                  
                            */
                            ctx.moveTo(nor.offsetLeft, nor.offsetTop + 100);
    
                            ctx.lineTo(snor.offsetLeft, snor.offsetTop + 100);
    
                            ctx.stroke();
                            ctx.closePath();
    
                        }
                    }
                }
            }
        }
    }
}