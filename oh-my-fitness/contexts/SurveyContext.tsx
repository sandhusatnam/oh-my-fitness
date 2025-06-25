import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export interface SurveyData {
  // Step 1: About you
  fitnessGoals: string[];
  currentWeight: string;
  desiredWeight: string;
  height: string;
  fitnessLevel: string;
  ageGroup: string;
  
  // Step 2: Schedule
  workoutDaysPerWeek: number;
  preferredWorkoutTime: string;
  availableEquipment: string[];
  
  // Step 3: Dietary preferences
  dietaryPreferences: string[];
  dietaryRestrictions: string[];
  otherRestrictions: string;
  healthConsiderations: string;
  
  // Step 4: Workout preferences
  enjoyedWorkouts: string[];
  workoutsToAvoid: string[];
}

interface SurveyState {
  currentStep: number;
  data: Partial<SurveyData>;
  totalSteps: number;
}

type SurveyAction = 
  | { type: 'UPDATE_DATA'; payload: Partial<SurveyData> }
  | { type: 'NEXT_STEP' }
  | { type: 'PREVIOUS_STEP' }
  | { type: 'RESET' };

const initialState: SurveyState = {
  currentStep: 1,
  data: {},
  totalSteps: 4,
};

const surveyReducer = (state: SurveyState, action: SurveyAction): SurveyState => {
  switch (action.type) {
    case 'UPDATE_DATA':
      return {
        ...state,
        data: { ...state.data, ...action.payload },
      };
    case 'NEXT_STEP':
      return {
        ...state,
        currentStep: Math.min(state.currentStep + 1, state.totalSteps),
      };
    case 'PREVIOUS_STEP':
      return {
        ...state,
        currentStep: Math.max(state.currentStep - 1, 1),
      };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
};

interface SurveyContextType {
  state: SurveyState;
  updateData: (data: Partial<SurveyData>) => void;
  nextStep: () => void;
  previousStep: () => void;
  reset: () => void;
}

const SurveyContext = createContext<SurveyContextType | undefined>(undefined);

export const SurveyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(surveyReducer, initialState);

  const updateData = (data: Partial<SurveyData>) => {
    dispatch({ type: 'UPDATE_DATA', payload: data });
  };

  const nextStep = () => {
    dispatch({ type: 'NEXT_STEP' });
  };

  const previousStep = () => {
    dispatch({ type: 'PREVIOUS_STEP' });
  };

  const reset = () => {
    dispatch({ type: 'RESET' });
  };

  return (
    <SurveyContext.Provider value={{ state, updateData, nextStep, previousStep, reset }}>
      {children}
    </SurveyContext.Provider>
  );
};

export const useSurvey = () => {
  const context = useContext(SurveyContext);
  if (context === undefined) {
    throw new Error('useSurvey must be used within a SurveyProvider');
  }
  return context;
};