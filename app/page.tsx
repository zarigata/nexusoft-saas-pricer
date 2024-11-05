"use client"

import { useState, useEffect } from 'react'
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts'
import { Download } from 'lucide-react'
import { jsPDF } from 'jspdf'
import { NumericFormat } from 'react-number-format'

const RandomShape = ({ type }: { type: 'circle' | 'triangle' }) => {
  const size = Math.random() * 50 + 20
  const top = Math.random() * 100
  const left = Math.random() * 100
  const opacity = Math.random() * 0.5 + 0.1
  const animationDuration = Math.random() * 20 + 10

  const commonStyles = {
    position: 'absolute' as const,
    top: `${top}%`,
    left: `${left}%`,
    opacity,
    animation: `float ${animationDuration}s infinite ease-in-out`,
  }

  if (type === 'circle') {
    return (
      <div
        style={{
          ...commonStyles,
          width: size,
          height: size,
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 255, 255, ' + opacity + ')',
        }}
      />
    )
  } else {
    return (
      <div
        style={{
          ...commonStyles,
          width: 0,
          height: 0,
          borderLeft: `${size / 2}px solid transparent`,
          borderRight: `${size / 2}px solid transparent`,
          borderBottom: `${size}px solid rgba(255, 255, 255, ${opacity})`,
        }}
      />
    )
  }
}

const translations = {
  en: {
    title: "NEXUSOFT SaaS Pricer",
    inputParameters: "Input Parameters",
    maxIncome: "Max Income",
    developmentCost: "Development Cost",
    hardwareCost: "Hardware Cost",
    monthlyPrices: "Monthly Prices",
    taxes: "Taxes (%)",
    profitPercentage: "Profit Percentage",
    monthsOfOperation: "Months of Operation",
    results: "Results",
    totalCost: "Total Cost",
    maxProfit: "Max Profit",
    minProfit: "Min Profit",
    roi: "ROI",
    breakEven: "Break-even",
    monthlyRevenue: "Monthly Revenue",
    profitMargin: "Profit Margin",
    expensesBreakdown: "Expenses Breakdown",
    expensesDistribution: "Expenses Distribution",
    profitVsCost: "Profit vs Cost",
    saveAsPDF: "Save as PDF",
    months: "months",
    lowestPrice: "Lowest Monthly Price",
    lowestPriceToCall: "Lowest Price to Call",
  },
  pt: {
    title: "Precificador SaaS NEXUSOFT",
    inputParameters: "Parâmetros de Entrada",
    maxIncome: "Renda Máxima",
    developmentCost: "Custo de Desenvolvimento",
    hardwareCost: "Custo de Hardware",
    monthlyPrices: "Preços Mensais",
    taxes: "Impostos (%)",
    profitPercentage: "Porcentagem de Lucro",
    monthsOfOperation: "Meses de Operação",
    results: "Resultados",
    totalCost: "Custo Total",
    maxProfit: "Lucro Máximo",
    minProfit: "Lucro Mínimo",
    roi: "ROI",
    breakEven: "Ponto de Equilíbrio",
    monthlyRevenue: "Receita Mensal",
    profitMargin: "Margem de Lucro",
    expensesBreakdown: "Detalhamento de Despesas",
    expensesDistribution: "Distribuição de Despesas",
    profitVsCost: "Lucro vs Custo",
    saveAsPDF: "Salvar como PDF",
    months: "meses",
    lowestPrice: "Preço Mensal Mais Baixo",
    lowestPriceToCall: "Preço Mínimo de Chamada",
  }
}

