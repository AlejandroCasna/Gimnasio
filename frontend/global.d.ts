// global.d.ts
declare module 'qrcode.react' {
  import { ComponentType, SVGProps } from 'react'
  export interface QRCodeProps {
    value: string
    size?: number
    bgColor?: string
    fgColor?: string
    level?: 'L' | 'M' | 'Q' | 'H'
    includeMargin?: boolean
  }
  const QRCode: ComponentType<QRCodeProps & SVGProps<SVGSVGElement>>
  export default QRCode
}
