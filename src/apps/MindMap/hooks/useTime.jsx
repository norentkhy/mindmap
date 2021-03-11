import produce from 'immer';
import React, { createContext, useEffect, useReducer } from 'react';

export const TimeContext = createContext();

export function TimeProvider({ children, initialState = {} }) {
  const [state, dispatch] = useReducer(reduce, {
    callback: () => {},
    ...initialState,
  });

  useEffect(state.callback, [state.callback]);

  const viewModel = {
    state,
    insertIntoTimeline({ target, timeInstance, callback }) {
      dispatch({
        type: 'INSERT_INTO_TIMELINE',
        payload: { target, timeInstance, callback },
      });
    },
    goBack({ target, distance = 1, callback }) {
      dispatch({
        type: 'GO_BACK_IN_TIMELINE',
        payload: { target, distance, callback },
      });
    },
    goForward({ target, distance = 1, callback }) {
      dispatch({
        type: 'GO_FORWARD_IN_TIMELINE',
        payload: { target, distance, callback },
      });
    },
  };

  return (
    <TimeContext.Provider value={viewModel}>{children}</TimeContext.Provider>
  );

  function reduce(state, action) {
    const computeNewState = stateModel[action.type];
    const newState = computeNewState(state, action);

    const { target, callback } = action.payload;
    const targetState = getTargetState({ target, state: newState });
    const newStateWithCallback = produce(newState, (draft) => {
      if (callback) draft.callback = () => callback(targetState);
    });

    return newStateWithCallback;
  }
}

export function useTime(
  initialTimeline = { pasts: [], present: null, futures: [] }
) {
  const [timeline, dispatch] = useReducer(reduce, initialTimeline);

  return {
    timeline,
    insertIntoTimeline(timeInstance) {
      dispatch({ type: 'INSERT_INTO_TIMELINE', payload: timeInstance });
    },
    goBack(distance = 1) {
      dispatch({ type: 'GO_BACK_IN_TIMELINE', payload: distance });
    },
    goForward(distance = 1) {
      dispatch({ type: 'GO_FORWARD_IN_TIMELINE', payload: distance });
    },
  };

  function reduce(timeline, action) {
    const stateTransitions = {
      INSERT_INTO_TIMELINE(timeline, timeInstance) {
        return produce(timeline, (newTimeline) => {
          const { pasts, present } = newTimeline;
          if (!isInitial(timeline)) pasts.push(present);
          newTimeline.present = timeInstance;
          newTimeline.futures = [];
        });
      },
      GO_BACK_IN_TIMELINE(timeline, distance) {
        return produce(timeline, (newTimeline) => {
          repeatFn({
            amount: Math.min(timeline.pasts.length, distance),
            fn: () => shiftPresentToFuture(newTimeline),
          });
        });

        function shiftPresentToFuture(timeline) {
          const { pasts, present, futures } = timeline;

          futures.unshift(present);
          const newPresent = pasts.pop();
          timeline.present = newPresent;
        }
      },
      GO_FORWARD_IN_TIMELINE(timeline, distance) {
        return produce(timeline, (newTimeline) => {
          repeatFn({
            amount: Math.min(timeline.futures.length, distance),
            fn: () => shiftFutureToPresent(newTimeline),
          });
        });

        function shiftFutureToPresent(timeline) {
          const { pasts, present, futures } = timeline;

          pasts.push(present);
          const newPresent = futures.shift();
          timeline.present = newPresent;
        }
      },
    };

    const calculateNewState = stateTransitions[action.type];
    const newTimeline = calculateNewState(timeline, action.payload);

    return newTimeline;

    function isInitial({ pasts, present, futures }) {
      return present === null && !pasts.length && !futures.length;
    }
  }
}

const stateModel = {
  //
  INSERT_INTO_TIMELINE(state, action) {
    const { target, timeInstance } = action.payload;

    return produce(state, (newState) => {
      const newTargetState = getOrInitTargetState({
        target,
        state: newState,
      });
      const { pasts, present } = newTargetState;

      if (!isInitial(newTargetState)) pasts.push(present);
      newTargetState.present = timeInstance;
      newTargetState.futures = [];
    });
  },
  //
  GO_BACK_IN_TIMELINE(state, action) {
    const { target, distance } = action.payload;

    return produce(state, (newState) => {
      const newTargetState = getOrInitTargetState({
        target,
        state: newState,
      });

      const { pasts } = getOrInitTargetState({ target, state });
      const maxSteps = pasts.length;
      const steps = Math.min(distance, maxSteps);

      for (let i = 0; i < steps; i++) {
        shiftPresentToFuture(newTargetState);
      }
    });

    function shiftPresentToFuture(targetState) {
      const { pasts, present, futures } = targetState;

      futures.unshift(present);
      const newPresent = pasts.pop();
      targetState.present = newPresent;
    }
  },
  //
  GO_FORWARD_IN_TIMELINE(state, action) {
    const { target, distance } = action.payload;

    return produce(state, (newState) => {
      const newTargetState = getOrInitTargetState({ target, state: newState });

      const { futures } = getTargetState({ target, state: newState });
      repeatFn({
        amount: Math.min(futures.length, distance),
        fn: () => shiftFutureToPresent(newTargetState),
      });
    });

    function shiftFutureToPresent(targetState) {
      const { pasts, present, futures } = targetState;

      pasts.push(present);
      const newPresent = futures.shift();
      targetState.present = newPresent;
    }
  },
};

function repeatFn({ amount, fn }) {
  for (let i = 0; i < amount; i++) {
    fn();
  }
}

function isInitial(targetState) {
  const entries = Object.entries(targetState);
  const initialTargetState = createInitialTargetState();

  return entries.reduce(areInitialEntries, true);

  function areInitialEntries(initial, [key, value]) {
    if (key === 'pasts' || key === 'futures')
      return initial && value.length === initialTargetState[key].length;
    else return initial && value === initialTargetState[key];
  }
}

function getTargetState({ target, state, result }) {
  if (result) return result.current.state[target];
  if (state) return state[target];
}

function getOrInitTargetState({ target, state, result }) {
  if (result) return getOrInit(result.current.state);
  if (state) return getOrInit(state);

  function getOrInit(actualState) {
    const isInitialized = !actualState[target];
    if (isInitialized) actualState[target] = createInitialTargetState();
    return actualState[target];
  }
}
function createInitialTargetState() {
  return { pasts: [], present: undefined, futures: [] };
}
