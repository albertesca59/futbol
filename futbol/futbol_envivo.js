/*stringSimilarity = require('string-similarity')

coincidencia = stringSimilarity.compareTwoStrings('barcalona','barcelona')

nvaCoincidencia = stringSimilarity.compareTwoStrings('leon','italian')

console.log(coincidencia,nvaCoincidencia)

if(coincidencia>.3 && nvaCoincidencia>.3){
    console.log("coinciden")
}*/

const puppeteer = require('puppeteer')

async function run(){
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null
    })
    const page = await browser.newPage()

    

    //Caliente
    await page.goto('https://sports.caliente.mx/es_MX/Futbol')
    
    await page.waitForSelector('[data-value="DEC"]')


    tenisCaliente = await page.evaluate(() => {
        document.querySelector('[data-value="DEC"]').click()
        items = document.querySelectorAll('[data-mkt_id]')
        arr = []
        items.forEach(e => {
            separador = (e.innerText).split('\n')
            partido = {}
            partido.local = separador[1]
            partido.visitante = separador[2]
            partido.fecha = separador[0]
            partido.cuotas = [
                parseFloat(separador[4]),
                parseFloat(separador[6])
            ]
            partido.casa = '1xbet'
            arr.push(partido)
        })
        return arr
    })
    
    

    //await browser.close()

    emparejar = (a,b) => {
        arr = []
        for(i of a){
            for(j of b){
                if(i.local == j.local && i.visitante == j.visitante){
                    arr.push([i,j])
                }
            }
        }
        return arr
    }

    
    surebets = matches => {
        matches.forEach(e => {
            for(i in e[0].cuotas){
                for(j in e[1].cuotas){
                    if(i != j){
                        x = e[0].cuotas[i]
                        y = e[1].cuotas[j]
                        coeficiente = (1/x)+(1/y)
                        if(coeficiente<1){
                            rendimiento = ((1/coeficiente)-1)*100
                            if(i==1 && j==0){
                                console.log([y,x],coeficiente)
                            }else{
                                console.log([x,y],coeficiente,rendimiento,'%')
                            }
                        }
                    }
                }
            }
        })
    }

    parCasas = elementos => {
        for (let i = 0; i < elementos.length; i++) {
            for (let j = i + 1; j < elementos.length; j++) {
                matches = emparejar(elementos[i],elementos[j])
                surebets(matches)
            }
        }
    }

    
}

run()