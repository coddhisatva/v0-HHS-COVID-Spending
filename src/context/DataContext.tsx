'use client';

import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import {
  AppState,
  AppAction,
  FinancialActivityType,
  TransactionType,
  DataSourceType,
  FilterState,
  Transaction,
  SummaryData,
  ChartData
} from '@/types/data';

// Initial filter state
const initialFilterState: FilterState = {
  activityType: FinancialActivityType.ALL,
  transactionType: TransactionType.ALL,
  dataSource: DataSourceType.ALL,
  emergencyFunding: [],
  startDate: null,
  endDate: null,
  selectedState: null,
  selectedRecipient: null,
  selectedProgram: null,
};

// Mock summary data
const mockSummaryData: SummaryData = {
  totalAllocations: 173047914677,
  totalDeallocations: 3235800720,
  totalOutlays: 21300445282,
  recipientCount: 30,
  programCount: 20,
  stateCount: 51,
};

// Mock chart data
const mockChartData: ChartData = {
  emergencyFundingBreakdown: [
    { name: 'CARES Act', value: 78000000000, id: 'CARES Act' },
    { name: 'American Rescue Plan', value: 59000000000, id: 'American Rescue Plan' },
    { name: 'COVID-19 Supplemental', value: 22000000000, id: 'COVID-19 Supplemental' },
    { name: 'Paycheck Protection Program', value: 10000000000, id: 'Paycheck Protection Program' },
    { name: 'Families First Coronavirus Response Act', value: 5000000000, id: 'Families First Coronavirus Response Act' },
    { name: 'Other', value: 3000000000, id: 'Other' },
  ],
  topRecipients: [
    { name: 'State of California', allocations: 15000000000, deallocations: 320000000 },
    { name: 'State of New York', allocations: 12000000000, deallocations: 250000000 },
    { name: 'State of Texas', allocations: 11000000000, deallocations: 200000000 },
    { name: 'State of Florida', allocations: 9000000000, deallocations: 180000000 },
    { name: 'Moderna', allocations: 7000000000, deallocations: 0 },
    { name: 'Pfizer', allocations: 6500000000, deallocations: 0 },
    { name: 'Johnson & Johnson', allocations: 5000000000, deallocations: 100000000 },
    { name: 'State of Illinois', allocations: 4500000000, deallocations: 90000000 },
    { name: 'State of Pennsylvania', allocations: 4200000000, deallocations: 85000000 },
    { name: 'State of Ohio', allocations: 3800000000, deallocations: 75000000 },
  ],
  topPrograms: [
    { name: 'Provider Relief Fund', allocations: 35000000000, deallocations: 500000000 },
    { name: 'COVID-19 Testing', allocations: 25000000000, deallocations: 300000000 },
    { name: 'Vaccine Development', allocations: 20000000000, deallocations: 0 },
    { name: 'Hospital Preparedness', allocations: 15000000000, deallocations: 200000000 },
    { name: 'Public Health Emergency Response', allocations: 12000000000, deallocations: 150000000 },
    { name: 'Community Health Centers', allocations: 10000000000, deallocations: 100000000 },
    { name: 'Mental Health Services', allocations: 8000000000, deallocations: 80000000 },
    { name: 'Substance Abuse Treatment', allocations: 7000000000, deallocations: 70000000 },
    { name: 'Child Care Development Block Grant', allocations: 6000000000, deallocations: 60000000 },
    { name: 'Telehealth Initiatives', allocations: 5000000000, deallocations: 50000000 },
  ],
  stateData: [
    { state: 'CA', amount: 15000000000 },
    { state: 'NY', amount: 12000000000 },
    { state: 'TX', amount: 11000000000 },
    { state: 'FL', amount: 9000000000 },
    { state: 'IL', amount: 4500000000 },
    { state: 'PA', amount: 4200000000 },
    { state: 'OH', amount: 3800000000 },
    { state: 'GA', amount: 3200000000 },
    { state: 'NC', amount: 3000000000 },
    { state: 'MI', amount: 2800000000 },
    { state: 'NJ', amount: 2500000000 },
    { state: 'VA', amount: 2400000000 },
    { state: 'WA', amount: 2300000000 },
    { state: 'MA', amount: 2200000000 },
    { state: 'TN', amount: 2100000000 },
    { state: 'IN', amount: 2000000000 },
    { state: 'AZ', amount: 1900000000 },
    { state: 'MO', amount: 1800000000 },
    { state: 'MD', amount: 1700000000 },
    { state: 'WI', amount: 1600000000 },
    { state: 'MN', amount: 1500000000 },
    { state: 'CO', amount: 1400000000 },
    { state: 'AL', amount: 1300000000 },
    { state: 'SC', amount: 1200000000 },
    { state: 'LA', amount: 1100000000 },
    { state: 'KY', amount: 1000000000 },
    { state: 'OR', amount: 950000000 },
    { state: 'OK', amount: 900000000 },
    { state: 'CT', amount: 850000000 },
    { state: 'IA', amount: 800000000 },
    { state: 'MS', amount: 750000000 },
    { state: 'AR', amount: 700000000 },
    { state: 'KS', amount: 650000000 },
    { state: 'UT', amount: 600000000 },
    { state: 'NV', amount: 550000000 },
    { state: 'NM', amount: 500000000 },
    { state: 'WV', amount: 450000000 },
    { state: 'NE', amount: 400000000 },
    { state: 'ID', amount: 350000000 },
    { state: 'HI', amount: 300000000 },
    { state: 'NH', amount: 250000000 },
    { state: 'ME', amount: 200000000 },
    { state: 'MT', amount: 150000000 },
    { state: 'RI', amount: 140000000 },
    { state: 'DE', amount: 130000000 },
    { state: 'SD', amount: 120000000 },
    { state: 'ND', amount: 110000000 },
    { state: 'AK', amount: 100000000 },
    { state: 'VT', amount: 90000000 },
    { state: 'WY', amount: 80000000 },
    { state: 'DC', amount: 350000000 },
  ],
};

// Initial app state
const initialState: AppState = {
  isLoading: false,
  error: null,
  filterState: initialFilterState,
  transactions: [],
  filteredTransactions: [],
  summaryData: mockSummaryData,
  chartData: mockChartData,
};

// Reducer function
function dataReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_FILTER':
      return {
        ...state,
        filterState: {
          ...state.filterState,
          ...action.payload,
        },
      };
    case 'RESET_FILTERS':
      return {
        ...state,
        filterState: initialFilterState,
      };
    case 'SET_TRANSACTIONS':
      return {
        ...state,
        transactions: action.payload,
      };
    case 'SET_FILTERED_TRANSACTIONS':
      return {
        ...state,
        filteredTransactions: action.payload,
      };
    case 'SET_SUMMARY_DATA':
      return {
        ...state,
        summaryData: action.payload,
      };
    case 'SET_CHART_DATA':
      return {
        ...state,
        chartData: action.payload,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
}

// Create the context
interface DataContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Provider component
export function DataProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(dataReducer, initialState);

  // Example: Effect to filter transactions when filter state changes
  useEffect(() => {
    if (state.transactions.length === 0) return;

    // Filter logic would go here
    // For now, we'll just pass through the transactions
    dispatch({
      type: 'SET_FILTERED_TRANSACTIONS',
      payload: state.transactions,
    });
  }, [state.filterState, state.transactions]);

  return (
    <DataContext.Provider value={{ state, dispatch }}>
      {children}
    </DataContext.Provider>
  );
}

// Custom hook for using the data context
export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
} 