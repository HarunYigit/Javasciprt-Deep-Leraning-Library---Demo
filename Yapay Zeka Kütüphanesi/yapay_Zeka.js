function random(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
}

function sigmoid_turev(y) {
    return y * (1.0 - y);
}

function get_random_() {
    let df = 0;
    while (df == 0) {
        df = random(-4, 4) / 10;
    }
    return df;
}

class katman {
    constructor(boyut) {
        this.zler = Array(boyut);
        this.deltalar = Array(boyut)
        this.bler = [];
        this.agirliklar = [];
        for (let i = 0; i < boyut; i++) {

            this.bler.push(get_random_());
        }
    }
}
class Tek_cikisli_perceptron {
    constructor(katmans, labda = 0.6) {
        this.katmanlar = [];
        this.katmans = katmans;
        this.agirliklar = {};
        this.labda = labda;
        this.loss = 0;

        this.bler = [];
        let bler_boyut = 0;
        let onceki = -1;
        for (let boyut of katmans) {
            let kat = new katman(boyut);
            if (onceki != -1) {
                for (let i = 0; i < boyut; i++) {
                    let ggg = [];
                    for (let p = 0; p < onceki.zler.length; p++) {
                        ggg.push(get_random_());
                    }
                    kat.agirliklar.push(ggg)
                }
            }
            onceki = kat;

            this.katmanlar.push(kat);
        }
        this.bler = Array(bler_boyut)
    }

    disa_aktar() {
        // labda 0.8
        // katmanlar : 1,16,5,1
        // zler:0.5,0.4,0.6,..,0.4
        // agirliklar 0.5,0.4,0.6,..,0.4
        // bler 0.5,0.4,0.6,..,0.4
        // deltalar 0.5,0.4,0.6,..,0.4
        let yazilicak = "";
        yazilicak += this.labda.toString() + "&";
        for (let i of this.katmans) {
            yazilicak += i.toString() + ","
        }
        yazilicak = yazilicak.substring(0, yazilicak.length - 1) + "&"
        try {
            for (let i of this.katmanlar) {
                for (let p of i.zler) {
                    yazilicak += p.toString() + ","
                }
            }
        }
        catch (exp) {
            console.log("HATA: model daha önce fit edilmemiş.")
            return -1;
        }
        yazilicak = yazilicak.substring(0, yazilicak.length - 1) + "&"
        for (let i of this.katmanlar) {
            for (let p of i.bler) {
                yazilicak += p.toString() + ","

            }
        }

        yazilicak = yazilicak.substring(0, yazilicak.length - 1) + "&"

        for (let i of this.katmanlar) {
            for (let o of i.agirliklar) {
                for (let p of o) {
                    yazilicak += p.toString() + ","
                }
            }
        }

        yazilicak = yazilicak.substring(0, yazilicak.length - 1) + "&";

        for (let i of this.katmanlar) {
            for (let p of i.deltalar) {
                yazilicak += p.toString() + ","

            }
        }
        yazilicak = yazilicak.substring(0, yazilicak.length - 1)
        return yazilicak;
    }
    ice_aktar(metin) {

        // labda 0.8
        // katmanlar : 1,16,5,1
        // zler:0.5,0.4,0.6,..,0.4
        // agirliklar 0.5,0.4,0.6,..,0.4
        // bler 0.5,0.4,0.6,..,0.4
        // deltalar 0.5,0.4,0.6,..,0.4f
        let indpp = 0;
        for (let i of metin.split("&")) {
            if (indpp == 0) {
                this.labda = parseFloat(i);
            }
            else if (indpp == 1) {
                let katmanlar = [];
                for (let p of i.split(",")) {
                    katmanlar.push(parseInt(p));
                }
                this.katmans = katmanlar;

            }
            else if (indpp == 2) {
                let xler = [];
                for (let p of i.split(",")) {
                    xler.push(parseFloat(p));
                }
                let ind = 0;
                for (let p = 0; p < this.katmanlar.length; p++) {
                    for (let a = 0; a < this.katmanlar[p].zler.length; a++) {
                        this.katmanlar[p].zler[a] = xler[ind];
                        ind++;
                    }
                }
            }

            else if (indpp == 3) {
                let bler = [];
                for (let p of i.split(",")) {
                    bler.push(parseFloat(p));
                }
                let ind = 0;
                for (let p = 0; p < this.katmanlar.length; p++) {
                    for (let a = 0; a < this.katmanlar[p].bler.length; a++) {
                        this.katmanlar[p].bler[a] = bler[ind];
                        ind++;
                    }
                }
            }
            else if (indpp == 4) {
                let agirliklar = [];
                for (let p of i.split(",")) {
                    agirliklar.push(parseFloat(p));
                }
                let ind = 0;
                for (let p = 1; p < this.katmanlar.length; p++) {
                    for (let a = 0; a < this.katmanlar[p].agirliklar.length; a++) {
                        for (let g = 0; g < this.katmanlar[p - 1].zler.length; g++) {
                            this.katmanlar[p].agirliklar[a][g] = agirliklar[ind];
                            ind++;
                        }

                    }
                }
            } else if (indpp == 5) {
                let deltalar = [];
                for (let p of i.split(",")) {
                    deltalar.push(parseFloat(p));
                }
                let ind = 0;
                for (let p = 0; p < this.katmanlar.length; p++) {
                    for (let a = 0; a < this.katmanlar[p].deltalar.length; a++) {
                        this.katmanlar[p].deltalar[a] = deltalar[ind];
                        ind++;
                    }
                }
            }
            indpp++;
        }
    }
    get_activ(xler, agirliklar, b) {
        let g = xler.map(function (x, index) {
            return agirliklar[index] * x
        })
        let toplam = g.reduce((toplam, x) => toplam + x) + b
        return sigmoid(toplam)
    }