export default function Component() {
  const [maxIncome, setMaxIncome] = useState(100000)
  const [development, setDevelopment] = useState(20000)
  const [hardware, setHardware] = useState(10000)
  const [monthlyPrices, setMonthlyPrices] = useState(5000)
  const [taxes, setTaxes] = useState(15)
  const [profitPercentage, setProfitPercentage] = useState(20)
  const [months, setMonths] = useState(12)

  const [totalCost, setTotalCost] = useState(0)
  const [maxProfit, setMaxProfit] = useState(0)
  const [minProfit, setMinProfit] = useState(0)
  const [roi, setRoi] = useState(0)
  const [breakEvenMonths, setBreakEvenMonths] = useState(0)
  const [monthlyRevenue, setMonthlyRevenue] = useState(0)
  const [profitMargin, setProfitMargin] = useState(0)
  const [lowestPrice, setLowestPrice] = useState(0)
  const [lowestPriceToCall, setLowestPriceToCall] = useState(0)

  const [language, setLanguage] = useState<'en' | 'pt'>('en')
  const t = translations[language]

  useEffect(() => {
    const totalMonthlyExpenses = monthlyPrices * months
    const totalTaxes = (maxIncome * taxes) / 100
    const totalCostCalc = development + hardware + totalMonthlyExpenses + totalTaxes
    setTotalCost(totalCostCalc)

    const maxProfitCalc = maxIncome - totalCostCalc
    setMaxProfit(maxProfitCalc)

    const minProfitCalc = (maxIncome * profitPercentage) / 100
    setMinProfit(minProfitCalc)

    const roiCalc = ((maxProfitCalc / totalCostCalc) * 100).toFixed(2)
    setRoi(parseFloat(roiCalc))

    const breakEvenCalc = (totalCostCalc / (maxIncome / 12)).toFixed(1)
    setBreakEvenMonths(parseFloat(breakEvenCalc))

    const monthlyRevenueCalc = (maxIncome / 12).toFixed(2)
    setMonthlyRevenue(parseFloat(monthlyRevenueCalc))

    const profitMarginCalc = ((maxProfitCalc / maxIncome) * 100).toFixed(2)
    setProfitMargin(parseFloat(profitMarginCalc))

    const lowestPriceCalc = ((totalCostCalc / (1 - (taxes / 100))) / (1 - 0.2) / months).toFixed(2)
    setLowestPrice(parseFloat(lowestPriceCalc))

    const lowestPriceToCallCalc = (((totalCostCalc * (1 + taxes / 100)) * months) * (1 + profitPercentage / 100)).toFixed(2)
    setLowestPriceToCall(parseFloat(lowestPriceToCallCalc))
  }, [maxIncome, development, hardware, monthlyPrices, taxes, profitPercentage, months])

  const NumberInput = ({ id, value, onChange, ...props }) => (
    <NumericFormat
      id={id}
      value={value}
      onValueChange={(values) => onChange(values.floatValue)}
      thousandSeparator=","
      decimalScale={2}
      fixedDecimalScale
      className="bg-blue-100 text-blue-800 rounded-md border border-blue-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      {...props}
    />
  )

  const expensesData = [
    { name: t.developmentCost, value: development },
    { name: t.hardwareCost, value: hardware },
    { name: t.monthlyPrices, value: monthlyPrices * months },
    { name: t.taxes, value: (maxIncome * taxes) / 100 },
  ]

  const profitData = [
    { name: t.minProfit, value: minProfit },
    { name: t.maxProfit, value: maxProfit },
    { name: t.totalCost, value: totalCost },
  ]

  const COLORS = ['#00FFFF', '#FF00FF', '#FFFF00', '#FF69B4']

  const savePDF = () => {
    const doc = new jsPDF()
    doc.setFontSize(20)
    doc.text(t.title, 20, 20)
    doc.setFontSize(12)

    // Input Parameters
    doc.text(t.inputParameters, 20, 40)
    doc.text(`${t.maxIncome}: ${maxIncome}`, 30, 50)
    doc.text(`${t.developmentCost}: ${development}`, 30, 60)
    doc.text(`${t.hardwareCost}: ${hardware}`, 30, 70)
    doc.text(`${t.monthlyPrices}: ${monthlyPrices}`, 30, 80)
    doc.text(`${t.taxes}: ${taxes}%`, 30, 90)
    doc.text(`${t.profitPercentage}: ${profitPercentage}%`, 30, 100)
    doc.text(`${t.monthsOfOperation}: ${months}`, 30, 110)

    // Results
    doc.text(t.results, 20, 130)
    doc.text(`${t.totalCost}: ${totalCost.toFixed(2)}`, 30, 140)
    doc.text(`${t.maxProfit}: ${maxProfit.toFixed(2)}`, 30, 150)
    doc.text(`${t.minProfit}: ${minProfit.toFixed(2)}`, 30, 160)
    doc.text(`${t.roi}: ${roi}%`, 30, 170)
    doc.text(`${t.breakEven}: ${breakEvenMonths} ${t.months}`, 30, 180)
    doc.text(`${t.monthlyRevenue}: ${monthlyRevenue}`, 30, 190)
    doc.text(`${t.profitMargin}: ${profitMargin}%`, 30, 200)
    doc.text(`${t.lowestPrice}: ${lowestPrice}`, 30, 210)
    doc.text(`${t.lowestPriceToCall}: ${lowestPriceToCall}`, 30, 220)

    // Expenses Breakdown
    doc.addPage()
    doc.text(t.expensesBreakdown, 20, 20)
    expensesData.forEach((expense, index) => {
      doc.text(`${expense.name}: ${expense.value}`, 30, 40 + (index * 10))
    })

    // Profit vs Cost
    doc.text(t.profitVsCost, 20, 100)
    profitData.forEach((item, index) => {
      doc.text(`${item.name}: ${item.value}`, 30, 120 + (index * 10))
    })

    doc.save("nexusoft-saas-pricing-results.pdf")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-300 via-purple-300 to-cyan-300 p-4 font-sans relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        {[...Array(20)].map((_, i) => (
          <RandomShape key={`circle-${i}`} type="circle" />
        ))}
        {[...Array(20)].map((_, i) => (
          <RandomShape key={`triangle-${i}`} type="triangle" />
        ))}
      </div>
      <div className="container mx-auto relative z-10">
        <div className="flex justify-end mb-4 space-x-2">
          <Button onClick={() => setLanguage('en')} variant={language === 'en' ? 'default' : 'outline'}>
            English
          </Button>
          <Button onClick={() => setLanguage('pt')} variant={language === 'pt' ? 'default' : 'outline'}>
            Português
          </Button>
        </div>
        <h1 className="text-4xl font-bold mb-4 text-center bg-blue-500 bg-opacity-70 text-white p-2 rounded">
          {t.title}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <Card className="bg-white bg-opacity-80 backdrop-filter backdrop-blur-lg">
            <CardHeader>
              <CardTitle className="text-blue-600">{t.inputParameters}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="maxIncome" className="text-blue-600">{t.maxIncome}</Label>
                  <NumberInput id="maxIncome" value={maxIncome} onChange={(value) => setMaxIncome(value || 0)} />
                </div>
                <div>
                  <Label htmlFor="development" className="text-blue-600">{t.developmentCost}</Label>
                  <NumberInput id="development" value={development} onChange={(value) => setDevelopment(value || 0)} />
                </div>
                <div>
                  <Label htmlFor="hardware" className="text-blue-600">{t.hardwareCost}</Label>
                  <NumberInput id="hardware" value={hardware} onChange={(value) => setHardware(value || 0)} />
                </div>
                <div>
                  <Label htmlFor="monthlyPrices" className="text-blue-600">{t.monthlyPrices}</Label>
                  <NumberInput id="monthlyPrices" value={monthlyPrices} onChange={(value) => setMonthlyPrices(value || 0)} />
                </div>
                <div>
                  <Label htmlFor="taxes" className="text-blue-600">{t.taxes}</Label>
                  <NumberInput id="taxes" value={taxes} onChange={(value) => setTaxes(value || 0)} />
                </div>
                <div>
                  <Label htmlFor="profitPercentage" className="text-blue-600">{t.profitPercentage}</Label>
                  <NumberInput id="profitPercentage" value={profitPercentage} onChange={(value) => setProfitPercentage(value || 0)} />
                </div>
                <div>
                  <Label htmlFor="months" className="text-blue-600">{t.monthsOfOperation}</Label>
                  <NumberInput id="months" value={months} onChange={(value) => setMonths(value || 0)} />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white bg-opacity-80 backdrop-filter backdrop-blur-lg">
            <CardHeader>
              <CardTitle className="text-blue-600">{t.results}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-100 p-2 rounded">
                  <Label className="text-blue-600">{t.totalCost}</Label>
                  <div className="text-2xl font-bold text-blue-800">${totalCost.toFixed(2)}</div>
                </div>
                <div className="bg-blue-100 p-2 rounded">
                  <Label className="text-blue-600">{t.maxProfit}</Label>
                  <div className="text-2xl font-bold text-blue-800">${maxProfit.toFixed(2)}</div>
                </div>
                <div className="bg-blue-100 p-2 rounded">
                  <Label className="text-blue-600">{t.minProfit}</Label>
                  <div className="text-2xl font-bold text-blue-800">${minProfit.toFixed(2)}</div>
                </div>
                <div className="bg-blue-100 p-2 rounded">
                  <Label className="text-blue-600">{t.roi}</Label>
                  <div className="text-2xl font-bold text-blue-800">{roi}%</div>
                </div>
                <div className="bg-blue-100 p-2 rounded">
                  <Label className="text-blue-600">{t.breakEven}</Label>
                  <div className="text-2xl font-bold text-blue-800">{breakEvenMonths} {t.months}</div>
                </div>
                <div className="bg-blue-100 p-2 rounded">
                  <Label className="text-blue-600">{t.monthlyRevenue}</Label>
                  <div className="text-2xl font-bold text-blue-800">${monthlyRevenue}</div>
                </div>
                <div className="bg-blue-100 p-2 rounded">
                  <Label className="text-blue-600">{t.profitMargin}</Label>
                  <div className="text-2xl font-bold text-blue-800">{profitMargin}%</div>
                </div>
                <div className="bg-blue-100 p-2 rounded">
                  <Label className="text-blue-600">{t.lowestPrice}</Label>
                  <div className="text-2xl font-bold text-blue-800">${lowestPrice}</div>
                </div>
                <div className="bg-blue-100 p-2 rounded">
                  <Label className="text-blue-600">{t.lowestPriceToCall}</Label>
                  <div className="text-2xl font-bold text-blue-800">${lowestPriceToCall}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-white bg-opacity-80 backdrop-filter backdrop-blur-lg">
            <CardHeader>
              <CardTitle className="text-blue-600">{t.expensesBreakdown}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={expensesData}>
                  <XAxis dataKey="name" stroke="#1E40AF" />
                  <YAxis stroke="#1E40AF" />
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', borderColor: '#1E40AF', color: '#1E40AF' }} />
                  <Bar dataKey="value" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card className="bg-white bg-opacity-80 backdrop-filter backdrop-blur-lg">
            <CardHeader>
              <CardTitle className="text-blue-600">{t.expensesDistribution}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={expensesData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {expensesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', borderColor: '#1E40AF', color: '#1E40AF' }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card className="bg-white bg-opacity-80 backdrop-filter backdrop-blur-lg">
            <CardHeader>
              <CardTitle className="text-blue-600">{t.profitVsCost}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={profitData}>
                  <XAxis dataKey="name" stroke="#1E40AF" />
                  <YAxis stroke="#1E40AF" />
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', borderColor: '#1E40AF', color: '#1E40AF' }} />
                  <Bar dataKey="value" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
        <div className="mt-8 flex justify-center">
          <Button onClick={savePDF} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded inline-flex items-center">
            <Download className="w-4 h-4 mr-2" />
            {t.saveAsPDF}
          </Button>
        </div>
      </div>
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        @keyframes backgroundShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        body {
          background: linear-gradient(-45deg, #ff6ad5, #c774e8, #ad8cff, #8795e8, #94d0ff);
          background-size: 400% 400%;
          animation: backgroundShift 15s ease infinite;
        }
      `}</style>
    </div>
  )
}