import { ReactNode, useEffect, useState, useCallback } from 'react'
import { createContext, useContextSelector } from 'use-context-selector'
import { api } from '../lib/axios'

interface Transaction {
  id: number
  description: string
  type: 'income' | 'outcome'
  price: number
  category: string
  createdAt: string
}
interface TransactionsProviderProps {
  children: ReactNode
}

interface CreateTransactionInput {
  description: string
  price: number
  category: string
  type: 'income' | 'outcome'
}

interface TransactionContextType {
  transactions: Transaction[]
  fetchTransactions: (query?: string) => Promise<void>
  createTransaction: (transaction: CreateTransactionInput) => Promise<void>
}

const TransactionsContext = createContext({} as TransactionContextType)

export function TransactionsProvider({ children }: TransactionsProviderProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])

  const fetchTransactions = useCallback(async (query?: string) => {
    const response = await api.get('/transactions', {
      params: {
        _sort: 'createdAt',
        _order: 'desc',
        q: query,
      },
    })
    setTransactions(response.data)
  }, [])

  const createTransaction = useCallback(
    async (transaction: CreateTransactionInput) => {
      const { category, description, price, type } = transaction

      const response = await api.post('transactions', {
        description,
        price,
        category,
        type,
        createdAt: new Date(),
      })

      setTransactions((prevState) => [response.data, ...prevState])
    },
    [],
  )

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  return (
    <TransactionsContext.Provider
      value={{ transactions, fetchTransactions, createTransaction }}
    >
      {children}
    </TransactionsContext.Provider>
  )
}

export function useTransactions() {
  return useContextSelector(TransactionsContext, (context) => {
    return context.transactions
  })
}

export function useCreateTransaction() {
  return useContextSelector(TransactionsContext, (context) => {
    return context.createTransaction
  })
}

export function useFetchTransaction() {
  return useContextSelector(TransactionsContext, (context) => {
    return context.fetchTransactions
  })
}