    cikis_katmani() {
        return this.katmanlar[this.katmanlar.length - 1];
    }

    set_data(x) {
        this.katmanlar[0].zler = x.concat();
        let i = 0;
        while (i < this.katmanlar.length - 1) {
            let p = 0;
            while (p < this.katmanlar[i + 1].zler.length) {
                this.katmanlar[i + 1].zler[p] = this.get_activ(this.katmanlar[i].zler, this.katmanlar[i + 1].agirliklar[p], this.katmanlar[i + 1].bler[p])
                p++;
            }
            i++;
        }
    }

    predict(x) {
        this.set_data(x);
        return this.cikis_katmani().zler[0]
    }
    epoch(xler, yler) {
        let ghghgh = 0;
        while (ghghgh < xler.length) {
            let x = xler[ghghgh];
            let y = yler[ghghgh];
            this.predict(x);

            let h = this.cikis_katmani().zler[0];
            let delta = sigmoid_turev(h) * (h - y);
            this.katmanlar[this.katmanlar.length - 1].deltalar[0] = delta;
            let g = this.katmanlar.length - 2;
            while (g > -1) {
                let deltalar = this.katmanlar[g + 1].deltalar
                let sonraki_kat = this.katmanlar[g + 1]
                let katman = this.katmanlar[g]
                this.katmanlar[g].deltalar = this.katmanlar[g].zler.map(function (x1, index1) {
                    return sonraki_kat.agirliklar.map(function (x, index) { return x[index1] * deltalar[index] }).reduce((toplam, x) => toplam + x) * sigmoid_turev(katman.zler[index1]);
                });
                g--;
            }
            let i = 1;
            while (i < this.katmanlar.length) {
                let deltalar = this.katmanlar[i].deltalar;
                let labda = this.labda;
                let katmanlar = this.katmanlar
                let degisimler = deltalar.map(function (x, index) {
                    return katmanlar[i - 1].zler.map(function (x1, index) {
                        return x * x1 * labda;
                    });
                });
                let ddfg = this.katmanlar[i].agirliklar.map(function (x, index1) {
                    return x.map(function (x, index) {
                        return x - degisimler[index1][index];
                    });
                });
                this.katmanlar[i].agirliklar = ddfg.concat();
                this.katmanlar[i].bler = this.katmanlar[i].bler.map(function (x, index) { return x - (deltalar[index] * labda) })
                /*   for (let p = 0; p < this.katmanlar[i].zler.length; p++) {
   
                       let delta = this.katmanlar[i].deltalar[p];
                       let labda = this.labda;
                       let degisimler = this.katmanlar[i - 1].zler.map(function (x, index) {
                           return delta * x * labda;
                       });
                       let ddfg = this.katmanlar[i].agirliklar[p].map(function (x, index) {
                           return x - degisimler[index];
                       });
                       this.katmanlar[i].agirliklar[p] = ddfg.concat();
                       this.katmanlar[i].bler[p] -= this.labda * delta;
                   }
                   console.log(this.katmanlar[i].agirliklar)*/
                i++;
            }
            ghghgh++;
        }
    }
    score(xler, yler) {
        let dogrular = 0;
        let ghghgh = 0;
        while (ghghgh < xler.length) {
            let sonuc = this.predict(xler[ghghgh]);
            dogrular += 1 - (Math.abs(sonuc - yler[ghghgh]));
            ghghgh++;
        }
        return dogrular / xler.length;
    }


