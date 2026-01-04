import './globals.css'

export const metadata = {
  title: 'Frog API 🐸',
  description: 'Welcome to the amazing world of frogs!',
}

export default function RootLayout({ children }) {
  return (
    <html lang="uk">
      <head>
        <link href="https://fonts.googleapis.com/css?family=Playpen+Sans:100,200,300,regular,500,600,700,800" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  )
}