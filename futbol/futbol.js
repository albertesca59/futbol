

const puppeteer = require('puppeteer')

async function run(){
    const browser = await puppeteer.launch(/*{
        headless: false,
        defaultViewport: null
    }*/)
    const page = await browser.newPage()

    await page.goto('https://betmexico.mx/sport/sr:sport:1?upcoming-tournaments')

    futbolBetmexico = await page.evaluate(() => {
        const items = document.querySelectorAll('[class="match__container-height relative flex"]')
    
        
        const arr = []
        items.forEach(e => {
            separador = (e.innerText).split('\n')
            partido = {}
            partido.local = separador[0]
            partido.visitante = separador[1]
            partido.fecha = separador[2]
            partido.cuotas = [
                parseFloat(separador[6]),
                parseFloat(separador[8]),
                parseFloat(separador[10])
            ]
            partido.casa = 'Betmexico'
            arr.push(partido)
        })

        
    
        return arr
    
    })

    //Mexbet
    await page.goto('https://www.mexbet.mx/sportsbook/240')
    
    await page.waitForSelector('[class="osg-coupon__events"]')
    
    futbolMexbet = await page.evaluate(() => {
         
        document.querySelector('#oddsChange > div.c0124 > div.c0120').click()
        document.querySelector('#oddsChange > div.c0125.opened > ul > li:nth-child(2)').click()
        

        items = document.querySelectorAll('[class="osg-coupon__events"]')
        arr = []
        items.forEach(e => {
            separador = (e.innerText).split('\n')
            const partido = {}
            partido.local = separador[1]
            partido.visitante = separador[5]
            partido.fecha = separador[0]
            partido.cuotas = [
                parseFloat(separador[2]),
                parseFloat(separador[4]),
                parseFloat(separador[6])
            ]
            partido.casa = 'Mexbet'
            arr.push(partido)

        })
        return arr
    })

    //1xbet
    await page.goto('https://1xbet.com.mx/line/football');
    
    futbol1xbet =  await page.evaluate(() => {
        
        const items = document.querySelectorAll('[class="c-events__item c-events__item_game c-events-item"]')
    
        
        const arr = []
        items.forEach(e => {
            separador = (e.innerText).split('\n')
            partido = {}
            partido.local = separador[1]
            partido.visitante = separador[2]
            partido.fecha = separador[0]
            partido.cuotas = [
                parseFloat(separador[4]),
                parseFloat(separador[5]),
                parseFloat(separador[6])
            ]
            partido.casa = '1xbet'
            arr.push(partido)
        })

        
    
        return arr
    
    })

    

    //Caliente
    await page.goto('https://sports.caliente.mx/es_MX')
    
    await page.waitForSelector('[data-value="DEC"]')


    futbolCaliente = await page.evaluate(() => {
        document.querySelector('[data-value="DEC"]').click()
        items = document.querySelectorAll('[data-mkt_id]')
        const arr = []
        items.forEach(e => {
            separador = (e.innerText).split('\n')
            partido = {}
            partido.local = separador[1]
            partido.visitante = separador[9]
            partido.fecha = separador[1]+' '+separador[0]
            partido.cuotas = [
                parseFloat(separador[4]),
                parseFloat(separador[7]),
                parseFloat(separador[10])
            ]
            partido.casa = 'Caliente'
            arr.push(partido)
        })
    })

    console.log(futbolBetmexico)
    
    await browser.close()

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
            console.log(e)
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