    toplam_noron() {
        let toplam = 0;
        for (let i of this.katmanlar) {
            toplam += i.zler.length;
        }
        return toplam
    }
    fit(xler, yler) {
        if (xler == undefined || yler == undefined) {
            console.log("Xler veya Yler tanımlanmamış");
        } else {
            var startTime = performance.now()
            let eskiskor = 0;
            let i = 0;
            let og = Math.min(parseInt(this.toplam_noron() * 150), 9980)
            while (i < 10000 - og) {
                this.epoch(xler, yler);
                if (i % 100 == 0) {
                    let skor = this.score(xler, yler)
                    if (skor < eskiskor) {
                        break;
                    }
                }
                i++;
            }
            var endTime = performance.now()
            console.log(`İşlem şu kadar sürdü: ${endTime - startTime} milisaniye`)
            console.log("Epoch 1 işlemi tamamlandı model skoru:", this.score(xler, yler));
        }
    }
}
class Siniflandirici {
    constructor(katmans, labda = 0.6, degerler) {
        this.katmanlar = [];

        this.agirliklar = {};
        this.labda = labda;
        this.loss = 0;
        this.degerler = degerler;
        this.bler = [];
        let bler_boyut = 0;
        let onceki = -1;
        for (let boyut of katmans) {
            let kat = new katman(boyut);
            if (onceki != -1) {
                for (let i = 0; i < boyut; i++) {
                    let ggg = [];
                    for (let p = 0; p < onceki.zler.length; p++) {
                        ggg.push(get_random_());
                    }
                    kat.agirliklar.push(ggg)
                }
            }
            onceki = kat;

            this.katmanlar.push(kat);
        }
        this.bler = Array(bler_boyut)

    }
    get_activ(xler, agirliklar, b) {
        let g = xler.map(function (x, index) {
            return agirliklar[index] * x
        })
        let toplam = g.reduce((toplam, x) => toplam + x) + b
        return sigmoid(toplam)
    }


    cikis_katmani() {
        return this.katmanlar[this.katmanlar.length - 1];
    }

    set_data(x) {
        this.katmanlar[0].zler = x.concat();
        let i = 0;
        while (i < this.katmanlar.length - 1) {
            let katman = this.katmanlar[i];
            let skatman = this.katmanlar[i + 1];
            let p = 0;
            while (p < skatman.zler.length) {
                this.katmanlar[i + 1].zler[p] = this.get_activ(katman.zler, skatman.agirliklar[p], skatman.bler[p]);
                p++
            }

            i++
        }
    }

