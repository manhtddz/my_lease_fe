export const PageLoadStatus = {
    IDLE: 'idle',
    LOADING: 'loading',
    SUCCEEDED: 'succeeded',
    FAILED: 'failed',
  } as const;
  
  // Create a type from the object values
  export type PageLoadStatusType = (typeof PageLoadStatus)[keyof typeof PageLoadStatus];
  