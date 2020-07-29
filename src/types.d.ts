declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV: 'production' | 'development'
    PORT: string
    JWT_SECRET: string
  }
}

declare type TODO = any
