const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors())


const PORT = 3000;
const JSON_EXAMPLE = {
    "client":{
        "name":"teste teste",
        "cpf":"123.456.789-10",
        "age":29,
        "uf":"SP",
        "renda_mensal":3000
    }
}

app.use(bodyParser.json());

let emprestimos = {
    pessoal:{
        "tipo_emprestimo":"EMPRESTIMO_PESSOAL",
        "taxa":4
    },
    garantia:{
        "tipo_emprestimo":"EMPRESTIMO_GARANTIA",
        "taxa":3
    },
    consignado:{
        "tipo_emprestimo":"EMPRESTIMO_CONSIGNADO",
        "taxa":2
    },

}

function produtos_emprestimo(name,cpf,age,uf,rendaMensal){
    let list_produtos = []
    
    if(rendaMensal >= 5000){
        list_produtos.push(emprestimos.pessoal)
        list_produtos.push(emprestimos.consignado)
        if(age < 30){
            list_produtos.push(emprestimos.garantia);
        }
        return list_produtos;
    }

    if(rendaMensal >= 3000){
        list_produtos.push(emprestimos.pessoal)
        if(uf.toUpperCase() == "SP"){
            list_produtos.push(emprestimos.garantia);
        }
        return list_produtos;
    }
    

    if(rendaMensal <= 3000){
        list_produtos.push(emprestimos.pessoal)
        if((uf.toUpperCase() == "SP") && (age < 30)){
            list_produtos.push(emprestimos.garantia);
        }
        return list_produtos;
    }

    

}


app.post("/api", (req,res) => {
    try{
        var clientName = req.body.cliente.name;
        var clientCpf = req.body.cliente.cpf;
        var clientAge = req.body.cliente.age;
        var clientUf = req.body.cliente.uf;
        var clientRendaMensal = req.body.cliente.renda_mensal;

        if(! (clientName && clientCpf && clientAge && clientUf && clientRendaMensal)){
            throw new Error("Property missing");
        } 
        

        if(! (typeof clientName == 'string' && typeof clientCpf == 'string' && typeof clientAge == 'number' && typeof clientUf == 'string' && typeof clientRendaMensal == 'number')){
            throw new Error("The type of one of the variables is wrong. ");      
        } 

        const response = {
            "cliente":{
                "name": clientName,
                "cpf": clientCpf,
                "age": clientAge,
                "uf": clientUf,
                "renda_mensal": clientRendaMensal

            },
            "produtos_emprestimo":produtos_emprestimo(clientName,clientCpf,clientAge,clientUf,clientRendaMensal)
        }
        res.json(response)

    } catch(e) {
        res.send(`${e}\n\n ---- TUTORIAL ---- \n\nSend data in the format below.\n json : \n` + JSON.stringify(JSON_EXAMPLE) + "\n\n variable types : \n name = string\n cpf = string \n age = number \n uf = string \n renda_mensal = number \n")
    } 

});

app.listen(PORT, (req,res) => {
    console.log(`Server listening on port ${PORT}`);
});
