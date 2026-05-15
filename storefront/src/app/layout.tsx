import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import "@/styles/globals.css"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning ігнорує розбіжності в атрибутах, 
    // які додають розширення браузера типу Dark Reader
    <html lang="en" data-mode="light" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        {/* Підключаємо FontAwesome для іконок */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css"
          integrity="sha512-Kc323vGBEqzTmouAECnVceyQqyqdsSiqLQISBL29aUW4U/M7pSPA/gEUZQqv1cwx4OnYxTxve5UMg5GT6L4JJg=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      {/* suppressHydrationWarning також корисно продублювати на body, 
          якщо розширення вкидають туди свої класи або стилі */}
      <body suppressHydrationWarning>
        <main className="relative">{props.children}</main>
      </body>
    </html>
  )
}