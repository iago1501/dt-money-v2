import { createContext, ReactNode, useContext, useEffect, useState } from "react";

interface Transaction {
  id: number;
  description: string;
  type: 'income' | 'outcome';
  price: number;
  category: string;
  createdAt: string;
}

interface TransactionContextYpe {
  transactions: Transaction[]
}

interface TransactionsProviderProps {
  children: ReactNode
}

const TransactionsContext = createContext({} as TransactionContextYpe)

export function TransactionsProvider({children} : TransactionsProviderProps) {

  const [transactions, setTransactions] = useState<Transaction[]>([])

  useEffect(() => {
    async function loadTransactions() {
      const response = await fetch('http://localhost:3333/transaction')
      const data = await response.json()

      setTransactions(data)
    }

    loadTransactions()        
  }, [])


  return (
    <TransactionsContext.Provider value={{transactions}}>
      {children}
    </TransactionsContext.Provider>
  )
}

export function useTransactions(){
  return useContext(TransactionsContext)    
}