    predict(x) {
        this.set_data(x);
        return this.degerler[this.cikis_katmani().zler.indexOf(Math.max(...this.cikis_katmani().zler))];
    }
    epoch(xler, yler) {
        let ghghgh = 0;
        while (ghghgh < xler.length) {
            let x = xler[ghghgh];
            let y = yler[ghghgh];
            this.predict(x);
            let degerler = this.degerler;
            let zler = this.cikis_katmani().zler;
            let i = 0;
            while (i < this.cikis_katmani().zler.length) {
                let h = this.cikis_katmani().zler[i];
                let istenen = 0;
                if (y == this.degerler[i]) {
                    istenen = 1;
                }
                let delta = sigmoid_turev(h) * (h - istenen);
                this.katmanlar[this.katmanlar.length - 1].deltalar[i] = delta;
                i++;
            }


            /* let dg=this.katmanlar[this.katmanlar.length - 1].deltalar.map(function (x,index){
                let y=0;
                 if(degerler[index] ==y){
                  y=1;
                }
                return sigmoid_turev(zler[index]) * (zler[index] - y)
             })*/
            let g = this.katmanlar.length - 2;
            while (g > -1) {
                let deltalar = this.katmanlar[g + 1].deltalar
                let sonraki_kat = this.katmanlar[g + 1]
                let katman = this.katmanlar[g]

                this.katmanlar[g].deltalar = this.katmanlar[g].zler.map(function (x1, index1) {

                    return sonraki_kat.agirliklar.map(function (x, index) { return x[index1] * deltalar[index] }).reduce((toplam, x) => toplam + x) * sigmoid_turev(katman.zler[index1]);

                });
                g--
            }
            i = 1;
            while (i < this.katmanlar.length) {
                let deltalar = this.katmanlar[i].deltalar;
                let labda = this.labda;
                let katmanlar = this.katmanlar
                let degisimler = deltalar.map(function (x, index) {
                    return katmanlar[i - 1].zler.map(function (x1, index) {
                        return x * x1 * labda;
                    });
                });

                let ddfg = this.katmanlar[i].agirliklar.map(function (x, index1) {
                    return x.map(function (x, index) {
                        return x - degisimler[index1][index];
                    });
                });


                this.katmanlar[i].agirliklar = ddfg.concat();
                this.katmanlar[i].bler = this.katmanlar[i].bler.map(function (x, index) { return x - (deltalar[index] * labda) })


                /*   for (let p = 0; p < this.katmanlar[i].zler.length; p++) {
   
                       let delta = this.katmanlar[i].deltalar[p];
                       let labda = this.labda;
                       let degisimler = this.katmanlar[i - 1].zler.map(function (x, index) {
                           return delta * x * labda;
                       });
                       let ddfg = this.katmanlar[i].agirliklar[p].map(function (x, index) {
                           return x - degisimler[index];
                       });
                       this.katmanlar[i].agirliklar[p] = ddfg.concat();
                       this.katmanlar[i].bler[p] -= this.labda * delta;
                   }
                   console.log(this.katmanlar[i].agirliklar)*/
                i++;
            }
            ghghgh++
        }
    }
    toplam_noron() {
        let toplam = 0;
        for (let i of this.katmanlar) {
            toplam += i.zler.length;
        }
        return toplam
    }
    fit(xler, yler) {
        if (xler == undefined || yler == undefined) {
            console.log("Xler veya Yler tanımlanmamış");
        } else {
            var startTime = performance.now()
            let eskiskor = 0;
            let i = 0;
            let og = Math.min(parseInt(this.toplam_noron() * 150), 9980)
            while (i < 10000 - og) {
                this.epoch(xler, yler);
                if (i % 100 == 0) {
                    let skor = this.score(xler, yler)
                    if (skor < eskiskor) {
                        break;
                    }
                }
                i++;
            }
            var endTime = performance.now()
            console.log(`İşlem şu kadar sürdü: ${endTime - startTime} milisaniye`)
            console.log("Epoch 1 işlemi tamamlandı model skoru:", this.score(xler, yler));
        }
    }
    score(xler, yler) {
        let dogrular = 0;
        let ghghgh = 0;
        while (ghghgh < xler.length) {
            let sonuc = this.predict(xler[ghghgh]);
            if (yler[ghghgh] == sonuc) {
                dogrular += 1;
            }
            ghghgh++
        }
        return dogrular / xler.length;
    }

