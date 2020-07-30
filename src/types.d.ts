declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV: 'production' | 'development'
    PORT: string
    JWT_SECRET: string
    GOOGLE_CLIENT_ID?: string
    GOOGLE_CLIENT_SECRET?: string
    GITHUB_CLIENT_ID?: string
    GITHUB_CLIENT_SECRET?: string
    OAUTH_CALLBACK_URL: string
    OAUTH_REDIRECT_URL: string
  }
}

declare type TODO = any
