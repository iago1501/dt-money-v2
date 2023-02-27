import { useTransactions } from '../contexts/TransactionsContext'

export function useSummary() {
  const { transactions } = useTransactions()

  const summary = transactions.reduce(
    (acc, { type, price }) => {
      if (type === 'income') {
        acc.income += price
        acc.total += price
      }
      if (type === 'outcome') {
        acc.outcome += price
        acc.total -= price
      }
      return acc
    },
    {
      income: 0,
      outcome: 0,
      total: 0,
    },
  )

  return summary
}
