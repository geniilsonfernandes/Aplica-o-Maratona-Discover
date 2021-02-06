
	
const modal = {
        open(){
            // abri modal
            // adicionar a classe active
            document.querySelector('.modal-overlay').classList.add('active')
        },
        close(){
            //fechar modal
            // remove a classe active
            document.querySelector('.modal-overlay').classList.remove('active')
        }
}

const transactions = [
    {
    
    description:'luz',
    amount: -50000,
    date:'23/01/2021',
    },
    {
    
    description:'website',
    amount: 550004,
    date:'23/01/2021',
    },
    {
    
    description:'internet',
    amount: -20000,
    date:'23/01/2021',
    },{
   
    description:'curso',
    amount: 40000,
    date:'23/01/2021',
    },
]

const Storage = {
    get(){
        return JSON.parse(localStorage.getItem('dev.finances:transactions')) || []
    },
    set(transaction){
        localStorage.setItem('dev.finances:transactions',JSON.stringify(transaction))
    }
}

const Transaction = {
    all: Storage.get(), 
    add(transaction){
        Transaction.all.push(transaction)

        app.reload();
    },
    remove(index){
        Transaction.all.splice(index,1)
        app.reload()
    },
        incomes(){

            let inc = 0
            Transaction.all.forEach(carteira=>{
                if(carteira.amount>0){
                    inc += carteira.amount
                }
                
            })


           return inc
        },
        expenses(){
            let exp = 0
            Transaction.all.forEach(carteira=>{
                if(carteira.amount<0){
                    exp += carteira.amount
                }
                
            })


           return exp
        },
        total(){
            return Transaction.incomes() + Transaction.expenses(); 
        }
}

const DOM = {
    
    transationContainer: document.querySelector('#data-table tbody'),

    addTransaction(transaction,index){
        
        const tr = document.createElement('tr');
        tr.innerHTML = DOM.innerHTMLTransaction(transaction)
        tr.dataset.index = index
        DOM.transationContainer.appendChild(tr)
    
    },
    innerHTMLTransaction(transaction,index){

        const CSSclass = transaction.amount > 0 ? "income" : "expense"
        const amount = Utils.formatCurrency(transaction.amount)
        
        const html = `
            
                <td class="description">${transaction.description}</td>
                <td class="${CSSclass}">${amount}</td>
                <td class="date">${transaction.date}</td>
                <td class=""><img onclick="Transaction.remove(${index})" src="/assets/assets/minus.svg" alt="remover transação"></td>
        
        `
    return html
    },
    updateBalance(){
        document.getElementById('incomeDisplay').innerHTML = Utils.formatCurrency(Transaction.incomes()) 

        document.getElementById('expenseDisplay').innerHTML = Utils.formatCurrency(Transaction.expenses())  

        document.getElementById('totalDisplay').innerHTML = Utils.formatCurrency(Transaction.total())  

    },
    clearTransactions(){
        DOM.transationContainer.innerHTML = ""
    }

}

const Utils = {
    
    formatDate(date){
        const splittedDate = date.split("-")
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    },


    formatAmout(value){
        value = Number(value) * 100
        return value
    },


    formatCurrency(value){
       const signal = Number(value) < 0 ? "-" : ""

        value = String(value).replace( /\D/g,"")
        value = Number(value)/100

        value = value.toLocaleString("pt-BR",{
            style:"currency",
            currency:"BRL"
        })

       return signal + value
    }
}

const date = document.querySelector('input#date')

const Form = {
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#data'),
    
    getValue(){
        
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date:  Form.date.value
        }
    },

    validadeField(){
        
        const {description, amount, date } = Form.getValue()

        console.log(amount);
         if(description.trim() === "" || amount.trim() === "" || date.trim() === ""){
             throw new Error('por favor preencha todos os campos')
         }
    },

    
    
    formataValue(){
        
        let { description, amount, date} = Form.getValue()

        amount = Utils.formatAmout(amount)
        date = Utils.formatDate(date)
        
        return {
            description,
            amount,
            date
        }
   },

   clearFilds(){
       Form.description.value = ""
       Form.amount.value = ""
       Form.date.value = ""
},

    submit(event){
        
        event.preventDefault()

        
         try{
            Form.validadeField()
            const transaction =  Form.formataValue()
            Transaction.add(transaction)
            Form.clearFilds()
            modal.close()

         } catch (error){
             alert(error.message)
         }
    }

    
}



const app =  {
    init(){

        Transaction.all.forEach((transaction,index) => {
            DOM.addTransaction(transaction,index)
        })
        DOM.updateBalance()
        
        Storage.set(Transaction.all)
        
      
    },
    reload(){
        DOM.clearTransactions()
        app.init()
    }
}

app.init()