    disa_aktar() {
        // labda 0.8
        // katmanlar : 1,16,5,1
        // zler:0.5,0.4,0.6,..,0.4
        // agirliklar 0.5,0.4,0.6,..,0.4
        // bler 0.5,0.4,0.6,..,0.4
        // deltalar 0.5,0.4,0.6,..,0.4
        let yazilicak = "";
        yazilicak += this.labda.toString() + "&";
        for (let i of this.katmans) {
            yazilicak += i.toString() + ","
        }

        yazilicak = yazilicak.substring(0, yazilicak.length - 1) + "&"
        try {
            for (let i of this.katmanlar) {
                for (let p of i.zler) {
                    yazilicak += p.toString() + ","
                }
            }
        }
        catch (exp) {
            console.log("HATA: model daha önce fit edilmemiş.")
            return -1;
        }
        yazilicak = yazilicak.substring(0, yazilicak.length - 1) + "&"
        for (let i of this.katmanlar) {
            for (let p of i.bler) {
                yazilicak += p.toString() + ","

            }
        }

        yazilicak = yazilicak.substring(0, yazilicak.length - 1) + "&"

        for (let i of this.katmanlar) {
            for (let o of i.agirliklar) {
                for (let p of o) {
                    yazilicak += p.toString() + ","
                }
            }
        }

        yazilicak = yazilicak.substring(0, yazilicak.length - 1) + "&";

        for (let i of this.katmanlar) {
            for (let p of i.deltalar) {
                yazilicak += p.toString() + ","

            }
        }

        yazilicak = yazilicak.substring(0, yazilicak.length - 1) + "&"
        for (let i of this.degerler) {
            yazilicak += i.toString() + ","
        }
        yazilicak = yazilicak.substring(0, yazilicak.length - 1)
        return yazilicak;
    }
    ice_aktar(metin) {

        // labda 0.8
        //degerşler
        // katmanlar : 1,16,5,1
        // zler:0.5,0.4,0.6,..,0.4
        // agirliklar 0.5,0.4,0.6,..,0.4
        // bler 0.5,0.4,0.6,..,0.4
        // deltalar 0.5,0.4,0.6,..,0.4f
        // degerler
        let indpp = 0;
        for (let i of metin.split("&")) {
            if (indpp == 0) {
                this.labda = parseFloat(i);
            }
            else if (indpp == 1) {
                let katmanlar = [];
                for (let p of i.split(",")) {
                    katmanlar.push(parseInt(p));
                }
                this.katmans = katmanlar;

            }
            else if (indpp == 2) {
                let xler = [];
                for (let p of i.split(",")) {
                    xler.push(parseFloat(p));
                }
                let ind = 0;
                for (let p = 0; p < this.katmanlar.length; p++) {
                    for (let a = 0; a < this.katmanlar[p].zler.length; a++) {
                        this.katmanlar[p].zler[a] = xler[ind];
                        ind++;
                    }
                }
            }

            else if (indpp == 3) {
                let bler = [];
                for (let p of i.split(",")) {
                    bler.push(parseFloat(p));
                }
                let ind = 0;
                for (let p = 0; p < this.katmanlar.length; p++) {
                    for (let a = 0; a < this.katmanlar[p].bler.length; a++) {
                        this.katmanlar[p].bler[a] = bler[ind];
                        ind++;
                    }
                }
            }
            else if (indpp == 4) {
                let agirliklar = [];
                for (let p of i.split(",")) {
                    agirliklar.push(parseFloat(p));
                }
                let ind = 0;
                for (let p = 1; p < this.katmanlar.length; p++) {
                    for (let a = 0; a < this.katmanlar[p].agirliklar.length; a++) {
                        for (let g = 0; g < this.katmanlar[p - 1].zler.length; g++) {
                            this.katmanlar[p].agirliklar[a][g] = agirliklar[ind];
                            ind++;
                        }

                    }
                }
            }

            else if (indpp == 5) {
                let deltalar = [];
                for (let p of i.split(",")) {
                    deltalar.push(parseFloat(p));
                }
                let ind = 0;
                for (let p = 0; p < this.katmanlar.length; p++) {
                    for (let a = 0; a < this.katmanlar[p].deltalar.length; a++) {
                        this.katmanlar[p].deltalar[a] = deltalar[ind];
                        ind++;
                    }
                }
            }
            else if (indpp == 6) {

                let degerler = [];
                for (let p of i.split(",")) {
                    degerler.push(p);
                    console.log(p)
                }

                this.degerler = degerler;

            }
            indpp++;

        }
    }


}

class Cok_cikisli_perceptron {
    constructor(katmans, labda = 0.6, degerler) {
        this.katmanlar = [];

        this.agirliklar = {};
        this.labda = labda;
        this.katmans=katmans;
        this.loss = 0;
        this.degerler = degerler;
        this.bler = [];
        let bler_boyut = 0;
        let onceki = -1;
        for (let boyut of katmans) {
            let kat = new katman(boyut);
            if (onceki != -1) {
                for (let i = 0; i < boyut; i++) {
                    let ggg = [];
                    for (let p = 0; p < onceki.zler.length; p++) {
                        ggg.push(get_random_());
                    }
                    kat.agirliklar.push(ggg)
                }
            }
            onceki = kat;

            this.katmanlar.push(kat);
        }
        this.bler = Array(bler_boyut)

    }
    get_activ(xler, agirliklar, b) {
        let g = xler.map(function (x, index) {
            return agirliklar[index] * x
        })
        let toplam = g.reduce((toplam, x) => toplam + x) + b
        return sigmoid(toplam)
    }


    cikis_katmani() {
        return this.katmanlar[this.katmanlar.length - 1];
    }

