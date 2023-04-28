import {PDFExtract, PDFExtractOptions} from 'pdf.js-extract';

async function getMenuFromPdf(pdfLocation: string) {
    const data = await getRowsFromPdf(pdfLocation)
    data.splice(0,3)
    console.log(data)
    
    const refeicoes = []
    for (let i = 1; i < 8; i++) {
        const refeicao = {
            dia: data[0][i],
            salada1: data[1][i],
            salada2: data[2][i],
            molhoSalada: data[3][i],
            principalPadrao: data[4][i],
            principalOvo: data[5][i],
            principalVeg: data[6][i],
            guarnicao: data[7][i],
            acompanhamento: data[8][i],
            sobremesa: data[9][i],
            bebida: data[10][i]
        }

        refeicoes.push(refeicao)

    }

    console.log(refeicoes)


}

async function getRowsFromPdf(pdfLocation: string): Promise<string[][]> {

    function textFormat(str: string): string {
        if (str[0] === " ") {
            str = str.slice(1, str.length)
        }
        return str
    }

    function textConcatFormat(str1: string, str2: string): string {

        str1 = textFormat(str1)
        //str2 = textFormat(str2)

        //return str1 + " " + str2

        return str1 + str2
    }

    const pdfExtract = new PDFExtract();
    const options: PDFExtractOptions = {
        disableCombineTextItems: true
    };

    return pdfExtract.extract(pdfLocation, options)
        .then((data) => {
            
            let currentX = 900
            let currentY = 90
            let fullOutput: string[][] = []
            let lineOutput: string[] = []
            let str = "";
            for (let content of data.pages[1].content) {
                console.log(content.str, content.x, content.y, `curentx: ${currentX} curenty: ${currentY}`)
    
                if (content.str === " " || content.str === "") {
                    continue
                }
    
                //check if content is in the next row
                if (content.x - currentX < -300 || Math.abs(content.y - currentY) > 50) {
                    console.log("other row")
                    lineOutput.push(str)
                    fullOutput.push(lineOutput)
                    lineOutput = []
                    currentX = content.x + content.width
                    currentY = content.y
                    str = textFormat(content.str)
                    continue
                }
    
                //check if content is in the same cell
                if ((content.x - currentX < 0 && Math.abs(content.y - currentY) < 20) || (content.x - currentX < 20 && Math.abs(content.y - currentY) < 5)) {
                    console.log("same cell")
                    str = textConcatFormat(str, content.str)
                    currentY = content.y
                    continue
                }
    
                //otherwise, push cell
                else {
                    console.log("other cell")
                    lineOutput.push(str)
                    str = textFormat(content.str)
                    currentX = content.x + content.width
                    currentY = content.y
                    continue
                }
            }
            console.log(fullOutput)

            
    
            function testOutput(output: string[][]) {
                for (let i of output) {
                    if (i.length != 1 && i.length != 8) {
                        console.log("não passou")
                        break
                    }
                }
            }
            testOutput(fullOutput)

            return fullOutput
        }
        )
      .catch(err=> {
        console.error(err)
        throw err
    });

}

getMenuFromPdf('Darcy_Ribeiro_-_Semana_02_-_24-04_a_30-04.pdf')

