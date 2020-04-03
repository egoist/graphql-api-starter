import jwt from 'jsonwebtoken'

export function verifyToken(token: string) {
  const { sub } = jwt.verify(token, process.env.JWT_SECRET) as any
  return { userId: sub } as { userId: string }
}

export function generateToken(userId: string) {
  return jwt.sign({ sub: userId }, process.env.JWT_SECRET, {
    expiresIn: '60d',
  })
}