    set_data(x) {
        this.katmanlar[0].zler = x.concat();
        let i = 0;
        while (i < this.katmanlar.length - 1) {

            let katman = this.katmanlar[i];
            let skatman = this.katmanlar[i + 1];
            let p = 0;
            while(p < skatman.zler.length){
                this.katmanlar[i + 1].zler[p] = this.get_activ(katman.zler, skatman.agirliklar[p], skatman.bler[p]);
                p++
            }
            i++
        }
    }

    predict(x) {
        this.set_data(x);
        return this.cikis_katmani().zler;
    }
    epoch(xler, yler) {
        let ghghgh = 0;
        while ( ghghgh < xler.length) {
            let x = xler[ghghgh];
            let y = yler[ghghgh];
            this.predict(x);
            let degerler = this.degerler;
            let zler = this.cikis_katmani().zler
            let i = 0;
            while ( i < this.cikis_katmani().zler.length) {
                let h = this.cikis_katmani().zler[i];
                let delta = sigmoid_turev(h) * (h - y[i]);
                this.katmanlar[this.katmanlar.length - 1].deltalar[i] = delta;
                i++;
            }

            /* let dg=this.katmanlar[this.katmanlar.length - 1].deltalar.map(function (x,index){
                let y=0;
                 if(degerler[index] ==y){
                  y=1;
                }
                return sigmoid_turev(zler[index]) * (zler[index] - y)
             })*/
             let g = this.katmanlar.length - 2;
            while ( g > -1) {
                let deltalar = this.katmanlar[g + 1].deltalar
                let sonraki_kat = this.katmanlar[g + 1]
                let katman = this.katmanlar[g]

                this.katmanlar[g].deltalar = this.katmanlar[g].zler.map(function (x1, index1) {

                    return sonraki_kat.agirliklar.map(function (x, index) { return x[index1] * deltalar[index] }).reduce((toplam, x) => toplam + x) * sigmoid_turev(katman.zler[index1]);

                });
                g--;
            }
            i=1;
            while (i < this.katmanlar.length) {
                let deltalar = this.katmanlar[i].deltalar;
                let labda = this.labda;
                let katmanlar = this.katmanlar
                let degisimler = deltalar.map(function (x, index) {
                    return katmanlar[i - 1].zler.map(function (x1, index) {
                        return x * x1 * labda;
                    });
                });

                let ddfg = this.katmanlar[i].agirliklar.map(function (x, index1) {
                    return x.map(function (x, index) {
                        return x - degisimler[index1][index];
                    });
                });


                this.katmanlar[i].agirliklar = ddfg.concat();
                this.katmanlar[i].bler = this.katmanlar[i].bler.map(function (x, index) { return x - (deltalar[index] * labda) })


                /*   for (let p = 0; p < this.katmanlar[i].zler.length; p++) {
   
                       let delta = this.katmanlar[i].deltalar[p];
                       let labda = this.labda;
                       let degisimler = this.katmanlar[i - 1].zler.map(function (x, index) {
                           return delta * x * labda;
                       });
                       let ddfg = this.katmanlar[i].agirliklar[p].map(function (x, index) {
                           return x - degisimler[index];
                       });
                       this.katmanlar[i].agirliklar[p] = ddfg.concat();
                       this.katmanlar[i].bler[p] -= this.labda * delta;
                   }
                   console.log(this.katmanlar[i].agirliklar)*/
                   i++;
            }
            ghghgh++;
        }
    }
    fit(xler, yler) {
        if (xler == undefined || yler == undefined) {
            console.log("Xler veya Yler tanımlanmamış");
        } else {
            var startTime = performance.now()
            let eskiskor = 0;
            let i = 0;
            let og = Math.min(parseInt(this.toplam_noron() * 150), 9980)
            while (i < 10000 - og) {
                this.epoch(xler, yler);
                if (i % 100 == 0) {
                    let skor = this.score(xler, yler)
                    if (skor < eskiskor) {
                        break;
                    }
                }
                i++;
            }
            var endTime = performance.now()
            console.log(`İşlem şu kadar sürdü: ${endTime - startTime} milisaniye`)
            console.log("Epoch 1 işlemi tamamlandı model skoru:", this.score(xler, yler));
        }
    }
    score(xler, yler) {
        let dogrular = 0;
        let ind = 0;
        let ghghgh = 0;
        while ( ghghgh < xler.length) {
            let sonuc = this.predict(xler[ghghgh]);
            let i = 0;
            while ( i < sonuc.length) {
                dogrular += 1 - (Math.abs(sonuc[i] - yler[ghghgh][i]));
                i++
                ind++;
            }
            ghghgh++
        }
        return dogrular / ind;
    }


    disa_aktar() {
        // labda 0.8
        // katmanlar : 1,16,5,1
        // zler:0.5,0.4,0.6,..,0.4
        // agirliklar 0.5,0.4,0.6,..,0.4
        // bler 0.5,0.4,0.6,..,0.4
        // deltalar 0.5,0.4,0.6,..,0.4
        let yazilicak = "";
        yazilicak += this.labda.toString() + "&";
        for (let i of this.katmans) {
            yazilicak += i.toString() + ","
        }
        yazilicak = yazilicak.substring(0, yazilicak.length - 1) + "&"
        try {
            for (let i of this.katmanlar) {
                for (let p of i.zler) {
                    yazilicak += p.toString() + ","
                }
            }
        }
        catch (exp) {
            console.log("HATA: model daha önce fit edilmemiş.")
            return -1;
        }
        yazilicak = yazilicak.substring(0, yazilicak.length - 1) + "&"
        for (let i of this.katmanlar) {
            for (let p of i.bler) {
                yazilicak += p.toString() + ","

            }
        }

        yazilicak = yazilicak.substring(0, yazilicak.length - 1) + "&"

        for (let i of this.katmanlar) {
            for (let o of i.agirliklar) {
                for (let p of o) {
                    yazilicak += p.toString() + ","
                }
            }
        }

        yazilicak = yazilicak.substring(0, yazilicak.length - 1) + "&";

        for (let i of this.katmanlar) {
            for (let p of i.deltalar) {
                yazilicak += p.toString() + ","

            }
        }
        yazilicak = yazilicak.substring(0, yazilicak.length - 1)
        return yazilicak;
    }
    ice_aktar(metin) {

        // labda 0.8
        // katmanlar : 1,16,5,1
        // zler:0.5,0.4,0.6,..,0.4
        // agirliklar 0.5,0.4,0.6,..,0.4
        // bler 0.5,0.4,0.6,..,0.4
        // deltalar 0.5,0.4,0.6,..,0.4f
        let indpp = 0;
        for (let i of metin.split("&")) {
            if (indpp == 0) {
                this.labda = parseFloat(i);
            }
            else if (indpp == 1) {
                let katmanlar = [];
                for (let p of i.split(",")) {
                    katmanlar.push(parseInt(p));
                }
                this.katmans = katmanlar;

            }
            else if (indpp == 2) {
                let xler = [];
                for (let p of i.split(",")) {
                    xler.push(parseFloat(p));
                }
                let ind = 0;
                for (let p = 0; p < this.katmanlar.length; p++) {
                    for (let a = 0; a < this.katmanlar[p].zler.length; a++) {
                        this.katmanlar[p].zler[a] = xler[ind];
                        ind++;
                    }
                }
            }

            else if (indpp == 3) {
                let bler = [];
                for (let p of i.split(",")) {
                    bler.push(parseFloat(p));
                }
                let ind = 0;
                for (let p = 0; p < this.katmanlar.length; p++) {
                    for (let a = 0; a < this.katmanlar[p].bler.length; a++) {
                        this.katmanlar[p].bler[a] = bler[ind];
                        ind++;
                    }
                }
            }
            else if (indpp == 4) {
                let agirliklar = [];
                for (let p of i.split(",")) {
                    agirliklar.push(parseFloat(p));
                }
                let ind = 0;
                for (let p = 1; p < this.katmanlar.length; p++) {
                    for (let a = 0; a < this.katmanlar[p].agirliklar.length; a++) {
                        for (let g = 0; g < this.katmanlar[p - 1].zler.length; g++) {
                            this.katmanlar[p].agirliklar[a][g] = agirliklar[ind];
                            ind++;
                        }

                    }
                }
            } else if (indpp == 5) {
                let deltalar = [];
                for (let p of i.split(",")) {
                    deltalar.push(parseFloat(p));
                }
                let ind = 0;
                for (let p = 0; p < this.katmanlar.length; p++) {
                    for (let a = 0; a < this.katmanlar[p].deltalar.length; a++) {
                        this.katmanlar[p].deltalar[a] = deltalar[ind];
                        ind++;
                    }
                }
            }
            indpp++;
        }
    }
}